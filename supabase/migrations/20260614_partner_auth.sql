-- Partner authentication columns
-- Adds email, bcrypt password_hash, and last_login_at to the partners table.
-- Auth data was previously stored only in the local JSON flat-file store.
-- After running this migration, use scripts/set-partner-password.cjs to
-- set each partner's email + password in Supabase.

ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS email          text,
  ADD COLUMN IF NOT EXISTS password_hash  text,
  ADD COLUMN IF NOT EXISTS last_login_at  timestamptz;

-- Case-insensitive unique index on email (partial — only non-null rows)
CREATE UNIQUE INDEX IF NOT EXISTS partners_email_lower_idx
  ON partners (lower(email))
  WHERE email IS NOT NULL;
