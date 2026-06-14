-- Wanderbook Canarias — Supabase schema
-- Run this in the Supabase SQL editor after creating your project.

-- ─────────────────────────────────────────────
-- partners
-- Business profile + billing mirror.
-- Auth (email, passwordHash, sessions) stays in local JSON files.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  text        UNIQUE NOT NULL,
  business_name         text        NOT NULL,
  business_type         text,
  main_island           text,
  whatsapp              text,
  website               text,
  logo_url              text,
  branding_note         text,
  preferred_template_id text,
  plan                  text        DEFAULT 'free',
  subscription_status   text        DEFAULT 'none',
  stripe_customer_id    text,
  stripe_subscription_id text,
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- magazines
-- Metadata + full JSON document for each generated magazine.
-- id = auto-generated UUID (Supabase).
-- magazine_id = app-level id like "mag_1749801234567".
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS magazines (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  magazine_id  text        UNIQUE,
  template_id  text,
  destination  text,
  language     text,
  style        text,
  partner_slug text,
  partner_id   text,
  client_name  text,
  copy_source  text,
  share_url    text,
  pdf_url      text,
  data         jsonb,
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS magazines_magazine_id_idx  ON magazines (magazine_id);
CREATE INDEX IF NOT EXISTS magazines_partner_slug_idx ON magazines (partner_slug);
CREATE INDEX IF NOT EXISTS magazines_created_at_idx   ON magazines (created_at DESC);

-- ─────────────────────────────────────────────
-- leads
-- Sales CRM leads (mirrors data/leads.json).
-- status/notes are editable; use the migrate script to seed initial data.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tier              text,
  business_name     text        NOT NULL,
  location          text,
  phone             text,
  rating            numeric,
  reviews           integer,
  business_type     text,
  wanderbook_angle  text,
  status            text        DEFAULT 'Not contacted',
  notes             text,
  last_contacted_at timestamptz,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now(),
  UNIQUE (business_name, phone)
);

CREATE INDEX IF NOT EXISTS leads_tier_idx    ON leads (tier);
CREATE INDEX IF NOT EXISTS leads_status_idx  ON leads (status);

-- ─────────────────────────────────────────────
-- partner_events
-- Audit trail for partner actions (optional analytics).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partner_events (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_slug text,
  event_type   text        NOT NULL,
  metadata     jsonb       DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS partner_events_slug_idx ON partner_events (partner_slug);

-- ─────────────────────────────────────────────
-- subscriptions (user-level, for future consumer auth)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                text        UNIQUE NOT NULL,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text        DEFAULT 'unlimited_monthly',
  status                 text        DEFAULT 'active',
  current_period_end     timestamptz,
  created_at             timestamptz DEFAULT now(),
  updated_at             timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- Service-role bypasses RLS automatically.
-- These policies allow public read on partners + magazines.
-- ─────────────────────────────────────────────
ALTER TABLE partners        ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazines       ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads           ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;

-- Partners: public read (partner pages are public)
CREATE POLICY "partners_public_read"
  ON partners FOR SELECT USING (true);

-- Magazines: public read (preview URLs are public)
CREATE POLICY "magazines_public_read"
  ON magazines FOR SELECT USING (true);

-- Leads, events, subscriptions: service-role only (no anon access)
-- No SELECT policies needed — anon key cannot read these tables.

-- ─────────────────────────────────────────────
-- Storage buckets (create manually in Supabase dashboard)
-- ─────────────────────────────────────────────
-- partner-logos   Public bucket — partner logo images
-- magazine-photos Public bucket — client uploaded photos
-- magazine-pdfs   Public bucket — exported PDF magazines
-- qr-cards        Public bucket — generated QR card images
