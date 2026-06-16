#!/usr/bin/env node
/**
 * Simulate a generation request for an over-limit Free partner and confirm
 * the API returns FREE_LIMIT_REACHED without creating a new magazine.
 *
 * Usage: node scripts/test-generate-limit.cjs <partner-slug> [base-url]
 * Example: node scripts/test-generate-limit.cjs hjhj http://localhost:3000
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
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

async function main() {
  const slug = process.argv[2];
  const baseUrl = process.argv[3] || 'http://localhost:3000';

  if (!slug) {
    console.error('Usage: node scripts/test-generate-limit.cjs <partner-slug> [base-url]');
    process.exit(1);
  }

  const { createClient } = require('@supabase/supabase-js');
  const ws = require('ws');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { realtime: { transport: ws } }
  );

  // Check magazine count before
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: partner } = await supabase
    .from('partners')
    .select('id, slug, plan, subscription_status')
    .eq('slug', slug)
    .maybeSingle();

  if (!partner) {
    console.error('Partner not found:', slug);
    process.exit(1);
  }

  const orFilter = `partner_slug.eq.${slug},partner_id.eq.${partner.id}`;
  const { count: monthBefore } = await supabase
    .from('magazines')
    .select('*', { count: 'exact', head: true })
    .or(orFilter)
    .gte('created_at', startOfMonth.toISOString());

  console.log(`Partner: ${slug} | Plan: ${partner.plan} | Status: ${partner.subscription_status}`);
  console.log(`Magazines this month (before): ${monthBefore ?? 0}`);
  console.log(`Sending POST ${baseUrl}/api/generate ...`);

  const body = JSON.stringify({
    templateId: 'wanderbook-classic',
    destination: 'Test Destination',
    travelers: 'Test Travelers',
    style: 'Warm & Personal',
    language: 'en',
    partnerSlug: slug,
    useStockFallback: true,
  });

  let res;
  try {
    res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  } catch (err) {
    console.error('Network error — is the server running?', err.message);
    process.exit(1);
  }

  const data = await res.json().catch(() => null);

  console.log(`\nHTTP status: ${res.status}`);
  console.log('Response:', JSON.stringify(data, null, 2));

  const { count: monthAfter } = await supabase
    .from('magazines')
    .select('*', { count: 'exact', head: true })
    .or(orFilter)
    .gte('created_at', startOfMonth.toISOString());

  console.log(`\nMagazines this month (after): ${monthAfter ?? 0}`);

  if (data?.code === 'FREE_LIMIT_REACHED') {
    console.log('\n✓ PASS: API correctly returned FREE_LIMIT_REACHED');
    if ((monthAfter ?? 0) === (monthBefore ?? 0)) {
      console.log('✓ PASS: No new magazine was created in Supabase');
    } else {
      console.log('✗ FAIL: Magazine count changed despite limit being enforced');
      process.exit(1);
    }
  } else if (res.status === 200 || res.status === 201) {
    console.log('\n✗ FAIL: API allowed creation — limit was NOT enforced');
    process.exit(1);
  } else {
    console.log('\n? UNEXPECTED: Got non-limit error — check server logs');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
