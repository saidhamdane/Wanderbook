import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  PARTNER_SESSION_COOKIE,
  getPartnerAccountById,
  getPartnerIdForSession,
  updatePartnerBilling,
} from '@/lib/partner-store';
import { appUrl, getStripe, stripeConfigured } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const partnerId = getPartnerIdForSession(cookies().get(PARTNER_SESSION_COOKIE)?.value);
  if (!partnerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const partner = getPartnerAccountById(partnerId);
  if (!partner) return NextResponse.json({ error: 'Partner not found' }, { status: 404 });

  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_UNLIMITED_MONTHLY;
  // A real Stripe price ID starts with "price_" and has no additional underscores (e.g. price_1Thu8k7…).
  // Placeholders like price_NEW_95_MONTHLY or price_xxx_real_95_monthly contain underscores after the prefix.
  const isPlaceholder = !priceId || !priceId.startsWith('price_') || /_/.test(priceId.slice(6));
  if (!stripe || isPlaceholder || !stripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured yet. Add the real Stripe Price ID.' },
      { status: 503 },
    );
  }

  const customerId = partner.stripeCustomerId || (
    await stripe.customers.create({
      email: partner.email,
      name: partner.businessName,
      metadata: { partnerId: partner.id },
    })
  ).id;

  if (!partner.stripeCustomerId) {
    updatePartnerBilling(partner.id, { stripeCustomerId: customerId });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl()}/partner/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/partner/upgrade?cancelled=1`,
    metadata: {
      partnerId: partner.id,
      plan: 'unlimited_monthly',
    },
    subscription_data: {
      metadata: {
        partnerId: partner.id,
        plan: 'unlimited_monthly',
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
