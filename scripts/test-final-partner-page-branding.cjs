#!/usr/bin/env node
/**
 * Test script: validate final partner page branding on a magazine.
 * Usage: node scripts/test-final-partner-page-branding.cjs <magazineId> [partnerSlug]
 *
 * Checks:
 *  - Partner branding fields from Supabase (logoUrl, whatsapp, googleReviewUrl, etc.)
 *  - Final page HTML: logo appears as <img>, not CSS background-image
 *  - WhatsApp contact button present if partner.whatsapp exists
 *  - Booking button present if bookingUrl/website exists
 *  - Instagram button present if instagramUrl exists
 *  - Google review button present if googleReviewUrl exists
 *  - WhatsApp share button present (always when partner magazineId known)
 *  - All buttons have data-track-click analytics attributes
 *  - Analytics endpoint /api/partner/events reachable
 */

'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const [, , magazineId, partnerSlugArg] = process.argv;

if (!magazineId) {
  console.error('Usage: node scripts/test-final-partner-page-branding.cjs <magazineId> [partnerSlug]');
  process.exit(1);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

function fetchHead(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve({ status: res.statusCode });
    });
    req.on('error', reject);
    req.end();
  });
}

let passed = 0;
let failed = 0;

function pass(label) { console.log('  ✅', label); passed++; }
function fail(label) { console.error('  ❌', label); failed++; }
function info(label) { console.log('  ℹ️ ', label); }

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== Wanderbook Final Partner Page Branding Test ===');
  console.log(`Magazine ID : ${magazineId}`);
  console.log(`Base URL    : ${BASE_URL}`);

  // 1. Load magazine data from local file
  console.log('\n── 1. Load magazine data ──');
  let partnerSlug = partnerSlugArg;
  let magazineLanguage = 'en';
  let pageCount = 8;
  let docPartner = null;

  const localDataPath = path.join(__dirname, '..', 'data', 'magazines.json');
  try {
    if (fs.existsSync(localDataPath)) {
      const allMags = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
      const doc = Array.isArray(allMags) ? allMags.find(m => m.id === magazineId) : allMags[magazineId];
      if (doc) {
        partnerSlug = partnerSlug || doc.partner?.slug;
        magazineLanguage = doc.language || 'en';
        pageCount = doc.pages?.length || 8;
        docPartner = doc.partner || null;
        pass(`Magazine loaded (template: ${doc.templateId || doc.template?.id || 'unknown'}, lang: ${magazineLanguage}, pages: ${pageCount})`);
        if (docPartner) {
          info(`Partner in doc: slug=${docPartner.slug || '(none)'}, enabled=${docPartner.enabled}, hasLogo=${Boolean(docPartner.logoUrl)}, hasWhatsapp=${Boolean(docPartner.whatsapp)}, hasGoogle=${Boolean(docPartner.googleReviewUrl)}, hasBooking=${Boolean(docPartner.bookingUrl)}, hasInstagram=${Boolean(docPartner.instagramUrl)}`);
        } else {
          info('No partner data in magazine doc.');
        }
      } else {
        info(`Magazine "${magazineId}" not found in local data — some checks will be skipped`);
      }
    } else {
      info('No local data/magazines.json — some checks will be skipped');
    }
  } catch (err) {
    info(`Could not read local data: ${err.message}`);
  }

  // 2. Fetch partner branding from Supabase (optional — enriches HTML checks)
  console.log('\n── 2. Partner branding from Supabase ──');
  let partnerBranding = null;

  if (!partnerSlug) {
    info('No partnerSlug — skipping Supabase check');
  } else if (!SUPABASE_URL || !SUPABASE_KEY) {
    info('Supabase env vars not set — skipping DB check (set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to enable)');
  } else {
    try {
      // Dynamic require so the script doesn't fail if @supabase/supabase-js is not installed
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from('partners')
        .select('business_name,logo_url,whatsapp,website,google_review_url,instagram_url,booking_url,activity_type,branding_note')
        .eq('slug', partnerSlug)
        .maybeSingle();

      if (error) {
        fail(`Supabase query error: ${error.message}`);
      } else if (!data) {
        fail(`Partner slug "${partnerSlug}" not found in Supabase`);
      } else {
        partnerBranding = data;
        pass(`Partner found in Supabase: ${data.business_name}`);
        console.log(`    logo_url         : ${data.logo_url || '(empty)'}`);
        console.log(`    whatsapp         : ${data.whatsapp || '(empty)'}`);
        console.log(`    google_review_url: ${data.google_review_url || '(empty)'}`);
        console.log(`    instagram_url    : ${data.instagram_url || '(empty)'}`);
        console.log(`    booking_url      : ${data.booking_url || '(empty)'}`);
        console.log(`    activity_type    : ${data.activity_type || '(empty)'}`);
      }
    } catch (err) {
      info(`Supabase check skipped: ${err.message}`);
    }
  }

  // Merge best-available partner data (Supabase > local doc)
  const effectivePartner = partnerBranding ? {
    logoUrl: partnerBranding.logo_url,
    whatsapp: partnerBranding.whatsapp,
    website: partnerBranding.website,
    googleReviewUrl: partnerBranding.google_review_url,
    instagramUrl: partnerBranding.instagram_url,
    bookingUrl: partnerBranding.booking_url,
  } : docPartner ? {
    logoUrl: docPartner.logoUrl,
    whatsapp: docPartner.whatsapp,
    website: docPartner.website,
    googleReviewUrl: docPartner.googleReviewUrl,
    instagramUrl: docPartner.instagramUrl,
    bookingUrl: docPartner.bookingUrl,
  } : null;

  const isSpanish = magazineLanguage === 'es';

  // 3. Fetch final page HTML
  console.log('\n── 3. Final page HTML checks ──');
  const finalPageUrl = `${BASE_URL}/magazine-page/${magazineId}/${pageCount}`;
  info(`Fetching: ${finalPageUrl}`);

  let html = '';
  let htmlOk = false;

  try {
    const { body, status } = await fetchText(finalPageUrl);
    if (status !== 200) {
      fail(`Final page returned HTTP ${status} — magazine ID "${magazineId}" may not exist`);
    } else {
      pass(`Final page loaded (HTTP 200)`);
      html = body;
      htmlOk = true;
    }
  } catch (err) {
    fail(`Could not fetch final page: ${err.message}`);
  }

  if (htmlOk) {
    // 3a. Partner card present
    if (html.includes('magazine-partner-card')) {
      pass('Partner card container (.magazine-partner-card) found in HTML');
    } else {
      fail('Partner card container NOT found — partner may not be enabled for this magazine');
    }

    // 3b. Logo as <img> — never as background-image
    const logoUrl = effectivePartner?.logoUrl;
    if (logoUrl) {
      // Check img tag contains the logo URL
      const logoInImg = html.includes(`src="${logoUrl}"`) || html.includes(`src='${logoUrl}'`) ||
        // URL might be escaped/encoded
        html.includes(logoUrl.replace(/&/g, '&amp;'));
      if (logoInImg) {
        pass(`Logo found as <img src="${logoUrl.substring(0, 40)}...">`);
      } else {
        fail(`Logo URL found in partner data but NOT rendered as <img> — logo: ${logoUrl.substring(0, 60)}`);
      }

      // Logo must NOT be used as CSS background-image
      const logoEscaped = logoUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const bgPattern = new RegExp(`background(?:-image)?\\s*:\\s*url\\(['"]{0,1}${logoEscaped}`);
      if (bgPattern.test(html)) {
        fail('CRITICAL: Logo URL appears as CSS background-image — this is wrong!');
      } else {
        pass('Logo is NOT used as CSS background-image');
      }
    } else {
      info('No logo URL in partner data — skipping logo checks');
    }

    // 3c. WhatsApp contact button
    const hasWhatsapp = effectivePartner?.whatsapp || (docPartner && docPartner.whatsapp);
    if (hasWhatsapp) {
      if (html.includes('wa.me/') && html.includes('booking_clicked')) {
        pass('WhatsApp contact button found (wa.me link + booking_clicked tracking)');
      } else if (html.includes('wa.me/')) {
        pass('WhatsApp contact button found (wa.me link)');
      } else {
        fail('WhatsApp contact button NOT found despite partner.whatsapp being set');
      }
    } else {
      info('No WhatsApp in partner data — skipping WhatsApp contact check');
    }

    // 3d. Booking button
    const hasBooking = effectivePartner?.bookingUrl || effectivePartner?.website ||
      (docPartner && (docPartner.bookingUrl || docPartner.website));
    if (hasBooking) {
      const bookingText = isSpanish ? 'Reservar experiencia' : 'Book experience';
      if (html.includes(bookingText)) {
        pass(`Booking button found: "${bookingText}"`);
      } else {
        fail(`Booking button NOT found: "${bookingText}"`);
      }
    } else {
      info('No booking URL in partner data — skipping booking check');
    }

    // 3e. Instagram button
    const hasInstagram = effectivePartner?.instagramUrl || (docPartner && docPartner.instagramUrl);
    if (hasInstagram) {
      const igText = isSpanish ? 'Ver en Instagram' : 'View Instagram';
      if (html.includes(igText)) {
        pass(`Instagram button found: "${igText}"`);
      } else {
        fail(`Instagram button NOT found: "${igText}"`);
      }
    } else {
      info('No Instagram URL in partner data — skipping Instagram check');
    }

    // 3f. Google review button
    const hasGoogle = effectivePartner?.googleReviewUrl || (docPartner && docPartner.googleReviewUrl);
    if (hasGoogle) {
      const reviewText = isSpanish ? 'Dejar reseña en Google' : 'Leave Google review';
      if (html.includes(reviewText)) {
        pass(`Google review button found: "${reviewText}"`);
      } else {
        fail(`Google review button NOT found: "${reviewText}"`);
      }
    } else {
      info('No Google review URL in partner data — skipping Google review check');
    }

    // 3g. WhatsApp share button
    const shareText = isSpanish ? 'Compartir revista por WhatsApp' : 'Share magazine on WhatsApp';
    if (html.includes(shareText)) {
      pass(`WhatsApp share button found: "${shareText}"`);
    } else if (html.includes('Compartir revista') || html.includes('Share magazine')) {
      pass('WhatsApp share button found (partial match)');
    } else {
      fail(`WhatsApp share button NOT found: "${shareText}"`);
    }

    // 3h. Analytics tracking attributes
    if (html.includes('data-track-click="booking_clicked"')) {
      pass('Analytics: data-track-click="booking_clicked" found');
    } else {
      fail('Analytics: data-track-click="booking_clicked" NOT found on any button');
    }
    if (html.includes('magazine_shared_whatsapp') || html.includes('data-track-click="magazine_shared_whatsapp"')) {
      pass('Analytics: magazine_shared_whatsapp tracking found');
    } else {
      fail('Analytics: magazine_shared_whatsapp tracking NOT found');
    }

    // 3i. Sanity: no logo background in any <div> style on this page
    if (!html.match(/style="[^"]*background[^"]*url\([^)]*\/uploads\/partners\//)) {
      pass('No partner logo path found as CSS background-image on page');
    } else {
      fail('CRITICAL: Found a CSS background-image referencing /uploads/partners/ — logo may be used as background');
    }
  }

  // 4. Analytics endpoint
  console.log('\n── 4. Analytics endpoint ──');
  try {
    const result = await fetchHead(`${BASE_URL}/api/partner/events`);
    if ([200, 401, 405].includes(result.status)) {
      pass(`Analytics endpoint reachable (HTTP ${result.status})`);
    } else {
      fail(`Analytics endpoint returned unexpected HTTP ${result.status}`);
    }
  } catch (err) {
    fail(`Analytics endpoint unreachable: ${err.message}`);
  }

  // Summary
  console.log('\n=== Result ===');
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  if (failed === 0) {
    console.log('✅ All checks passed');
    process.exit(0);
  } else {
    console.error(`❌ ${failed} check(s) failed — see above`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
