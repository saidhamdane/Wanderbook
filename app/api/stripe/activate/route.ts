import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  UNLIMITED_MONTHLY_MAGAZINE_LIMIT,
  getPartnerAccountById,
  getPartnerAccountBySlug,
  updatePartnerBilling,
} from '@/lib/partner-store';
import { getStripe } from '@/lib/stripe';
import { updatePartnerBillingInSupabase } from '@/lib/db/partners';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isoFromUnix(ts?: number | null): string | undefined {
  return ts ? new Date(ts * 1000).toISOString() : undefined;
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id.' }, { status: 400 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe is not configured.' }, { status: 503 });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });

  if (session.mode !== 'subscription') {
    return NextResponse.json({ error: 'Not a subscription session.' }, { status: 400 });
  }

  const subscription =
    typeof session.subscription === 'string'
      ? await stripe.subscriptions.retrieve(session.subscription)
      : (session.subscription as Stripe.Subscription | null);

  const status = subscription?.status;
  const active = status === 'active' || status === 'trialing';

  // Resolve partner from metadata or client_reference_id
  const partnerId = session.metadata?.partnerId || undefined;
  const partnerSlug = session.metadata?.partnerSlug || session.client_reference_id || undefined;
  const partner =
    (partnerId ? getPartnerAccountById(partnerId) : null) ??
    (partnerSlug ? getPartnerAccountBySlug(partnerSlug) : null);

  if (partner && active && subscription) {
    const stripeCustomerId =
      typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const stripeSubscriptionId = subscription.id;
    const periodEnd = isoFromUnix(
      (subscription as unknown as { current_period_end?: number }).current_period_end,
    );

    updatePartnerBilling(partner.id, {
      plan: 'unlimited_monthly',
      subscriptionStatus: status,
      stripeCustomerId,
      stripeSubscriptionId,
      currentPeriodEnd: periodEnd,
      monthlyMagazineLimit: UNLIMITED_MONTHLY_MAGAZINE_LIMIT,
    });

    await updatePartnerBillingInSupabase(partner.slug, {
      plan: 'unlimited_monthly',
      subscriptionStatus: status,
      stripeCustomerId,
      stripeSubscriptionId,
    });
  }

  return NextResponse.json({
    active,
    plan: active ? 'unlimited_monthly' : 'free',
    status: status || session.status,
  });
}
