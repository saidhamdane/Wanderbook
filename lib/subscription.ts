import { getSupabaseAdmin } from './supabase';

export const PAID_SUBSCRIPTION_STATUSES = ['active', 'trialing'] as const;

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: string;
  status: SubscriptionStatus;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export async function hasUnlimitedAccess(userId: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return false;
  const { data } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .maybeSingle();
  return data !== null;
}

export async function upsertUserSubscription(
  userId: string,
  fields: {
    stripe_customer_id?: string | null;
    stripe_subscription_id?: string | null;
    plan?: string;
    status: SubscriptionStatus;
    current_period_end?: string | null;
  }
): Promise<UserSubscription | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('[subscription] Supabase admin client not available — check env vars');
    return null;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan: fields.plan ?? 'unlimited_monthly',
        ...fields,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error('[subscription] upsert error:', error.message);
    return null;
  }
  return data as UserSubscription | null;
}

export async function getUserSubscriptionByCustomerId(customerId: string): Promise<UserSubscription | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return (data as UserSubscription | null) ?? null;
}

export async function getUserSubscriptionBySubscriptionId(subscriptionId: string): Promise<UserSubscription | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .maybeSingle();
  return (data as UserSubscription | null) ?? null;
}
