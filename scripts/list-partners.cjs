#!/usr/bin/env node
/**
 * List all partners from Supabase (falls back to local JSON if Supabase unavailable).
 *
 * Usage:
 *   node scripts/list-partners.cjs
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isPlaceholder(v) {
  const s = (v || '').trim().toLowerCase();
  return !s || s.startsWith('your_') || s.includes('your-project') || s.includes('placeholder');
}

async function supabaseFetch(endpoint, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1${endpoint}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = res.ok ? await res.json() : null;
  return { ok: res.ok, status: res.status, body };
}

async function fromSupabase() {
  const { ok, body } = await supabaseFetch(
    '/partners?select=slug,business_name,email,plan,subscription_status,password_hash,last_login_at&order=created_at.asc'
  );
  if (!ok || !body) return null;
  return body;
}

function fromLocalJson() {
  const jsonFile = path.join(__dirname, '..', 'data', 'partners.json');
  if (!fs.existsSync(jsonFile)) return [];
  return JSON.parse(fs.readFileSync(jsonFile, 'utf-8')).map((p) => ({
    slug: p.slug,
    business_name: p.businessName,
    email: p.email || null,
    plan: p.plan || 'free',
    subscription_status: p.subscriptionStatus || 'none',
    password_hash: p.passwordHash || null,
    last_login_at: null,
  }));
}

async function main() {
  let partners;
  if (supabaseUrl && serviceKey && !isPlaceholder(supabaseUrl) && !isPlaceholder(serviceKey)) {
    console.log('Fetching from Supabase…\n');
    partners = await fromSupabase();
    if (!partners) {
      console.warn('Supabase query failed — falling back to local JSON.\n');
      partners = fromLocalJson();
    }
  } else {
    console.log('Supabase not configured — reading local JSON.\n');
    partners = fromLocalJson();
  }

  if (!partners || partners.length === 0) {
    console.log('No partners found.');
    return;
  }

  const COL = { slug: 28, name: 28, email: 32, plan: 18, status: 12, hash: 6, login: 22 };
  const row = (r) => [
    (r.slug || '').padEnd(COL.slug),
    (r.business_name || '').padEnd(COL.name),
    (r.email || '—').padEnd(COL.email),
    (r.plan || '').padEnd(COL.plan),
    (r.subscription_status || '').padEnd(COL.status),
    (r.password_hash ? 'yes' : 'no').padEnd(COL.hash),
    (r.last_login_at || '—').padEnd(COL.login),
  ].join('  ');

  const header = [
    'SLUG'.padEnd(COL.slug),
    'BUSINESS NAME'.padEnd(COL.name),
    'EMAIL'.padEnd(COL.email),
    'PLAN'.padEnd(COL.plan),
    'STATUS'.padEnd(COL.status),
    'HASH'.padEnd(COL.hash),
    'LAST LOGIN'.padEnd(COL.login),
  ].join('  ');

  console.log(header);
  console.log('─'.repeat(header.length));
  partners.forEach((p) => console.log(row(p)));
  console.log(`\nTotal: ${partners.length} partner(s)`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
