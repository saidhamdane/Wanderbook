import { NextResponse } from 'next/server';
import { getPartnerSession } from '@/lib/auth/partner-session';
import {
  getPartnerBySlug,
  getPartnerByEmail,
  updatePartnerBillingInSupabase,
} from '@/lib/db/partners';
import { appUrl, getStripe, stripeConfigured } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  // 1. Verify session
  const session = getPartnerSession();
  if (!session) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please log in before upgrading.',
        redirect: '/partner/login?next=/partner/upgrade',
      },
      { status: 401 },
    );
  }

  const { partnerId, partnerSlug, email } = session;

  // 2. Look up partner from Supabase: slug → email
  let partner = partnerSlug ? await getPartnerBySlug(partnerSlug) : null;
  if (!partner && email) {
    const byEmail = await getPartnerByEmail(email);
    if (byEmail) partner = byEmail as unknown as typeof partner;
  }

  if (!partner) {
    console.error(
      '[stripe/checkout] Partner not found — partnerId:', partnerId,
      'partnerSlug:', partnerSlug,
      'email:', email,
    );
    return NextResponse.json({ ok: false, error: 'Partner not found' }, { status: 404 });
  }

  // 3. Validate Stripe config
  const priceId = process.env.STRIPE_PRICE_UNLIMITED_MONTHLY;
  const isPlaceholder = !priceId || !priceId.startsWith('price_') || /_/.test(priceId.slice(6));
  if (!stripeConfigured() || isPlaceholder) {
    return NextResponse.json(
      { ok: false, error: 'Stripe is not configured yet. Add the real Stripe Price ID.' },
      { status: 503 },
    );
  }

  const stripe = getStripe();

  // 4. Get or create Stripe customer
  const partnerEmail = email || partner.email || '';
  const partnerName = partner.businessName || partnerSlug || '';
  const resolvedPartnerId = partnerId || partner.id || '';
  const resolvedSlug = partnerSlug || partner.slug || '';
  const existingCustomerId = partner.stripeCustomerId;

  const customerId =
    existingCustomerId ||
    (
      await stripe.customers.create({
        email: partnerEmail,
        name: partnerName,
        metadata: { partnerId: resolvedPartnerId, partnerSlug: resolvedSlug },
      })
    ).id;

  if (!existingCustomerId) {
    await updatePartnerBillingInSupabase(resolvedSlug, { stripeCustomerId: customerId });
  }

  // 5. Create Stripe Checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl()}/partner/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl()}/partner/upgrade?cancelled=1`,
    client_reference_id: resolvedSlug,
    metadata: {
      partnerId: resolvedPartnerId,
      partnerSlug: resolvedSlug,
      partnerEmail: partnerEmail,
    },
    subscription_data: {
      metadata: {
        partnerId: resolvedPartnerId,
        partnerSlug: resolvedSlug,
        partnerEmail: partnerEmail,
      },
    },
  });

  return NextResponse.json({ ok: true, url: checkoutSession.url });
}
