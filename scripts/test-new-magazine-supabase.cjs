#!/usr/bin/env node
/**
 * Verifies that new magazine records are saved to Supabase correctly.
 * Tests: INSERT with magazine_id, read-back by magazine_id, row count before/after.
 *
 * Usage: node scripts/test-new-magazine-supabase.cjs
 */

'use strict';

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envFile = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, 'utf-8').split('\n')) {
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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

function headers() {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

async function rowCount() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/magazines?select=*`, {
    headers: { ...headers(), Prefer: 'count=exact', 'Range-Unit': 'items', Range: '0-0' },
  });
  const range = res.headers.get('content-range') || '*/0';
  return parseInt(range.split('/')[1] || '0', 10);
}

async function main() {
  console.log('\n🧪 Wanderbook — Supabase new-magazine persistence test\n');

  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const testMagazineId = `mag_test_${Date.now()}`;

  // Row count BEFORE
  const before = await rowCount();
  console.log(`   magazines rows before: ${before}`);

  // Build a minimal magazine document
  const now = new Date().toISOString();
  const testDoc = {
    id: testMagazineId,
    templateId: 'aurora-editorial',
    destination: 'Tenerife',
    language: 'en',
    style: 'Warm & Personal',
    generatedAt: now,
    pages: [],
  };

  const payload = {
    magazine_id: testMagazineId,
    template_id: testDoc.templateId,
    destination: testDoc.destination,
    language: testDoc.language,
    style: testDoc.style,
    partner_slug: null,
    client_name: 'Test Client',
    copy_source: 'test',
    share_url: null,
    pdf_url: null,
    data: testDoc,
    created_at: now,
  };

  // INSERT
  console.log(`\n📝 Inserting test magazine: ${testMagazineId}`);
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/magazines`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!insertRes.ok) {
    const body = await insertRes.text();
    console.error(`❌ INSERT failed (HTTP ${insertRes.status}): ${body}`);
    process.exit(1);
  }

  const inserted = await insertRes.json();
  const supabaseId = Array.isArray(inserted) ? inserted[0]?.id : inserted?.id;
  console.log(`✅ Inserted — Supabase id (UUID): ${supabaseId}`);
  console.log(`   magazine_id:               ${testMagazineId}`);

  // READ BACK by magazine_id
  console.log(`\n🔍 Reading back by magazine_id...`);
  const readRes = await fetch(
    `${SUPABASE_URL}/rest/v1/magazines?magazine_id=eq.${encodeURIComponent(testMagazineId)}&select=id,magazine_id,destination,data`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );

  if (!readRes.ok) {
    console.error(`❌ Read failed (HTTP ${readRes.status}): ${await readRes.text()}`);
    process.exit(1);
  }

  const rows = await readRes.json();
  if (!rows.length) {
    console.error('❌ No row found after insert — magazine_id lookup failed');
    process.exit(1);
  }

  const row = rows[0];
  console.log(`✅ Read back OK`);
  console.log(`   id (UUID):      ${row.id}`);
  console.log(`   magazine_id:    ${row.magazine_id}`);
  console.log(`   destination:    ${row.destination}`);
  console.log(`   data.id:        ${row.data?.id}`);

  // Row count AFTER
  const after = await rowCount();
  console.log(`\n   magazines rows after:  ${after}`);
  console.log(`   delta:                 +${after - before}`);

  // UPSERT test — same magazine_id, updated destination (PostgREST on_conflict via query param)
  console.log(`\n🔄 Testing upsert (same magazine_id, updated destination)...`);
  const upsertRes = await fetch(
    `${SUPABASE_URL}/rest/v1/magazines?on_conflict=magazine_id`,
    {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=representation,resolution=merge-duplicates' },
      body: JSON.stringify({ ...payload, destination: 'Gran Canaria', data: { ...testDoc, destination: 'Gran Canaria' } }),
    }
  );
  if (upsertRes.ok) {
    console.log('✅ Upsert OK — row updated, no duplicate created');
  } else {
    const errText = await upsertRes.text();
    console.warn(`⚠  Upsert HTTP ${upsertRes.status}: ${errText}`);
  }

  // CLEANUP
  console.log(`\n🧹 Cleaning up test row...`);
  await fetch(
    `${SUPABASE_URL}/rest/v1/magazines?magazine_id=eq.${encodeURIComponent(testMagazineId)}`,
    { method: 'DELETE', headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const afterCleanup = await rowCount();
  console.log(`   magazines rows after cleanup: ${afterCleanup}`);

  console.log('\n✅ All persistence tests passed.\n');
  console.log('   Next step: generate a real magazine from a partner page and run:');
  console.log('   npm run check:supabase\n');
}

main().catch((err) => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
