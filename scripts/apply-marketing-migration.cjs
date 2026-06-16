#!/usr/bin/env node
/**
 * Apply the partner marketing migration to Supabase.
 *
 * REQUIREMENT: Set SUPABASE_DB_PASSWORD env var (find it in Supabase dashboard
 * → Project Settings → Database → Connection string → Database Password).
 *
 * Usage:
 *   SUPABASE_DB_PASSWORD=yourpassword node scripts/apply-marketing-migration.cjs
 *
 * Or add SUPABASE_DB_PASSWORD to .env.local first.
 *
 * Alternatively: paste supabase/migrations/20260616_partner_marketing_fields_and_events.sql
 * directly into the Supabase dashboard → SQL Editor → Run.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function loadEnv() {
  const envFile = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envFile)) return;
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

const dbPassword = process.env.SUPABASE_DB_PASSWORD;
if (!dbPassword) {
  console.error('\nError: SUPABASE_DB_PASSWORD not set.');
  console.error('\nTo find it:');
  console.error('1. Go to https://app.supabase.com');
  console.error('2. Select your project');
  console.error('3. Settings → Database → Connection string');
  console.error('4. Copy the password');
  console.error('\nThen run:');
  console.error('  SUPABASE_DB_PASSWORD=yourpassword node scripts/apply-marketing-migration.cjs');
  console.error('\nAlternatively, paste this SQL in your Supabase SQL Editor:');
  const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260616_partner_marketing_fields_and_events.sql');
  console.error(fs.readFileSync(sqlFile, 'utf-8'));
  process.exit(1);
}

const projectRef = 'jjlzbkklpzsokzyhucup';
const host = `db.${projectRef}.supabase.co`;
const sqlFile = path.join(__dirname, '..', 'supabase', 'migrations', '20260616_partner_marketing_fields_and_events.sql');

console.log('\nApplying migration:', path.basename(sqlFile));
console.log('Host:', host);

try {
  execSync(
    `PGPASSWORD=${JSON.stringify(dbPassword)} psql "postgresql://postgres@${host}:5432/postgres" -f "${sqlFile}"`,
    { stdio: 'inherit', shell: true }
  );
  console.log('\nMigration applied successfully!');
} catch (err) {
  console.error('\nMigration failed:', err.message);
  console.error('\nFallback: paste the SQL into the Supabase SQL Editor manually.');
  process.exit(1);
}
