#!/usr/bin/env node
/**
 * Create a password reset token for a partner and print the reset URL.
 *
 * Usage:
 *   node scripts/create-password-reset.cjs email@example.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

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
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const email = (process.argv[2] || '').trim().toLowerCase();
if (!email) {
  console.error('Usage: node scripts/create-password-reset.cjs email@example.com');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });

async function main() {
  const { data: partner, error } = await supabase
    .from('partners')
    .select('id, email, business_name')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error.message);
    process.exit(1);
  }

  if (!partner) {
    console.error(`No partner found with email: ${email}`);
    process.exit(1);
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from('partner_password_resets').insert({
    partner_id: partner.id,
    email: partner.email,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (insertError) {
    console.error('Failed to insert reset token:', insertError.message);
    process.exit(1);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wanderbookcanarias.com';
  const resetUrl = `${appUrl}/partner/reset-password?token=${rawToken}`;

  console.log('');
  console.log(`Partner:   ${partner.business_name} <${partner.email}>`);
  console.log(`Expires:   ${expiresAt}`);
  console.log('');
  console.log('Reset URL:');
  console.log(resetUrl);
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
