#!/usr/bin/env node
/**
 * Debug partner registration — calls the same Supabase insert used by the API.
 *
 * Usage:
 *   node scripts/debug-partner-register.cjs "Business Name" "email@example.com" "Password123!"
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

function loadEnv() {
  const envFile = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envFile)) return;
  for (const line of fs.readFileSync(envFile, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key   = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { ok: res.ok, status: res.status, body };
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function hashPassword(password) {
  // Simple SHA-256 for debug purposes (production uses bcrypt via the API)
  return 'debug-sha256:' + crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  const [,, businessName, email, password] = process.argv;
  if (!businessName || !email || !password) {
    console.error('Usage: node scripts/debug-partner-register.cjs "Business Name" "email@example.com" "Password123!"');
    process.exit(1);
  }

  if (!supabaseUrl || !serviceKey || isPlaceholder(supabaseUrl) || isPlaceholder(serviceKey)) {
    console.error('Supabase is not configured. Check .env.local for NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const slug = slugify(businessName) || 'partner';
  const id   = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const now  = new Date().toISOString();

  console.log('\n--- Debug Partner Register ---');
  console.log('businessName:', businessName);
  console.log('email:       ', normalizedEmail);
  console.log('slug:        ', slug);
  console.log('id:          ', id);
  console.log('\nInserting into Supabase partners table...');

  const payload = {
    id,
    slug,
    business_name: businessName,
    email: normalizedEmail,
    password_hash: passwordHash,
    plan: 'free',
    subscription_status: 'none',
    created_at: now,
    updated_at: now,
  };

  const { ok, status, body } = await supabaseFetch('/partners', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!ok) {
    console.error('\nINSERT FAILED');
    console.error('Status:', status);
    console.error('Error:', JSON.stringify(body, null, 2));
    process.exit(1);
  }

  const row = Array.isArray(body) ? body[0] : body;
  console.log('\nINSERT OK');
  console.log('slug:          ', row.slug);
  console.log('business_name: ', row.business_name);
  console.log('email:         ', row.email || '(NULL — BUG)');
  console.log('password_hash: ', row.password_hash ? 'yes' : 'no');

  if (!row.email) {
    console.error('\nBUG: email is NULL in the inserted row!');
    process.exit(1);
  }

  // Read back from Supabase to verify
  console.log('\nVerifying by reading back from Supabase...');
  const { ok: ok2, body: body2 } = await supabaseFetch(`/partners?slug=eq.${encodeURIComponent(slug)}&select=slug,email,password_hash`);
  if (!ok2 || !body2 || !body2[0]) {
    console.error('Could not read back the inserted row.');
    process.exit(1);
  }
  const verified = body2[0];
  console.log('Read-back email:         ', verified.email || '(NULL — BUG)');
  console.log('Read-back password_hash: ', verified.password_hash ? 'yes' : 'no');

  if (!verified.email) {
    console.error('\nBUG: email is NULL after read-back!');
    process.exit(1);
  }

  console.log('\nSUCCESS: Partner registered with email and password_hash.');

  // Clean up test row
  await supabaseFetch(`/partners?slug=eq.${encodeURIComponent(slug)}`, { method: 'DELETE' });
  console.log('(Test row deleted from Supabase)\n');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
