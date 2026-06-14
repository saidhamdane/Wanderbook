#!/usr/bin/env node
/**
 * Create a partner in Supabase with email + bcrypt password_hash.
 *
 * Usage:
 *   node scripts/create-partner.cjs "Business Name" "email@example.com" "Password123!"
 *
 * Example:
 *   node scripts/create-partner.cjs "Magic Sailing Test" "test@example.com" "Password123!"
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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

const [businessName, email, password] = process.argv.slice(2);

if (!businessName || !email || !password) {
  console.error('Usage: node scripts/create-partner.cjs "Business Name" "email@example.com" "Password123!"');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}
if (!email.includes('@')) {
  console.error('Invalid email address.');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isPlaceholder(v) {
  const s = (v || '').trim().toLowerCase();
  return !s || s.startsWith('your_') || s.includes('your-project') || s.includes('placeholder');
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function supabaseFetch(endpoint, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1${endpoint}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: options.method === 'POST' ? 'return=representation' : undefined,
      ...(options.headers || {}),
    },
  });
  const body = res.ok ? await res.json().catch(() => null) : null;
  return { ok: res.ok, status: res.status, body };
}

async function uniqueSlug(base) {
  let slug = base;
  let n = 2;
  for (;;) {
    const { ok, body } = await supabaseFetch(`/partners?slug=eq.${encodeURIComponent(slug)}&select=id`);
    if (ok && (!body || body.length === 0)) return slug;
    slug = `${base}-${n}`;
    n++;
  }
}

async function main() {
  if (!supabaseUrl || !serviceKey || isPlaceholder(supabaseUrl) || isPlaceholder(serviceKey)) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  // Check email uniqueness
  const { ok: lookupOk, body: existing } = await supabaseFetch(
    `/partners?email=ilike.${encodeURIComponent(email.toLowerCase())}&select=id,slug`
  );
  if (!lookupOk) {
    console.error('Could not query Supabase. Check your credentials.');
    process.exit(1);
  }
  if (existing && existing.length > 0) {
    console.error(`A partner with email "${email}" already exists (slug: ${existing[0].slug}).`);
    process.exit(1);
  }

  const baseSlug = slugify(businessName) || 'partner';
  const slug = await uniqueSlug(baseSlug);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  console.log(`\nHashing password with bcrypt (rounds=12)…`);
  const passwordHash = await bcrypt.hash(password, 12);

  const { ok, status, body } = await supabaseFetch('/partners', {
    method: 'POST',
    body: JSON.stringify({
      id,
      slug,
      business_name: businessName,
      email: email.toLowerCase(),
      password_hash: passwordHash,
      plan: 'free',
      subscription_status: 'none',
      data: { source: 'script_create_partner', registeredAt: now },
      created_at: now,
      updated_at: now,
    }),
  });

  if (!ok) {
    console.error(`Supabase insert failed (HTTP ${status}):`, body);
    process.exit(1);
  }

  console.log('\n✅ Partner created in Supabase');
  console.log(`   slug:          ${slug}`);
  console.log(`   business_name: ${businessName}`);
  console.log(`   email:         ${email.toLowerCase()}`);
  console.log(`   plan:          free`);
  console.log(`   password_hash: set (bcrypt)`);
  console.log('\nYou can now log in at /partner/login with those credentials.\n');
  console.log('Verify with: node scripts/list-partners.cjs\n');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
