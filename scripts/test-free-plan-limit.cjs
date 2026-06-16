#!/usr/bin/env node
/**
 * Verify free plan magazine limit for a partner.
 *
 * Usage: node scripts/test-free-plan-limit.cjs <slug>
 * Example: node scripts/test-free-plan-limit.cjs hjhj
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

const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: ws },
});
const FREE_LIMIT = 3;

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: node scripts/test-free-plan-limit.cjs <partner-slug>');
    process.exit(1);
  }

  // Fetch partner
  const { data: partner, error: pErr } = await supabase
    .from('partners')
    .select('id, slug, plan, subscription_status')
    .eq('slug', slug)
    .maybeSingle();

  if (pErr || !partner) {
    console.error('Partner not found or error:', pErr?.message || 'null result');
    process.exit(1);
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const orFilter = `partner_slug.eq.${slug},partner_id.eq.${partner.id}`;

  const { count: total } = await supabase
    .from('magazines')
    .select('*', { count: 'exact', head: true })
    .or(orFilter);

  const { count: month } = await supabase
    .from('magazines')
    .select('*', { count: 'exact', head: true })
    .or(orFilter)
    .gte('created_at', startOfMonth.toISOString());

  const isUnlimited =
    partner.plan === 'unlimited_monthly' ||
    partner.subscription_status === 'active' ||
    partner.subscription_status === 'trialing';

  const canCreate = isUnlimited || (month ?? 0) < FREE_LIMIT;

  console.log('─────────────────────────────────────');
  console.log('Partner slug        :', partner.slug);
  console.log('Plan                :', partner.plan);
  console.log('Subscription status :', partner.subscription_status);
  console.log('Total magazines     :', total ?? 0);
  console.log('This month          :', month ?? 0);
  console.log('Free limit          :', FREE_LIMIT);
  console.log('canCreate           :', canCreate);
  console.log('─────────────────────────────────────');

  if (!isUnlimited && (month ?? 0) >= FREE_LIMIT) {
    console.log('EXPECTED: canCreate = false (Free plan, at or over limit)');
    process.exit(0);
  }
  if (isUnlimited) {
    console.log('EXPECTED: canCreate = true (Unlimited plan)');
    process.exit(0);
  }
  console.log(`EXPECTED: canCreate = true (${month ?? 0}/${FREE_LIMIT} this month, below limit)`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
