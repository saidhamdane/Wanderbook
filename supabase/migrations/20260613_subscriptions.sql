-- Subscriptions table for Wanderbook AI Unlimited individual users.
-- Run this in the Supabase SQL editor or via supabase db push.

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     UUID         NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                UUID         NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id     TEXT,
  stripe_subscription_id TEXT         UNIQUE,
  plan                   TEXT         NOT NULL DEFAULT 'unlimited_monthly',
  status                 TEXT         NOT NULL DEFAULT 'incomplete',
  current_period_end     TIMESTAMPTZ,
  created_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_stripe_customer_id_idx   ON public.subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON public.subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_status_idx        ON public.subscriptions (user_id, status);

-- Row-level security: users can read their own subscription; service role can write.
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role bypasses RLS by default; no INSERT/UPDATE policy needed for the webhook.
