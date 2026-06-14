#!/usr/bin/env node
/**
 * Verifies Supabase connectivity and required tables via REST API.
 * Uses native fetch (Node.js 18+) to avoid WebSocket/Realtime issues.
 *
 * Usage: npm run check:supabase
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

function isPlaceholder(value) {
  const v = (value || '').trim().toLowerCase();
  return !v || v === 'placeholder' || v.startsWith('your_') || v.includes('your-project') || v.includes('placeholder.supabase');
}

function check(label, condition) {
  if (condition) {
    console.log(`✅ ${label}`);
    return true;
  } else {
    console.log(`❌ ${label}`);
    return false;
  }
}

async function queryTable(url, serviceKey, table) {
  const res = await fetch(`${url}/rest/v1/${table}?limit=0`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'count=exact',
    },
  });
  return { ok: res.ok, status: res.status, count: res.headers.get('content-range') };
}

async function main() {
  console.log('\n🔍 Wanderbook — Supabase connectivity check\n');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const urlOk = check('NEXT_PUBLIC_SUPABASE_URL set', url && !isPlaceholder(url));
  const anonOk = check('NEXT_PUBLIC_SUPABASE_ANON_KEY set', anonKey && !isPlaceholder(anonKey));
  const serviceOk = check('SUPABASE_SERVICE_ROLE_KEY set', serviceKey && !isPlaceholder(serviceKey));

  if (!urlOk || !serviceOk) {
    console.log('\n⚠  Add the missing env vars to .env.local and restart.\n');
    process.exit(1);
  }

  // Test connectivity with a simple REST call
  let connected = false;
  try {
    const res = await fetch(`${url}/rest/v1/partners?limit=1`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });
    connected = res.ok || res.status === 404; // 404 means table not found but connection works
    check('Connected to Supabase', connected);
    if (!connected) {
      const text = await res.text();
      console.log(`\n   Error: HTTP ${res.status} — ${text}`);
      console.log('   Check that the URL and service role key are correct.\n');
      process.exit(1);
    }
  } catch (err) {
    check('Connected to Supabase', false);
    console.log(`\n   Error: ${err.message}`);
    console.log('   Check that the URL and service role key are correct.\n');
    process.exit(1);
  }

  // Check each table
  for (const table of ['partners', 'magazines', 'leads', 'partner_events', 'subscriptions']) {
    try {
      const { ok, status } = await queryTable(url, serviceKey, table);
      const exists = ok || status === 406; // 406 = table exists but RLS blocks
      check(`Table: ${table} exists`, exists);
      if (!exists && status === 404) {
        console.log(`   → Run supabase/schema.sql in the Supabase SQL editor`);
      }
    } catch (err) {
      check(`Table: ${table} exists`, false);
    }
  }

  // Row counts
  console.log('');
  for (const table of ['partners', 'leads', 'magazines']) {
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: 'count=exact',
          'Range-Unit': 'items',
          Range: '0-0',
        },
      });
      const range = res.headers.get('content-range') || '*/0';
      const total = range.split('/')[1] || '0';
      console.log(`   ${table}: ${total} rows`);
    } catch {
      console.log(`   ${table}: (could not count)`);
    }
  }

  console.log('\n✅ Check complete\n');
  if (!anonOk) {
    console.log('⚠  NEXT_PUBLIC_SUPABASE_ANON_KEY is missing — browser-side features may not work.\n');
  }
}

main().catch((err) => {
  console.error('Check failed:', err.message);
  process.exit(1);
});
