#!/usr/bin/env node
/**
 * Test partner analytics event tracking.
 * Uses native fetch to avoid WebSocket issues with @supabase/supabase-js on Node 20.
 *
 * Usage: node scripts/test-partner-analytics.cjs <slug>
 * Example: node scripts/test-partner-analytics.cjs 00000
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
  console.error('Usage: node scripts/test-partner-analytics.cjs <slug>');
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

async function countEvents(partnerSlug) {
  const res = await sbFetch(`/rest/v1/partner_events?partner_slug=eq.${encodeURIComponent(partnerSlug)}&select=event_type`);
  if (!res.ok) return null;
  const rows = res.data || [];
  const counts = {};
  for (const row of rows) {
    counts[row.event_type] = (counts[row.event_type] || 0) + 1;
  }
  return counts;
}

async function insertEvent(partnerSlug, magazineId, eventType) {
  // Try with full schema first (migration applied)
  const fullRow = {
    partner_slug: partnerSlug,
    magazine_id: magazineId,
    event_type: eventType,
    metadata: { test: true },
    created_at: new Date().toISOString(),
  };
  const res = await sbFetch('/rest/v1/partner_events', {
    method: 'POST',
    body: JSON.stringify(fullRow),
    headers: { 'Prefer': 'return=minimal' },
  });

  if (!res.ok && res.status === 400) {
    // Fallback: minimal schema (pre-migration)
    const minRow = {
      partner_slug: partnerSlug,
      event_type: eventType,
      metadata: { test: true },
      created_at: new Date().toISOString(),
    };
    const res2 = await sbFetch('/rest/v1/partner_events', {
      method: 'POST',
      body: JSON.stringify(minRow),
      headers: { 'Prefer': 'return=minimal' },
    });
    if (!res2.ok) throw new Error(`Insert ${eventType} (fallback): ${JSON.stringify(res2.data)}`);
    return 'fallback';
  }
  if (!res.ok) throw new Error(`Insert ${eventType}: ${JSON.stringify(res.data)}`);
  return 'full';
}

async function main() {
  console.log(`\n=== Partner Analytics Test: ${slug} ===\n`);

  // Get partner
  const partnerRes = await sbFetch(`/rest/v1/partners?slug=eq.${encodeURIComponent(slug)}&select=id,slug,business_name`);
  if (!partnerRes.ok || !partnerRes.data?.length) {
    console.error('Partner not found:', slug);
    process.exit(1);
  }
  const partner = partnerRes.data[0];
  console.log('Partner:', partner.business_name, '/', partner.id);

  // Get latest magazine
  const magRes = await sbFetch(`/rest/v1/magazines?partner_slug=eq.${encodeURIComponent(slug)}&select=magazine_id&order=created_at.desc&limit=1`);
  const magazineId = magRes.data?.[0]?.magazine_id || 'test-mag-id';
  console.log('Magazine ID for test:', magazineId);

  // Count before
  const before = await countEvents(slug);
  if (before === null) {
    console.log('\nERROR: partner_events table not accessible. Check Supabase configuration.');
    process.exit(1);
  }
  const keys = ['magazine_viewed', 'magazine_shared_whatsapp', 'google_review_clicked', 'booking_clicked'];
  console.log('\nEvent counts BEFORE:');
  for (const k of keys) console.log(`  ${k}: ${before[k] || 0}`);

  // Insert sample events
  console.log('\nInserting sample events...');
  let usingFallback = false;
  for (const eventType of keys) {
    const mode = await insertEvent(slug, magazineId, eventType);
    console.log(`  OK (${mode}): ${eventType}`);
    if (mode === 'fallback') usingFallback = true;
  }

  if (usingFallback) {
    console.log('\nNOTE: Running in fallback mode — migration not yet applied.');
    console.log('Events are tracked by partner_slug only (no magazine_id).');
  }

  // Count after
  const after = await countEvents(slug);
  console.log('\nEvent counts AFTER:');
  let allIncreased = true;
  for (const k of keys) {
    const diff = (after[k] || 0) - (before[k] || 0);
    const increased = diff >= 1;
    console.log(`  ${k}: ${after[k] || 0} (+${diff}) ${increased ? 'OK' : 'FAIL'}`);
    if (!increased) allIncreased = false;
  }

  // Test the live events API endpoint
  console.log('\nTesting live /api/partner/events endpoint...');
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://wanderbookcanarias.com';
    const evtRes = await fetch(appUrl + '/api/partner/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'magazine_viewed',
        partnerSlug: slug,
        magazineId,
        metadata: { source: 'test-script' },
      }),
    });
    const evtData = await evtRes.json();
    console.log('  Status:', evtRes.status, evtData.ok ? 'OK' : JSON.stringify(evtData));
  } catch (err) {
    console.log('  API test failed:', err.message);
  }

  console.log('\n=== Result:', allIncreased ? 'PASS' : 'FAIL', '===\n');
  if (!allIncreased) process.exit(1);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
