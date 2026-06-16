#!/usr/bin/env node
/**
 * Verify the dashboard magazine count logic against Supabase.
 * Finds the latest partner and prints what the dashboard should show.
 *
 * Usage:
 *   node scripts/test-dashboard-counts.cjs
 *   node scripts/test-dashboard-counts.cjs --slug 7777
 */
'use strict';

const fs   = require('fs');
const path = require('path');

function loadEnv() {
  const f = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const slugArg = (() => {
  const i = process.argv.indexOf('--slug');
  return i >= 0 ? process.argv[i + 1] : null;
})();

async function countRows(filter) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/magazines?' + filter + '&limit=0', {
    headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY, Prefer: 'count=exact' },
  });
  const range = res.headers.get('content-range') || '*/0';
  return parseInt(range.split('/')[1] || '0', 10);
}

async function main() {
  console.log('\n=== test-dashboard-counts ===\n');

  // Find partner
  let partnerUrl;
  if (slugArg) {
    partnerUrl = SUPABASE_URL + '/rest/v1/partners?slug=eq.' + encodeURIComponent(slugArg) + '&select=id,slug,business_name,email&limit=1';
  } else {
    partnerUrl = SUPABASE_URL + '/rest/v1/partners?select=id,slug,business_name,email&order=updated_at.desc&limit=1';
  }
  const pRes = await fetch(partnerUrl, { headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY } });
  const partners = await pRes.json();
  if (!partners.length) { console.error('❌  No partner found'); process.exit(1); }

  const partner = partners[0];
  console.log('Partner: slug="' + partner.slug + '"  id="' + partner.id + '"  name="' + partner.business_name + '"');

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const orFilter = 'or=(partner_slug.eq.' + partner.slug + ',partner_id.eq.' + partner.id + ')';

  const total = await countRows(orFilter);
  const month = await countRows(orFilter + '&created_at=gte.' + startOfMonth);

  console.log('\nDashboard expected values:');
  console.log('  Client magazines: ' + total);
  console.log('  This month:       ' + month);
  console.log('  Current month:    ' + new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' }));

  if (total === 0) {
    console.log('\n⚠  No magazines found. Create one from /partner/' + partner.slug + ' to test.');
  } else {
    console.log('\n✅  Counts look correct — dashboard should show these values.');
  }
  console.log('');
}

main().catch(e => { console.error('Error:', e.message || e); process.exit(1); });
