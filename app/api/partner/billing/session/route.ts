import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  PARTNER_SESSION_COOKIE,
  UNLIMITED_MONTHLY_MAGAZINE_LIMIT,
  getPartnerIdForSession,
  updatePartnerBilling,
} from '@/lib/partner-store';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isoFromUnix(timestamp?: number | null): string | undefined {
  return timestamp ? new Date(timestamp * 1000).toISOString() : undefined;
}

function subscriptionPeriodEnd(subscription: Stripe.Subscription): string | undefined {
  return isoFromUnix((subscription as unknown as { current_period_end?: number }).current_period_end);
}

export async function GET(req: NextRequest) {
  const partnerId = getPartnerIdForSession(cookies().get(PARTNER_SESSION_COOKIE)?.value);
  if (!partnerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id.' }, { status: 400 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe is not configured yet.' }, { status: 503 });

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['subscription'],
  });

  if (session.metadata?.partnerId !== partnerId) {
    return NextResponse.json({ error: 'Checkout session does not belong to this partner.' }, { status: 403 });
  }

  const subscription = typeof session.subscription === 'string'
    ? await stripe.subscriptions.retrieve(session.subscription)
    : session.subscription;
  const status = subscription?.status;
  const active = status === 'active' || status === 'trialing';

  if (active && subscription) {
    updatePartnerBilling(partnerId, {
      plan: 'unlimited_monthly',
      subscriptionStatus: status,
      stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer?.id,
      stripeSubscriptionId: subscription.id,
      currentPeriodEnd: subscriptionPeriodEnd(subscription),
      monthlyMagazineLimit: UNLIMITED_MONTHLY_MAGAZINE_LIMIT,
    });
  }

  return NextResponse.json({
    active,
    plan: 'unlimited_monthly',
    status: status || session.status,
  });
}
