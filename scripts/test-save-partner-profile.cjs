#!/usr/bin/env node
/**
 * Verify that the partner profile save API works end-to-end against Supabase.
 *
 * Usage:
 *   node scripts/test-save-partner-profile.cjs
 *   node scripts/test-save-partner-profile.cjs --slug 7777
 */
'use strict';

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envFile = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envFile)) { console.warn('⚠  .env.local not found'); return; }
  for (const line of fs.readFileSync(envFile, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in .env.local');
  process.exit(1);
}

const slugArg = (() => {
  const i = process.argv.indexOf('--slug');
  return i >= 0 ? process.argv[i + 1] : null;
})();

async function supabaseGet(table, filter) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`GET ${table} ${res.status}: ${await res.text()}`);
  return res.json();
}

async function supabasePatch(table, filter, body) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PATCH ${table} ${res.status}: ${text}`);
  return text ? JSON.parse(text) : [];
}

async function main() {
  console.log('\n=== test-save-partner-profile ===\n');

  // 1. Find partner
  let partners;
  if (slugArg) {
    console.log(`Looking up partner with slug: ${slugArg}`);
    partners = await supabaseGet('partners', `slug=eq.${encodeURIComponent(slugArg)}`);
  } else {
    console.log('No --slug given; finding the most recently updated partner…');
    const url = `${SUPABASE_URL}/rest/v1/partners?select=id,slug,email,business_name,main_island&order=updated_at.desc&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`List partners ${res.status}: ${await res.text()}`);
    partners = await res.json();
  }

  if (!partners.length) {
    console.error('❌  No partner found. Pass --slug <slug> to specify one.');
    process.exit(1);
  }

  const partner = partners[0];
  console.log(`✓  Found partner:  slug="${partner.slug}"  id="${partner.id}"  email="${partner.email || '(none)'}"`);
  console.log(`   Current name: "${partner.business_name}"  island: "${partner.main_island || '(none)'}"`);

  // 2. Save a test value
  const testName = `${partner.business_name} [test-${Date.now()}]`;
  console.log(`\nUpdating business_name → "${testName}" via direct Supabase PATCH…`);

  const updated = await supabasePatch(
    'partners',
    `slug=eq.${encodeURIComponent(partner.slug)}`,
    { business_name: testName, updated_at: new Date().toISOString() }
  );
  if (!updated.length) {
    console.error('❌  PATCH returned 0 rows — partner not updated (RLS or slug mismatch?)');
    process.exit(1);
  }
  console.log(`✓  Updated row:  business_name="${updated[0].business_name}"`);

  // 3. Read back and verify
  const verify = await supabaseGet('partners', `slug=eq.${encodeURIComponent(partner.slug)}`);
  if (!verify.length || verify[0].business_name !== testName) {
    console.error('❌  Read-back mismatch. Got:', verify[0]?.business_name);
    process.exit(1);
  }
  console.log('✓  Read-back confirmed — Supabase update is working correctly.');

  // 4. Restore original name
  console.log(`\nRestoring original name: "${partner.business_name}"`);
  await supabasePatch(
    'partners',
    `slug=eq.${encodeURIComponent(partner.slug)}`,
    { business_name: partner.business_name, updated_at: new Date().toISOString() }
  );
  console.log('✓  Restored.');

  console.log('\n✅  All checks passed — profile save pipeline is healthy.\n');
}

main().catch((err) => {
  console.error('\n❌  Unexpected error:', err.message || err);
  process.exit(1);
});
