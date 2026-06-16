#!/usr/bin/env node
/**
 * Verify that the Stripe checkout session can be created for a partner.
 * Usage:
 *   node scripts/test-upgrade-checkout-session.cjs [slug]
 *   node scripts/test-upgrade-checkout-session.cjs [slug] --live   (creates a real Stripe session)
 */

const path = require('path');
const fs = require('fs');

// Load .env.local
const envFile = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
  console.log('[env] Loaded .env.local');
} else {
  console.warn('[env] .env.local not found — using process.env');
}

const slugArg = process.argv[2] || 'hjhj';
const live = process.argv.includes('--live');

// ── Supabase client ──────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

async function fetchSupabase(path, method = 'GET', body) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    method,
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[supabase] Error:', res.status, text);
    return null;
  }
  return res.json();
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== Stripe Checkout Session Verification ===');
  console.log('Partner slug:', slugArg);
  console.log('Mode:', live ? 'LIVE (will create a real Stripe session)' : 'DRY RUN');

  // 1. Check Stripe env vars
  console.log('\n--- Stripe env vars ---');
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_UNLIMITED_MONTHLY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log('STRIPE_SECRET_KEY:', stripeKey ? `✓ ${stripeKey.slice(0, 12)}…` : '✗ missing');
  console.log('STRIPE_PRICE_UNLIMITED_MONTHLY:', priceId ? `✓ ${priceId}` : '✗ missing');
  console.log('STRIPE_WEBHOOK_SECRET:', webhookSecret ? `✓ ${webhookSecret.slice(0, 14)}…` : '✗ missing');

  const isPlaceholder = !priceId || !priceId.startsWith('price_') || /_/.test(priceId.slice(6));
  if (isPlaceholder) {
    console.error('✗ STRIPE_PRICE_UNLIMITED_MONTHLY looks like a placeholder:', priceId);
    process.exitCode = 1;
  } else {
    console.log('✓ Price ID format looks valid');
  }

  // 2. Look up partner in Supabase
  console.log('\n--- Partner lookup in Supabase ---');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('✗ Supabase env vars missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)');
    process.exitCode = 1;
  }

  let partner = null;
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const rows = await fetchSupabase(
      `/partners?slug=eq.${encodeURIComponent(slugArg)}&select=id,slug,email,business_name,plan,subscription_status,stripe_customer_id`,
    );
    partner = Array.isArray(rows) ? rows[0] : null;

    if (partner) {
      console.log('✓ Partner found in Supabase:');
      console.log('  id              :', partner.id);
      console.log('  slug            :', partner.slug);
      console.log('  email           :', partner.email);
      console.log('  businessName    :', partner.business_name);
      console.log('  plan            :', partner.plan);
      console.log('  subscriptionStatus:', partner.subscription_status);
      console.log('  stripeCustomerId:', partner.stripe_customer_id || '(none)');
    } else {
      console.error('✗ Partner not found in Supabase for slug:', slugArg);

      // Try latest partner
      console.log('\nTrying to find latest registered partner…');
      const latest = await fetchSupabase(
        '/partners?select=id,slug,email,business_name&order=created_at.desc&limit=1',
      );
      if (Array.isArray(latest) && latest[0]) {
        console.log('Latest partner:', latest[0]);
      }
      process.exitCode = 1;
    }
  }

  // 3. Metadata that would be sent
  if (partner) {
    console.log('\n--- Stripe checkout metadata that would be sent ---');
    const metadata = {
      partnerId: partner.id,
      partnerSlug: partner.slug,
      partnerEmail: partner.email || '',
    };
    console.log(JSON.stringify(metadata, null, 2));

    console.log('\n--- Stripe checkout URLs ---');
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://wanderbookcanarias.com';
    console.log('success_url:', `${appUrl}/partner/billing/success?session_id={CHECKOUT_SESSION_ID}`);
    console.log('cancel_url:', `${appUrl}/partner/upgrade?cancelled=1`);
  }

  // 4. Optionally create a real Stripe session
  if (live && partner && stripeKey && priceId && !isPlaceholder) {
    console.log('\n--- Creating real Stripe Checkout session (--live) ---');
    try {
      const Stripe = require('stripe');
      const stripe = new Stripe(stripeKey);

      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        'https://wanderbookcanarias.com';

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${appUrl}/partner/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/partner/upgrade?cancelled=1`,
        client_reference_id: partner.slug,
        customer_email: partner.email || undefined,
        metadata: {
          partnerId: partner.id,
          partnerSlug: partner.slug,
          partnerEmail: partner.email || '',
        },
        subscription_data: {
          metadata: {
            partnerId: partner.id,
            partnerSlug: partner.slug,
            partnerEmail: partner.email || '',
          },
        },
      });

      console.log('✓ Stripe Checkout session created!');
      console.log('  session.id :', session.id);
      console.log('  session.url:', session.url);
    } catch (err) {
      console.error('✗ Stripe session creation failed:', err.message);
      process.exitCode = 1;
    }
  } else if (!live) {
    console.log('\n(Pass --live to create a real Stripe session)');
  }

  console.log('\n=== Done ===\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exitCode = 1;
});
