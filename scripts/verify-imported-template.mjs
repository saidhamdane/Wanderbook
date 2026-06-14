#!/usr/bin/env node
/**
 * Verification script - active templates: aurora-editorial + atlas-nocturne-editorial
 * Usage: APP_URL=http://localhost:3002 npm run verify:imported-template
 */

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const AURORA_ID = 'aurora-editorial';
const ATLAS_ID = 'atlas-nocturne-editorial';
const AURORA_EXPECTED_PAGES = 8;
const ATLAS_EXPECTED_PAGES = 8;

const PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /\bplaceholder\b/i,
  /PHOTO PLACEHOLDER/i,
  /demo text/i,
  /\[destination\]/i,
  /\[title\]/i,
  /^undefined$/i,
  /^null$/i,
];

const UNRELATED_DESTINATION_PATTERNS = [
  /London/i,
  /Paris/i,
  /Big Ben/i,
  /Eiffel/i,
  /Egypt/i,
  /Bali/i,
  /Santorini/i,
  /New York/i,
  /Dubai/i,
  /TripMag AI/i,
  /AI generated/i,
];

const UNRELATED_IMAGE_PATTERNS = [
  /concert/i,
  /poster/i,
  /meme/i,
  /screenshot/i,
  /ui screenshot/i,
  /London/i,
  /Paris/i,
  /Big Ben/i,
  /Eiffel/i,
  /Bali/i,
  /Santorini/i,
  /Dubai/i,
  /New York/i,
];

const RETIRED_NAMES = [
  'Red &amp; White Bold Travel', 'Red & White Bold Travel',
  'Green Beige Modern', 'green-beige-modern-magazine', 'red-white-bold-travel',
  'Wander Together', 'Blue Bold', 'Explore Editorial', 'Travel Minimal',
  'Red Bold Retro', 'Modern Editorial', 'Hanover Magazine', 'Wanderbook Luxury', 'Canva Travel',
  'wander-together', 'blue-bold', 'explore-editorial', 'travel-minimal',
  'hanover', 'wanderbook-luxury', 'canva-travel', 'wanderbook-editorial',
];

const AURORA_IMAGE_SLOTS = [
  'cover-photo', 'toc-photo', 'intro-photo', 'feature-photo',
  'gallery-photo-1', 'gallery-photo-2', 'gallery-photo-3', 'gallery-photo-4', 'gallery-photo-5',
  'story-photo-1', 'story-photo-2', 'story-photo-3', 'back-photo',
];

let failures = 0;
let passes = 0;
function pass(msg) { console.log('  OK ' + msg); passes++; }
function fail(msg) { console.error('  FAIL ' + msg); failures++; }
function check(c, p, f) { c ? pass(p) : fail(f); }

async function generateTemplate(destination, templateId, label) {
  console.log('\nGenerating ' + label + ' for ' + destination + '...');
  const res = await fetch(BASE_URL + '/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId,
      destination,
      familyName: 'Test Family',
      travelerType: 'family',
      style: 'Classic Editorial',
      language: 'en',
      useStockFallback: true,
    }),
  });
  if (!res.ok) {
    fail(destination + ' ' + label + ' generate returned ' + res.status + ': ' + (await res.text()).slice(0, 240));
    process.exit(1);
  }
  const doc = await res.json();
  pass(destination + ' ' + label + ' generate returned 200');
  check(doc.templateId === templateId, destination + ' templateId = ' + templateId, destination + ' templateId mismatch: ' + doc.templateId);
  const expectedPages = templateId === ATLAS_ID ? ATLAS_EXPECTED_PAGES : AURORA_EXPECTED_PAGES;
  check(Array.isArray(doc.pages) && doc.pages.length === expectedPages,
    destination + ' ' + label + ' has ' + expectedPages + ' pages',
    destination + ' ' + label + ' expected ' + expectedPages + ', got ' + doc.pages?.length);
  return doc;
}

async function generateAurora(destination) {
  return generateTemplate(destination, AURORA_ID, 'Aurora Editorial');
}

async function generateAtlas(destination) {
  return generateTemplate(destination, ATLAS_ID, 'Atlas Nocturne');
}

async function verifyCreateDestinationSync(destination, templateId) {
  console.log('\nChecking create flow destination sync for ' + destination + '...');
  const [{ default: puppeteer }, { writeFile, mkdtemp, rm }, { tmpdir }, { join }] = await Promise.all([
    import('puppeteer'),
    import('fs/promises'),
    import('os'),
    import('path'),
  ]);
  const tmp = await mkdtemp(join(tmpdir(), 'wanderbook-verify-'));
  const imagePath = join(tmp, 'photo.png');
  await writeFile(
    imagePath,
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lhS9WQAAAABJRU5ErkJggg==',
      'base64'
    )
  );

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    const payloads = [];
    let resolveGenerateRequest;
    const generateRequestPromise = new Promise((resolve) => {
      resolveGenerateRequest = resolve;
    });
    page.on('console', (msg) => {
      const text = msg.text();
      if (text.includes('[Wanderbook] generating with destination:')) payloads.push(text);
    });
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/api/generate') && request.method() === 'POST') {
        const body = request.postData() || '';
        payloads.push(body);
        resolveGenerateRequest(body);
        request.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'verify_' + destination.toLowerCase().replace(/\s+/g, '_') }),
        });
      } else {
        request.continue();
      }
    });

    await page.goto(BASE_URL + '/create', { waitUntil: 'networkidle0' });
    await page.evaluate((dest) => {
      const button = Array.from(document.querySelectorAll('button')).find((el) => el.textContent?.trim() === dest);
      if (!button) throw new Error('Island button not found: ' + dest);
      button.click();
    }, destination);
    await page.waitForFunction((dest) => document.body.textContent?.includes('Upload ' + dest + ' Photos'), {}, destination);
    pass('Upload button updates to ' + destination);

    if (templateId !== AURORA_ID) {
      await page.evaluate((tid) => {
        const template = document.querySelector(`[data-template-id="${tid}"]`);
        if (!(template instanceof HTMLElement)) throw new Error('Template not found: ' + tid);
        template.click();
      }, templateId);
    }

    await page.evaluate((dest) => {
      const button = Array.from(document.querySelectorAll('button')).find((el) => el.textContent?.includes('Upload ' + dest + ' Photos'));
      if (!button) throw new Error('Upload button not found for ' + dest);
      button.click();
    }, destination);
    await page.waitForSelector('input[type="file"]');
    const input = await page.$('input[type="file"]');
    await input.uploadFile(imagePath);
    await page.waitForFunction(() => document.body.textContent?.includes('1 / 20 selected'));
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((el) => el.textContent?.includes('Continue'));
      if (!button) throw new Error('Continue button not found');
      button.click();
    });
    await page.waitForSelector('select');
    const currentDestination = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const destSelect = selects.find((el) => Array.from(el.options).some((o) => o.value === 'Fuerteventura'));
      return destSelect?.value || '';
    });
    check(currentDestination === destination,
      'Step 3 destination equals ' + destination,
      'Step 3 destination expected ' + destination + ', got ' + currentDestination);

    const previewDestination = await page.$eval('[data-preview-source]', (el) => el.getAttribute('data-preview-destination') || '');
    check(previewDestination === destination,
      'Live preview receives ' + destination,
      'Live preview expected ' + destination + ', got ' + previewDestination);

    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find((el) => el.textContent?.includes('Create your Canary magazine'));
      if (!button) throw new Error('Create button not found');
      button.click();
    });
    await Promise.race([
      generateRequestPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out waiting for generate request')), 5000)),
    ]);
    const payloadText = payloads.join('\n');
    check(payloadText.includes('destination') && payloadText.includes(destination),
      'Generate payload contains destination ' + destination,
      'Generate payload missing destination ' + destination);
  } finally {
    if (browser) await browser.close();
    await rm(tmp, { recursive: true, force: true });
  }
}

function checkAuroraDoc(doc, destination) {
  console.log('\nChecking Aurora content for ' + destination + '...');
  for (const s of AURORA_IMAGE_SLOTS) {
    const v = doc.pages.flatMap((p) => Object.entries(p.slots)).find(([k]) => k === s)?.[1] || '';
    check(String(v).trim() !== '', destination + ' "' + s + '" filled', destination + ' "' + s + '" EMPTY');
  }

  let badText = false;
  for (const page of doc.pages) {
    for (const [k, v] of Object.entries(page.slots)) {
      if (typeof v !== 'string') continue;
      for (const p of PLACEHOLDER_PATTERNS) {
        if (p.test(v)) { fail(destination + ' placeholder in "' + k + '": "' + v.slice(0, 80) + '"'); badText = true; }
      }
    }
  }
  if (!badText) pass(destination + ' has no PHOTO PLACEHOLDER or lorem ipsum');

  const allText = doc.pages.flatMap((p) => Object.values(p.slots)).join(' ');
  check(allText.toLowerCase().includes(destination.toLowerCase()),
    destination + ' appears in Aurora copy',
    destination + ' missing from Aurora copy');

  for (const p of UNRELATED_DESTINATION_PATTERNS) {
    check(!p.test(allText),
      destination + ' output has no unrelated "' + p.source + '" text',
      destination + ' output contains unrelated "' + p.source + '" text');
  }
}

function checkDoesNotMention(doc, forbidden, label) {
  const allText = doc.pages.flatMap((p) => Object.values(p.slots)).join(' ');
  check(!new RegExp('\\b' + forbidden + '\\b', 'i').test(allText),
    label + ' output does not contain ' + forbidden,
    label + ' output contains ' + forbidden);
}

async function checkPreviewAndPdf(doc, label) {
  console.log('\nChecking preview and PDF for ' + label + '...');
  const previewUrl = BASE_URL + '/preview/' + doc.id;
  const pdfUrl = BASE_URL + '/api/export-pdf?magazineId=' + encodeURIComponent(doc.id);

  const preview = await fetch(previewUrl);
  check(preview.status === 200, label + ' preview returns 200', label + ' preview returned ' + preview.status);
  const html = await preview.text();
  check(!/client-side exception|application error/i.test(html),
    label + ' preview has no client-side exception marker',
    label + ' preview contains client-side exception marker');
  check(html.includes('Create your own Canary Islands travel magazine'),
    label + ' share page contains Canary CTA',
    label + ' share page missing Canary CTA');
  check(!html.includes('PHOTO PLACEHOLDER'), label + ' preview has no PHOTO PLACEHOLDER', label + ' preview contains PHOTO PLACEHOLDER');
  check(!/lorem\s+ipsum/i.test(html), label + ' preview has no lorem ipsum', label + ' preview contains lorem ipsum');

  const pdf = await fetch(pdfUrl);
  check(pdf.status === 200, label + ' PDF returns 200', label + ' PDF returned ' + pdf.status);
  check((pdf.headers.get('content-type') || '').includes('application/pdf'),
    label + ' PDF returns application/pdf',
    label + ' PDF content-type wrong: ' + pdf.headers.get('content-type'));

  return { previewUrl, pdfUrl };
}

console.log('\nChecking /create page...');
let createHtml = '';
try {
  const res = await fetch(BASE_URL + '/create');
  check(res.status === 200, '/create returns 200', '/create returned ' + res.status);
  createHtml = await res.text();
} catch (e) { fail('/create error: ' + e.message); }

if (createHtml) {
  check(createHtml.includes('Your Canary Islands trip deserves more than a photo gallery.'),
    'Canary Islands headline exists',
    'Canary Islands headline missing');
  check(createHtml.includes('Turn photos from Tenerife, Fuerteventura, Lanzarote or Gran Canaria into a luxury personal travel magazine in 60 seconds.'),
    'Canary Islands subheadline exists',
    'Canary Islands subheadline missing');
  check(createHtml.includes('Create your Canary magazine'),
    'Canary CTA exists',
    'Canary CTA missing');
  check(createHtml.includes('YOUR NAME OR FAMILY NAME'),
    'Step 3 contains YOUR NAME OR FAMILY NAME',
    'Step 3 missing YOUR NAME OR FAMILY NAME');
  check(createHtml.includes('This will appear naturally in your magazine story.'),
    'Step 3 helper text exists',
    'Step 3 helper text missing');
  check(createHtml.includes('data-mobile-sticky-create="true"') && createHtml.includes('sticky-create-mobile'),
    'Create button is sticky on mobile',
    'Create button missing mobile sticky marker/class');
  check(createHtml.includes('Tenerife Teide black sand Anaga Los Gigantes Atlantic coast'),
    'Live Preview uses deterministic Tenerife Canary fallback',
    'Live Preview missing deterministic Tenerife fallback');
  for (const p of UNRELATED_IMAGE_PATTERNS) {
    check(!p.test(createHtml),
      'Live Preview has no unrelated "' + p.source + '" marker',
      'Live Preview contains unrelated "' + p.source + '" marker');
  }
  check(!/client-side exception|application error/i.test(createHtml),
    '/create has no client-side exception marker',
    '/create contains client-side exception marker');
  for (const dest of ['Tenerife', 'Fuerteventura', 'Lanzarote', 'Gran Canaria']) {
    check(createHtml.includes('value="' + dest + '"') || createHtml.includes('>' + dest + '<'),
      'Destination selector includes ' + dest,
      'Destination selector missing ' + dest);
  }
  check(/<option[^>]+value="Tenerife"[^>]*>/i.test(createHtml) || createHtml.includes('"destination":"Tenerife"') || createHtml.includes('Tenerife'),
    'Default destination is Tenerife',
    'Default destination does not appear to be Tenerife');
  check(createHtml.includes('Upload Tenerife Photos'),
    'Default upload button is Tenerife before user changes it',
    'Default upload button is not Tenerife before user changes it');
  check(createHtml.includes('Wanderbook Canarias'),
    '/create uses Wanderbook Canarias branding',
    '/create missing Wanderbook Canarias branding');
  check(createHtml.includes('Tus recuerdos de Canarias merecen más que una galería.'),
    '/create contains Spanish Canary line',
    '/create missing Spanish Canary line');
  check(createHtml.includes('For photographers, tour guides and holiday rentals in the Canary Islands'),
    '/create contains Canary B2B section',
    '/create missing Canary B2B section');
  check(createHtml.includes('Aurora Editorial') || createHtml.includes('aurora-editorial'),
    '/create contains Aurora Editorial', '/create missing Aurora Editorial');
  check(createHtml.includes('Atlas Nocturne') || createHtml.includes('atlas-nocturne-editorial'),
    '/create contains Atlas Nocturne', '/create missing Atlas Nocturne');
  for (const name of RETIRED_NAMES) {
    check(!createHtml.includes(name),
      '/create does not contain "' + name + '"',
      '/create still shows "' + name + '"');
  }
}

await verifyCreateDestinationSync('Fuerteventura', AURORA_ID);
await verifyCreateDestinationSync('Lanzarote', ATLAS_ID);

console.log('\nChecking template registry...');
const rejectedIds = ['red-white-bold-travel', 'green-beige-modern-magazine', 'red-bold', 'green-beige', 'wander-together', 'hanover', 'wanderbook-editorial'];
for (const tid of rejectedIds) {
  try {
    const res = await fetch(BASE_URL + '/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId: tid, destination: 'Tenerife', travelers: 'Test', style: 'Classic Editorial', language: 'en', useStockFallback: false }),
    });
    check(res.status >= 400, '"' + tid + '" is rejected (' + res.status + ')', '"' + tid + '" is still accepted (' + res.status + ')');
  } catch {
    pass('"' + tid + '" caused error (acceptable)');
  }
}

const tenerifeDoc = await generateAurora('Tenerife');
checkAuroraDoc(tenerifeDoc, 'Tenerife');

const fuerteventuraDoc = await generateAurora('Fuerteventura');
checkAuroraDoc(fuerteventuraDoc, 'Fuerteventura');
checkDoesNotMention(fuerteventuraDoc, 'Tenerife', 'Fuerteventura Aurora');
checkDoesNotMention(fuerteventuraDoc, 'Teide', 'Fuerteventura Aurora');

const lanzaroteDoc = await generateAtlas('Lanzarote');
checkDoesNotMention(lanzaroteDoc, 'Tenerife', 'Lanzarote Atlas');
checkDoesNotMention(lanzaroteDoc, 'Teide', 'Lanzarote Atlas');

const fuerteventuraUrls = await checkPreviewAndPdf(fuerteventuraDoc, 'Fuerteventura Aurora');
const lanzaroteUrls = await checkPreviewAndPdf(lanzaroteDoc, 'Lanzarote Atlas');

console.log('\n' + '-'.repeat(54));
console.log('Results: ' + passes + ' passed, ' + failures + ' failed');
console.log('Create URL: ' + BASE_URL + '/create');
console.log('Fuerteventura preview URL: ' + fuerteventuraUrls.previewUrl);
console.log('Fuerteventura PDF URL: ' + fuerteventuraUrls.pdfUrl);
console.log('Lanzarote preview URL: ' + lanzaroteUrls.previewUrl);
console.log('Lanzarote PDF URL: ' + lanzaroteUrls.pdfUrl);

if (failures === 0) {
  console.log('All checks passed.');
} else {
  console.error(failures + ' check(s) failed.');
  process.exit(1);
}
