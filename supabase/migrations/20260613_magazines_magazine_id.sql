-- Migrate magazines table: add magazine_id and auto-generate Supabase UUID.
-- Run this in the Supabase SQL editor if the table was created from the old schema.

-- Add magazine_id column if it does not exist
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS magazine_id text;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS partner_id text;

-- Add unique constraint on magazine_id
CREATE UNIQUE INDEX IF NOT EXISTS magazines_magazine_id_key ON magazines (magazine_id);

-- Make id auto-generate UUID when not provided
ALTER TABLE magazines ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS magazines_magazine_id_idx ON magazines (magazine_id);
