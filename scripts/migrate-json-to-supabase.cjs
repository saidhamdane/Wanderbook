#!/usr/bin/env node

// Node 20 fix: provide WebSocket for Supabase scripts.
try {
  global.WebSocket = global.WebSocket || require('ws');
} catch (_) {}

/**
 * Migrates data/partners.json and data/leads.json into Supabase.
 * Safe to run multiple times — uses upsert.
 *
 * Usage: npm run migrate:supabase
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Load env from .env.local
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

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key || isPlaceholder(url) || isPlaceholder(key)) {
  console.error('❌ Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(0);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key, { auth: { persistSession: false } });

const ROOT = path.join(__dirname, '..');

async function migratePartners() {
  const file = path.join(ROOT, 'data', 'partners.json');
  if (!fs.existsSync(file)) {
    console.log('⚠  data/partners.json not found — skipping partners migration');
    return 0;
  }
  const partners = JSON.parse(fs.readFileSync(file, 'utf-8'));
  let count = 0;
  for (const p of partners) {
    const row = {
      id: p.id,
      slug: p.slug,
      business_name: p.businessName || p.business_name,
      business_type: p.businessType || p.business_type || null,
      main_island: p.mainIsland || p.main_island || null,
      whatsapp: p.whatsapp || null,
      website: p.website || null,
      logo_url: p.logoUrl || p.logo_url || null,
      branding_note: p.brandingNote || p.branding_note || null,
      preferred_template_id: p.preferredTemplateId || p.preferred_template_id || null,
      plan: p.plan || 'free',
      subscription_status: p.subscriptionStatus || p.subscription_status || 'none',
      stripe_customer_id: p.stripeCustomerId || p.stripe_customer_id || null,
      stripe_subscription_id: p.stripeSubscriptionId || p.stripe_subscription_id || null,
      created_at: p.createdAt || p.created_at || new Date().toISOString(),
      updated_at: p.updatedAt || p.updated_at || new Date().toISOString(),
    };
    const { error } = await supabase.from('partners').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`  ❌ Partner ${p.slug}: ${error.message}`);
    } else {
      count++;
    }
  }
  return count;
}

async function migrateLeads() {
  const file = path.join(ROOT, 'data', 'leads.json');
  if (!fs.existsSync(file)) {
    console.log('⚠  data/leads.json not found — skipping leads migration');
    return 0;
  }
  const leads = JSON.parse(fs.readFileSync(file, 'utf-8'));
  let count = 0;
  for (const l of leads) {
    const row = {
      tier: l.tier || null,
      business_name: l.business || l.business_name,
      location: l.location || null,
      phone: l.phone || null,
      rating: l.rating ?? null,
      reviews: l.reviews ?? null,
      business_type: l.type || l.business_type || null,
      wanderbook_angle: l.wanderbookAngle || l.wanderbook_angle || null,
      status: l.status || 'Not contacted',
      notes: l.notes || null,
    };
    const { error } = await supabase
      .from('leads')
      .upsert(row, { onConflict: 'business_name,phone' });
    if (error) {
      console.error(`  ❌ Lead ${row.business_name}: ${error.message}`);
    } else {
      count++;
    }
  }
  return count;
}

async function migrateMagazines() {
  const file = path.join(ROOT, 'data', 'magazines.json');
  if (!fs.existsSync(file)) {
    console.log('⚠  data/magazines.json not found — skipping magazines migration');
    return 0;
  }
  let magazines;
  try {
    magazines = Object.values(JSON.parse(fs.readFileSync(file, 'utf-8')));
  } catch {
    console.log('⚠  data/magazines.json could not be parsed — skipping');
    return 0;
  }
  let count = 0;
  for (const doc of magazines) {
    if (!doc || !doc.id) continue;
    const row = {
      id: doc.id,
      template_id: doc.templateId || null,
      destination: doc.destination || null,
      language: doc.language || null,
      style: doc.style || null,
      partner_slug: doc.partner?.slug || null,
      client_name: doc.clientName || null,
      copy_source: doc.copySource || null,
      data: doc,
      created_at: doc.generatedAt || new Date().toISOString(),
    };
    const { error } = await supabase.from('magazines').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error(`  ❌ Magazine ${doc.id}: ${error.message}`);
    } else {
      count++;
    }
  }
  return count;
}

async function main() {
  console.log('\n🚀 Wanderbook → Supabase migration\n');
  console.log(`   URL: ${url.replace(/supabase\.co.*/, 'supabase.co/…')}`);
  console.log('');

  const [partners, leads, magazines] = await Promise.all([
    migratePartners(),
    migrateLeads(),
    migrateMagazines(),
  ]);

  console.log('\n✅ Migration complete');
  console.log(`   Partners migrated : ${partners}`);
  console.log(`   Leads migrated    : ${leads}`);
  console.log(`   Magazines migrated: ${magazines}`);
  console.log('');
  console.log('Next steps:');
  console.log('  pm2 restart wanderbook --update-env');
  console.log('  npm run check:supabase');
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
