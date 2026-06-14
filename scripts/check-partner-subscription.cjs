#!/usr/bin/env node
/**
 * Check Supabase subscription state for a partner by slug.
 *
 * Usage: node scripts/check-partner-subscription.cjs <slug>
 * Example: node scripts/check-partner-subscription.cjs turfuere
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
  console.error('Usage: node scripts/check-partner-subscription.cjs <slug>');
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

async function main() {
  console.log(`\nChecking partner subscription: ${slug}\n`);

  const res = await fetch(
    `${url}/rest/v1/partners?slug=eq.${encodeURIComponent(slug)}&select=slug,business_name,plan,subscription_status,stripe_customer_id,stripe_subscription_id`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`Supabase error ${res.status}: ${text}`);
    process.exit(1);
  }

  const rows = await res.json();
  if (!rows || rows.length === 0) {
    console.log(`No partner found with slug "${slug}" in Supabase.`);
    process.exit(0);
  }

  const p = rows[0];
  console.log(`slug:                   ${p.slug}`);
  console.log(`business_name:          ${p.business_name}`);
  console.log(`plan:                   ${p.plan}`);
  console.log(`subscription_status:    ${p.subscription_status}`);
  console.log(`stripe_customer_id:     ${p.stripe_customer_id || '(none)'}`);
  console.log(`stripe_subscription_id: ${p.stripe_subscription_id || '(none)'}`);

  const active = p.subscription_status === 'active' || p.subscription_status === 'trialing';
  console.log(`\nStatus: ${active ? '✅ Unlimited plan ACTIVE' : '❌ Not active'}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
