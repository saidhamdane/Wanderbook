#!/usr/bin/env node
/**
 * Set or update a partner's bcrypt password in the Supabase partners table.
 *
 * Usage:
 *   node scripts/set-partner-password.cjs <slug-or-email> "<password>"
 *
 * Examples:
 *   node scripts/set-partner-password.cjs turfuere "MyStrongPassword123!"
 *   node scripts/set-partner-password.cjs info@turfuere.com "MyStrongPassword123!"
 */

'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// ---------- load .env.local ----------
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

const identifier = process.argv[2];
const password = process.argv[3];

if (!identifier || !password) {
  console.error('Usage: node scripts/set-partner-password.cjs <slug-or-email> "<password>"');
  process.exit(1);
}

if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// ---------- local JSON fallback ----------
function findInLocalJson(identifier) {
  const jsonFile = path.join(__dirname, '..', 'data', 'partners.json');
  if (!fs.existsSync(jsonFile)) return null;
  const partners = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  const isEmail = identifier.includes('@');
  return partners.find((p) =>
    isEmail
      ? (p.email || '').toLowerCase() === identifier.toLowerCase()
      : p.slug === identifier
  ) || null;
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
  const body = res.ok ? await res.json() : null;
  return { ok: res.ok, status: res.status, body };
}

async function main() {
  console.log(`\nSetting password for partner: ${identifier}\n`);

  const isEmail = identifier.includes('@');
  const filterKey = isEmail ? `email=ilike.${identifier}` : `slug=eq.${identifier}`;

  // Look up in Supabase
  let { ok, body } = await supabaseFetch(`/partners?${filterKey}&select=id,slug,email,business_name`);
  let partner = ok && body && body.length > 0 ? body[0] : null;

  // Fall back to local JSON to get email + slug
  if (!partner) {
    console.log('Partner not found in Supabase — checking local JSON...');
    const local = findInLocalJson(identifier);
    if (!local) {
      console.error(`No partner found for "${identifier}" in Supabase or local JSON.`);
      process.exit(1);
    }
    partner = { id: local.id, slug: local.slug, email: local.email, business_name: local.businessName };
    console.log(`Found in local JSON: ${partner.business_name} (${partner.slug})`);
  } else {
    console.log(`Found in Supabase: ${partner.business_name} (${partner.slug})`);
  }

  if (!partner.email && !isEmail) {
    console.error(`Partner "${partner.slug}" has no email address. Provide the email as identifier instead.`);
    process.exit(1);
  }

  const emailToUse = partner.email || (isEmail ? identifier : null);
  if (!emailToUse) {
    console.error('Could not determine partner email.');
    process.exit(1);
  }

  console.log('Hashing password with bcrypt (rounds=12)…');
  const hash = await bcrypt.hash(password, 12);

  // Upsert into Supabase — update by slug
  const updateRes = await supabaseFetch(
    `/partners?slug=eq.${encodeURIComponent(partner.slug)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        email: emailToUse.toLowerCase(),
        password_hash: hash,
        updated_at: new Date().toISOString(),
      }),
    },
  );

  // Always update local JSON as well (bcrypt hash works with the updated verifyPassword in partner-store.ts)
  const jsonFile = path.join(__dirname, '..', 'data', 'partners.json');
  let localUpdated = false;
  if (fs.existsSync(jsonFile)) {
    try {
      const partners = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
      const idx = partners.findIndex((p) => p.slug === partner.slug);
      if (idx >= 0) {
        partners[idx].email = emailToUse.toLowerCase();
        partners[idx].passwordHash = hash;
        partners[idx].updatedAt = new Date().toISOString();
        fs.writeFileSync(jsonFile, JSON.stringify(partners, null, 2), 'utf-8');
        localUpdated = true;
        console.log('✅ Local JSON updated (data/partners.json)');
      }
    } catch (err) {
      console.warn('⚠  Could not update local JSON:', err.message);
    }
  }

  if (!updateRes.ok) {
    if (!localUpdated) {
      console.error(`Failed to update Supabase (HTTP ${updateRes.status}) and local JSON not found.`);
      process.exit(1);
    }
    console.warn(`⚠  Supabase not updated (HTTP ${updateRes.status}) — migration may not have run yet.`);
    console.warn('   Run supabase/migrations/20260614_partner_auth.sql in the Supabase SQL editor.');
    console.warn('   Then re-run this script to sync the password to Supabase.\n');
  } else {
    console.log('✅ Supabase updated');
  }

  console.log(`\n✅ Partner password updated for ${partner.slug}`);
  console.log(`   email:    ${emailToUse.toLowerCase()}`);
  console.log(`   slug:     ${partner.slug}`);
  console.log('\nYou can now log in at /partner/login with those credentials.\n');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
