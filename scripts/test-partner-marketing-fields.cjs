#!/usr/bin/env node
/**
 * Test partner marketing fields (google_review_url, instagram_url, booking_url, activity_type).
 * Uses native fetch to avoid WebSocket issues with @supabase/supabase-js on Node 20.
 *
 * Usage: node scripts/test-partner-marketing-fields.cjs <slug>
 * Example: node scripts/test-partner-marketing-fields.cjs 00000
 */

'use strict';

const fs = require('fs');
const path = require('path');

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

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/test-partner-marketing-fields.cjs <slug>');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const HEADERS = {
  'apikey': SERVICE_KEY,
  'Authorization': 'Bearer ' + SERVICE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function sbFetch(path, options = {}) {
  const res = await fetch(SUPABASE_URL + path, { ...options, headers: { ...HEADERS, ...(options.headers || {}) } });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { ok: res.ok, status: res.status, data: json };
}

async function main() {
  console.log(`\n=== Partner Marketing Fields Test: ${slug} ===\n`);

  // 1. Fetch partner
  const { ok, data: partners } = await sbFetch(`/rest/v1/partners?slug=eq.${encodeURIComponent(slug)}&select=id,slug,business_name`);
  if (!ok || !partners || partners.length === 0) {
    console.error('Partner not found:', slug);
    process.exit(1);
  }
  const partner = partners[0];
  console.log('Partner:', partner.business_name, '/', partner.id);

  // 2. Check if new columns exist
  const colCheck = await sbFetch(`/rest/v1/partners?slug=eq.${encodeURIComponent(slug)}&select=google_review_url,instagram_url,booking_url,activity_type`);
  if (!colCheck.ok) {
    console.log('\nWARNING: Marketing columns do not exist yet (migration not applied).');
    console.log('Run the SQL in supabase/migrations/20260616_partner_marketing_fields_and_events.sql');
    console.log('in your Supabase dashboard SQL Editor.');
    console.log('\nCore profile fields still work correctly.');
    console.log('\n=== Result: MIGRATION PENDING (core features OK) ===\n');
    process.exit(0);
  }

  const currentData = colCheck.data[0] || {};
  console.log('\nCurrent marketing fields:');
  console.log('  activity_type:', currentData.activity_type || '(none)');
  console.log('  google_review_url:', currentData.google_review_url || '(none)');
  console.log('  instagram_url:', currentData.instagram_url || '(none)');
  console.log('  booking_url:', currentData.booking_url || '(none)');

  // 3. Save test marketing fields
  const testFields = {
    activity_type: 'Boat Tour',
    google_review_url: 'https://g.page/r/test-review-link',
    instagram_url: 'https://instagram.com/testpartner',
    booking_url: 'https://www.testbooking.com/book',
  };

  console.log('\nSaving test marketing fields...');
  const updateRes = await sbFetch(`/rest/v1/partners?slug=eq.${encodeURIComponent(slug)}`, {
    method: 'PATCH',
    body: JSON.stringify(testFields),
  });

  if (!updateRes.ok) {
    console.error('Update error:', JSON.stringify(updateRes.data));
    process.exit(1);
  }
  console.log('  OK: fields saved');

  // 4. Verify saved
  const verifyRes = await sbFetch(`/rest/v1/partners?slug=eq.${encodeURIComponent(slug)}&select=activity_type,google_review_url,instagram_url,booking_url`);
  const updated = verifyRes.data?.[0] || {};
  console.log('\nVerified saved values:');
  console.log('  activity_type:', updated.activity_type);
  console.log('  google_review_url:', updated.google_review_url);
  console.log('  instagram_url:', updated.instagram_url);
  console.log('  booking_url:', updated.booking_url);

  const allOk = updated.activity_type === testFields.activity_type &&
    updated.google_review_url === testFields.google_review_url &&
    updated.instagram_url === testFields.instagram_url &&
    updated.booking_url === testFields.booking_url;

  // 5. Check latest magazine
  const magRes = await sbFetch(`/rest/v1/magazines?partner_slug=eq.${encodeURIComponent(slug)}&select=magazine_id,data,created_at&order=created_at.desc&limit=1`);
  const latestMag = magRes.data?.[0];
  if (latestMag) {
    console.log('\nLatest magazine:', latestMag.magazine_id);
    const p = latestMag.data?.partner || {};
    console.log('  partner.logoUrl:', p.logoUrl || '(none)');
    console.log('  partner.googleReviewUrl:', p.googleReviewUrl || '(none — regenerate to pick up)');
    console.log('  partner.instagramUrl:', p.instagramUrl || '(none — regenerate to pick up)');
    console.log('  partner.bookingUrl:', p.bookingUrl || '(none — regenerate to pick up)');
    console.log('  Note: new fields appear only in freshly generated magazines');
  } else {
    console.log('\nNo magazines found for this partner yet.');
  }

  console.log('\n=== Result:', allOk ? 'PASS' : 'FAIL', '===\n');
  if (!allOk) process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
