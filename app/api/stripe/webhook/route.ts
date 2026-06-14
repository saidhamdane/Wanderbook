import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  FREE_MONTHLY_MAGAZINE_LIMIT,
  UNLIMITED_MONTHLY_MAGAZINE_LIMIT,
  getPartnerAccountBySlug,
  getPartnerAccountByStripeCustomerId,
  getPartnerAccountByStripeSubscriptionId,
  getPartnerAccountById,
  updatePartnerBilling,
} from '@/lib/partner-store';
import { getStripe } from '@/lib/stripe';
import {
  getUserSubscriptionByCustomerId,
  getUserSubscriptionBySubscriptionId,
  upsertUserSubscription,
  type SubscriptionStatus,
} from '@/lib/subscription';
import { updatePartnerBillingInSupabase } from '@/lib/db/partners';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------- shared helpers ----------

function isoFromUnix(ts?: number | null): string | undefined {
  return ts ? new Date(ts * 1000).toISOString() : undefined;
}

function subscriptionPeriodEnd(sub: Stripe.Subscription): string | undefined {
  return isoFromUnix((sub as unknown as { current_period_end?: number }).current_period_end);
}

function stripeStatusToUserStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === 'active') return 'active';
  if (status === 'trialing') return 'trialing';
  if (status === 'past_due') return 'past_due';
  if (status === 'unpaid') return 'unpaid';
  if (status === 'incomplete') return 'incomplete';
  if (status === 'incomplete_expired') return 'incomplete_expired';
  return 'canceled';
}

// ---------- partner path ----------

function partnerAccessForStatus(status: Stripe.Subscription.Status): {
  plan: 'free' | 'unlimited_monthly';
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  monthlyMagazineLimit: number;
} {
  if (status === 'active' || status === 'trialing') {
    return {
      plan: 'unlimited_monthly',
      subscriptionStatus: status,
      monthlyMagazineLimit: UNLIMITED_MONTHLY_MAGAZINE_LIMIT,
    };
  }
  const inactiveStatus = status === 'paused' ? 'canceled' : status;
  return {
    plan: 'free',
    subscriptionStatus: inactiveStatus,
    monthlyMagazineLimit: FREE_MONTHLY_MAGAZINE_LIMIT,
  };
}

function resolveCustomerId(sub: Stripe.Subscription): string | undefined {
  return typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
}

async function handlePartnerSubscription(sub: Stripe.Subscription): Promise<boolean> {
  const partnerId =
    sub.metadata?.partnerId ||
    (sub.metadata?.partnerSlug ? getPartnerAccountBySlug(sub.metadata.partnerSlug)?.id : undefined) ||
    (resolveCustomerId(sub) ? getPartnerAccountByStripeCustomerId(resolveCustomerId(sub)!)?.id : undefined) ||
    getPartnerAccountByStripeSubscriptionId(sub.id)?.id;

  if (!partnerId) return false;

  const access = partnerAccessForStatus(sub.status);
  const updated = updatePartnerBilling(partnerId, {
    ...access,
    stripeCustomerId: resolveCustomerId(sub),
    stripeSubscriptionId: sub.id,
    currentPeriodEnd: subscriptionPeriodEnd(sub),
  });
  if (updated?.slug) {
    await updatePartnerBillingInSupabase(updated.slug, {
      plan: access.plan,
      subscriptionStatus: access.subscriptionStatus,
      stripeCustomerId: resolveCustomerId(sub),
      stripeSubscriptionId: sub.id,
    });
  }
  console.log(`[webhook] Subscription updated: partner=${partnerId} status=${sub.status}`);
  return true;
}

// ---------- user path ----------

async function handleUserSubscription(sub: Stripe.Subscription): Promise<boolean> {
  let userId: string | undefined = sub.metadata?.user_id || undefined;

  if (!userId) {
    const existing =
      (await getUserSubscriptionBySubscriptionId(sub.id)) ||
      (resolveCustomerId(sub) ? await getUserSubscriptionByCustomerId(resolveCustomerId(sub)!) : null);
    userId = existing?.user_id ?? undefined;
  }

  if (!userId) return false;

  const status = stripeStatusToUserStatus(sub.status);
  await upsertUserSubscription(userId, {
    stripe_customer_id: resolveCustomerId(sub) ?? null,
    stripe_subscription_id: sub.id,
    plan: 'unlimited_monthly',
    status,
    current_period_end: subscriptionPeriodEnd(sub) ?? null,
  });
  console.log(`[webhook] Subscription updated: user_id=${userId} status=${status}`);
  return true;
}

async function handleSubscription(sub: Stripe.Subscription) {
  const handledAsPartner = await handlePartnerSubscription(sub);
  if (!handledAsPartner) await handleUserSubscription(sub);
}

// ---------- route ----------

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    console.error('[webhook] Stripe not configured — set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Stripe webhook is not configured yet.' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    console.warn('[webhook] Missing Stripe signature header');
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  }

  // Raw body must be read BEFORE any JSON parsing for signature verification to work.
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    console.error(`[webhook] Signature verification failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`[webhook] Received: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;

      const partnerId = session.metadata?.partnerId;
      const partnerSlug = session.metadata?.partnerSlug;
      const userId = !partnerId && !partnerSlug
        ? session.metadata?.user_id || session.client_reference_id
        : undefined;

      const resolvedPartnerId =
        partnerId ||
        (partnerSlug ? getPartnerAccountBySlug(partnerSlug)?.id : undefined);

      if (resolvedPartnerId) {
        const sub =
          typeof session.subscription === 'string'
            ? await stripe.subscriptions.retrieve(session.subscription)
            : session.subscription || null;
        const access = sub
          ? partnerAccessForStatus(sub.status)
          : { plan: 'unlimited_monthly' as const, subscriptionStatus: 'active' as const, monthlyMagazineLimit: UNLIMITED_MONTHLY_MAGAZINE_LIMIT };
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const stripeSubscriptionId = sub?.id || (typeof session.subscription === 'string' ? session.subscription : session.subscription?.id);
        updatePartnerBilling(resolvedPartnerId, {
          ...access,
          stripeCustomerId,
          stripeSubscriptionId,
          currentPeriodEnd: sub ? subscriptionPeriodEnd(sub) : undefined,
        });
        const partnerAccount = getPartnerAccountById(resolvedPartnerId);
        if (partnerAccount?.slug) {
          await updatePartnerBillingInSupabase(partnerAccount.slug, {
            plan: access.plan,
            subscriptionStatus: access.subscriptionStatus,
            stripeCustomerId,
            stripeSubscriptionId,
          });
        }
        console.log(`[webhook] Checkout completed: partner=${resolvedPartnerId}`);
      } else if (userId) {
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const sub =
          typeof session.subscription === 'string'
            ? await stripe.subscriptions.retrieve(session.subscription)
            : session.subscription || null;
        const status = sub ? stripeStatusToUserStatus(sub.status) : 'active';
        await upsertUserSubscription(userId, {
          stripe_customer_id: customerId ?? null,
          stripe_subscription_id:
            sub?.id || (typeof session.subscription === 'string' ? session.subscription : session.subscription?.id) || null,
          plan: 'unlimited_monthly',
          status,
          current_period_end: sub ? subscriptionPeriodEnd(sub) ?? null : null,
        });
        console.log(`[webhook] Checkout completed: user_id=${userId} status=${status}`);
      } else {
        console.warn('[webhook] checkout.session.completed: no partnerId or user_id found in metadata/client_reference_id');
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscription(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionRef = (invoice as unknown as { subscription?: string | Stripe.Subscription | null }).subscription;
      const succeeded = event.type === 'invoice.payment_succeeded';

      if (subscriptionRef) {
        const sub =
          typeof subscriptionRef === 'string'
            ? await stripe.subscriptions.retrieve(subscriptionRef)
            : subscriptionRef;
        await handleSubscription(sub);
        break;
      }

      // No subscription on invoice — fall back to customer ID lookup
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;

      const partner = customerId ? getPartnerAccountByStripeCustomerId(customerId) : null;
      if (partner) {
        updatePartnerBilling(partner.id, {
          plan: succeeded ? 'unlimited_monthly' : 'free',
          subscriptionStatus: succeeded ? 'active' : 'past_due',
          monthlyMagazineLimit: succeeded ? UNLIMITED_MONTHLY_MAGAZINE_LIMIT : FREE_MONTHLY_MAGAZINE_LIMIT,
        });
        console.log(`[webhook] Invoice ${event.type}: partner=${partner.id}`);
        break;
      }

      const userSub = customerId ? await getUserSubscriptionByCustomerId(customerId) : null;
      if (userSub) {
        const status: SubscriptionStatus = succeeded ? 'active' : 'past_due';
        await upsertUserSubscription(userSub.user_id, { status });
        console.log(`[webhook] Invoice ${event.type}: user_id=${userSub.user_id} status=${status}`);
      }
      break;
    }

    default:
      console.log(`[webhook] Unhandled event type (safe to ignore): ${event.type}`);
      break;
  }

  return NextResponse.json({ received: true });
}
