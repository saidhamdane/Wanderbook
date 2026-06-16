#!/usr/bin/env node
/**
 * List magazines for a given partner slug.
 *
 * Usage:
 *   node scripts/list-partner-magazines.cjs 7777
 *   node scripts/list-partner-magazines.cjs magic-sailing
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
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
  process.exit(1);
}

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/list-partner-magazines.cjs <slug>');
  process.exit(1);
}

async function rest(path, params) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path + qs, {
    headers: { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY },
  });
  if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + await res.text());
  return res.json();
}

async function countRows(table, filter) {
  const qs = filter ? '?' + filter + '&limit=0' : '?limit=0';
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + table + qs, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: 'Bearer ' + SERVICE_KEY,
      Prefer: 'count=exact',
    },
  });
  const range = res.headers.get('content-range') || '*/0';
  return parseInt(range.split('/')[1] || '0', 10);
}

async function main() {
  console.log('\n=== list-partner-magazines: ' + slug + ' ===\n');

  // 1. Find partner
  const partners = await rest('partners', { 'slug': 'eq.' + slug, 'select': 'id,slug,email,business_name' });
  if (!partners.length) {
    console.log('❌  Partner not found in Supabase for slug: ' + slug);
  } else {
    const p = partners[0];
    console.log('Partner found:');
    console.log('  id:            ' + p.id);
    console.log('  slug:          ' + p.slug);
    console.log('  business_name: ' + p.business_name);
    console.log('  email:         ' + (p.email || '(none)'));
  }

  const partnerId = partners[0]?.id;

  // 2. Count by slug
  const slugFilter = 'partner_slug=eq.' + encodeURIComponent(slug);
  const totalBySlug = await countRows('magazines', slugFilter);

  // 3. Count by id (if available)
  let totalById = 0;
  if (partnerId) {
    const idFilter = 'partner_id=eq.' + encodeURIComponent(partnerId);
    totalById = await countRows('magazines', idFilter);
  }

  // 4. OR count (slug OR id) — using separate fetch with Prefer: count
  let totalOr = totalBySlug; // fallback
  if (partnerId) {
    const orFilter = 'or=(partner_slug.eq.' + slug + ',partner_id.eq.' + partnerId + ')';
    try {
      const res = await fetch(SUPABASE_URL + '/rest/v1/magazines?' + orFilter + '&limit=0', {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: 'Bearer ' + SERVICE_KEY,
          Prefer: 'count=exact',
        },
      });
      const range = res.headers.get('content-range') || '*/0';
      totalOr = parseInt(range.split('/')[1] || '0', 10);
    } catch (e) {
      totalOr = Math.max(totalBySlug, totalById);
    }
  }

  // 5. This-month count
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  let monthBySlug = 0, monthById = 0;
  const slugMonthFilter = 'partner_slug=eq.' + encodeURIComponent(slug) + '&created_at=gte.' + startOfMonth;
  monthBySlug = await countRows('magazines', slugMonthFilter);
  if (partnerId) {
    const idMonthFilter = 'partner_id=eq.' + encodeURIComponent(partnerId) + '&created_at=gte.' + startOfMonth;
    monthById = await countRows('magazines', idMonthFilter);
  }

  // 6. Fetch latest rows
  const latest = await rest('magazines', {
    select: 'magazine_id,partner_slug,partner_id,destination,created_at',
    'or': '(partner_slug.eq.' + slug + (partnerId ? ',partner_id.eq.' + partnerId : '') + ')',
    order: 'created_at.desc',
    limit: '5',
  });

  console.log('\nMagazine counts:');
  console.log('  by partner_slug:  total=' + totalBySlug + '  month=' + monthBySlug);
  if (partnerId) console.log('  by partner_id:    total=' + totalById + '  month=' + monthById);
  console.log('  combined (OR):    total=' + totalOr);

  if (latest.length) {
    console.log('\nLatest magazines:');
    for (const m of latest) {
      console.log('  ' + (m.magazine_id || m.id || '?') + '  slug=' + (m.partner_slug || '-') + '  id=' + (m.partner_id || '-') + '  dest=' + m.destination + '  at=' + m.created_at);
    }
  } else {
    console.log('\nNo magazines found for this partner.');
  }

  console.log('\nDashboard will show: total=' + totalOr + '  month=' + Math.max(monthBySlug, monthById) + '\n');
}

main().catch(e => { console.error('Error:', e.message || e); process.exit(1); });
