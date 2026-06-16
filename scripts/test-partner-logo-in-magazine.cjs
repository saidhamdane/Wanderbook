#!/usr/bin/env node
/**
 * Debug: verify partner logo appears in magazine documents.
 *
 * Usage:
 *   node scripts/test-partner-logo-in-magazine.cjs <slug>
 *   node scripts/test-partner-logo-in-magazine.cjs          # uses latest partner
 */
'use strict';

const fs   = require('fs');
const path = require('path');

function loadEnv() {
  const f = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const targetSlug = process.argv[2] || null;

async function supabaseGet(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!r.ok) throw new Error(`Supabase GET ${path} → ${r.status}`);
  return r.json();
}

async function main() {
  // 1. Fetch partner
  const partnerPath = targetSlug
    ? `partners?slug=eq.${encodeURIComponent(targetSlug)}&select=id,slug,business_name,logo_url&limit=1`
    : `partners?select=id,slug,business_name,logo_url&order=updated_at.desc&limit=1`;

  const partners = await supabaseGet(partnerPath);
  if (!partners.length) {
    console.error(`No partner found${targetSlug ? ` for slug: ${targetSlug}` : ''}`);
    process.exit(1);
  }
  const partner = partners[0];

  console.log('\n--- Partner ---');
  console.log('  slug        :', partner.slug);
  console.log('  businessName:', partner.business_name);
  console.log('  logoUrl     :', partner.logo_url || '(none)');

  // 2. Find latest magazine for this partner
  const magazines = await supabaseGet(
    `magazines?partner_slug=eq.${encodeURIComponent(partner.slug)}&select=magazine_id,data&order=created_at.desc&limit=1`
  );

  if (!magazines.length) {
    // Fallback: scan local magazines.json
    const localFile = path.join(__dirname, '..', 'data', 'magazines.json');
    if (fs.existsSync(localFile)) {
      const all = JSON.parse(fs.readFileSync(localFile, 'utf-8'));
      const match = Object.values(all).find(
        (d) => d.partner?.slug === partner.slug
      );
      if (match) {
        printMagazineResult(match, partner);
        return;
      }
    }
    console.log('\nNo magazine found for this partner.');
    return;
  }

  const doc = magazines[0].data || {};
  printMagazineResult(doc, partner);
}

function printMagazineResult(doc, partner) {
  const storedLogoUrl  = doc.partner?.logoUrl || doc.partner?.logo_url || null;
  const liveLogoUrl    = partner.logo_url;
  const finalLogoUrl   = storedLogoUrl || liveLogoUrl || '(none)';
  const needsMerge     = !storedLogoUrl && !!liveLogoUrl;

  console.log('\n--- Latest Magazine ---');
  console.log('  id              :', doc.id || '(unknown)');
  console.log('  templateId      :', doc.templateId || '(unknown)');
  console.log('  doc.partner.slug:', doc.partner?.slug || '(missing)');
  console.log('  doc.partner.logoUrl (stored):', storedLogoUrl || '(not stored)');
  console.log('  live logoUrl from Supabase  :', liveLogoUrl  || '(none)');
  console.log('  needsLiveMerge  :', needsMerge);
  console.log('  finalLogoUrl    :', finalLogoUrl);

  if (!liveLogoUrl) {
    console.log('\n⚠  Partner has no logo uploaded yet. Upload one from the dashboard.');
  } else if (!storedLogoUrl) {
    console.log('\n⚠  Stored magazine doc is missing logoUrl — live-merge will supply it at render time.');
    console.log('   (Re-generate a new magazine to persist logoUrl in doc.partner going forward.)');
  } else {
    console.log('\n✓  Logo URL is stored in magazine doc — should render correctly.');
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
  if (doc.id) {
    console.log('\n--- Test URLs ---');
    console.log('  Digital magazine :', `${appUrl}/magazine/${doc.id}`);
    console.log('  Preview page     :', `${appUrl}/preview/${doc.id}`);
    console.log('  Back cover page  :', `${appUrl}/magazine-page/${doc.id}/${doc.pages?.length || 'N'}`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
