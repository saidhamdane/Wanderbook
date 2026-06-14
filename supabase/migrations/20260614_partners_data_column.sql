-- Add data jsonb column to partners for registration metadata.
-- Run in Supabase SQL Editor: https://app.supabase.com/project/_/sql

ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS data jsonb;
