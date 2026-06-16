-- Partner marketing fields: google review, instagram, booking, activity type
ALTER TABLE partners ADD COLUMN IF NOT EXISTS google_review_url text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS instagram_url text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS booking_url text;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS activity_type text;

-- Ensure partner_events table exists with all required columns
CREATE TABLE IF NOT EXISTS partner_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id  uuid,
  partner_slug text,
  magazine_id  text,
  event_type   text NOT NULL,
  metadata     jsonb DEFAULT '{}',
  created_at   timestamptz DEFAULT now()
);

-- Add columns that may be missing if the table already existed without them
ALTER TABLE partner_events ADD COLUMN IF NOT EXISTS partner_id   uuid;
ALTER TABLE partner_events ADD COLUMN IF NOT EXISTS partner_slug text;
ALTER TABLE partner_events ADD COLUMN IF NOT EXISTS magazine_id  text;
ALTER TABLE partner_events ADD COLUMN IF NOT EXISTS event_type   text;
ALTER TABLE partner_events ADD COLUMN IF NOT EXISTS metadata     jsonb DEFAULT '{}'::jsonb;
ALTER TABLE partner_events ADD COLUMN IF NOT EXISTS created_at   timestamptz DEFAULT now();

-- Indexes for fast analytics queries
CREATE INDEX IF NOT EXISTS partner_events_magazine_id_idx   ON partner_events (magazine_id);
CREATE INDEX IF NOT EXISTS partner_events_partner_id_idx    ON partner_events (partner_id);
CREATE INDEX IF NOT EXISTS partner_events_partner_slug_idx  ON partner_events (partner_slug);
CREATE INDEX IF NOT EXISTS partner_events_event_type_idx    ON partner_events (event_type);
CREATE INDEX IF NOT EXISTS partner_events_created_at_idx    ON partner_events (created_at);

-- Notify PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
