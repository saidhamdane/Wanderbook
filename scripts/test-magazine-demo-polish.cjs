const assert = require('assert');
const fs = require('fs');
const Module = require('module');
const path = require('path');
const ts = require('typescript');

const root = process.cwd();

process.env.OPENAI_API_KEY = '';
process.env.ANTHROPIC_API_KEY = '';

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function resolveFilename(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    return originalResolveFilename.call(this, path.join(root, request.slice(2)), parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions['.ts'] = function loadTs(module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  module._compile(output, filename);
};

require.extensions['.tsx'] = require.extensions['.ts'];

const { generateMagazine } = require(path.join(root, 'lib/magazine/generate-magazine.ts'));
const { normalizeSpanishSentences } = require(path.join(root, 'lib/magazine/generate-copy.ts'));
const { resolveActivityProfile } = require(path.join(root, 'lib/magazine/resolveActivityProfile.ts'));
const CompanyPageLayout = require(path.join(root, 'components/layouts/CompanyPageLayout.tsx')).default;

const MARITIME = ['boat', 'catamaran', 'sailing', 'dolphin', 'marina', 'yacht', 'surf'];
const BOAT_INCOMPATIBLE = ['buggy', 'off-road', 'offroad', 'dunes'];
const ENGLISH_FALLBACKS = [
  /fuerteventura's rugged landscapes await your exploration/i,
  /the rugged/i,
  /await your/i,
  /your exploration/i,
  /landscapes await/i,
  /discover rugged/i,
  /\bbook your\b/i,
  /\bunforgettable experience\b/i,
];

function allAssetUrls(profile) {
  return Object.values(profile.demoAssets).flat();
}

function allSlotText(doc) {
  return doc.pages.flatMap((page) =>
    Object.entries(page.slots)
      .filter(([, value]) => typeof value === 'string')
      .map(([slot, value]) => ({ pageId: page.pageId, slot, value }))
  );
}

function imageSlots(doc) {
  return allSlotText(doc).filter(({ value }) => /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(value));
}

function assertNoTerms(values, terms, label) {
  for (const value of values) {
    for (const term of terms) {
      assert(!value.toLowerCase().includes(term), `${label} must not contain "${term}": ${value}`);
    }
  }
}

function assertNoEnglishFallbackText(values, label) {
  for (const value of values) {
    for (const marker of ENGLISH_FALLBACKS) {
      assert(!marker.test(value), `${label} must not contain English fallback ${marker}: ${value}`);
    }
    assert(!/aventureros Con/.test(value), `${label} must normalize "aventureros Con": ${value}`);
    assert(!/inolvidables Desde/.test(value), `${label} must normalize "inolvidables Desde": ${value}`);
  }
}

function collectReactText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') {
    out.push(String(node));
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((child) => collectReactText(child, out));
    return out;
  }
  collectReactText(node.props?.children, out);
  return out;
}

function assertCompanyPageSpanishFallbacks() {
  const element = CompanyPageLayout({
    slots: {
      'company-name': 'Fuerte Experience',
      'partner-main-island': 'Fuerteventura',
      'partner-activity-type': 'buggy adventure',
      'partner-resolved-activity-type': 'buggy-adventure',
    },
    palette: {
      primary: '#111111',
      accent: '#666666',
      background: '#ffffff',
      text: '#222222',
      light: '#eeeeee',
    },
    fonts: { heading: 'serif', subheading: 'sans-serif', body: 'sans-serif' },
    pageIndex: 0,
    language: 'es',
    partner: {
      enabled: true,
      businessName: 'Fuerte Experience',
      mainIsland: 'Fuerteventura',
      activityType: 'buggy adventure',
      aiCompanyPageTitle: 'The Fuerte Experience Adventure',
      aiCompanyPageSubtitle: 'Discover rugged landscapes',
      aiCompanyPageBody: 'Discover rugged landscapes with your guide and enjoy an unforgettable experience.',
      aiCompanyTrustLine: "Fuerteventura's rugged landscapes await your exploration.",
      aiCompanyFinalCtaLine: 'Book your next unforgettable experience.',
      aiIslandContextLine: "Fuerteventura's rugged landscapes await your exploration.",
      aiActivityDescription: 'Explore Fuerteventura with your crew.',
      aiPositiveReviewThemes: ['Friendly guides', 'Unforgettable experience'],
    },
  });

  const text = collectReactText(element).join(' ');
  assertNoEnglishFallbackText([text], 'company page');
  assert(text.includes('Los paisajes volcanicos de Fuerteventura'), 'company page must render Spanish buggy context fallback');
  assert(text.includes('La experiencia con Fuerte Experience'), 'company page must render Spanish title fallback');
}

function assertNormalizeSpanishSentences() {
  assert.strictEqual(
    normalizeSpanishSentences('aventureros Con vistas al volcan'),
    'Aventureros. Con vistas al volcan'
  );
  assert.strictEqual(
    normalizeSpanishSentences('recuerdos inolvidables Desde la cima'),
    'Recuerdos inolvidables. Desde la cima'
  );
  assert.strictEqual(normalizeSpanishSentences('Explora Fuerteventura'), 'Explora Fuerteventura');
  assert.strictEqual(
    normalizeSpanishSentences('Una experiencia en buggy Buggy en las dunas'),
    'Una experiencia en buggy. Buggy en las dunas'
  );
}

async function testBuggySpanishDemo() {
  const profile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    aiDetectedActivityType: 'buggy adventure',
  }, 'es');

  assert.strictEqual(profile.activityType, 'buggy-adventure');
  for (const slot of ['cover', 'contents', 'welcome', 'localHighlights', 'story', 'finalCta', 'gallery']) {
    assert(Array.isArray(profile.demoAssets[slot]), `buggy demoAssets.${slot} must be an array`);
    assert(profile.demoAssets[slot].length >= 1, `buggy demoAssets.${slot} must not be empty`);
  }
  assertNoTerms(allAssetUrls(profile), MARITIME, 'buggy demo assets');
  assert(new Set(allAssetUrls(profile)).size >= 6, 'buggy demo pool must contain at least six distinct URLs');

  const major = [
    profile.demoAssets.cover[0],
    profile.demoAssets.contents[0],
    profile.demoAssets.welcome[0],
    profile.demoAssets.company[0],
    profile.demoAssets.localHighlights[0],
    profile.demoAssets.story[0],
    profile.demoAssets.finalCta[0],
  ];
  assert.strictEqual(new Set(major).size, major.length, 'each major buggy slot must use a distinct image URL');

  const doc = await generateMagazine({
    templateId: profile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Demo',
    style: 'Adventurous',
    language: 'es',
    userPhotos: [],
    useStockFallback: false,
    generationMode: 'demo',
    activityProfile: profile,
  });

  const texts = allSlotText(doc).map(({ value }) => value);
  assert.strictEqual(doc.pages[0].slots['cover-title'], 'AVENTURA EN BUGGY');
  assert.strictEqual(doc.imageAudit.mode, 'demo');
  assert.strictEqual(doc.generationMode, 'demo', 'generationMode must stay "demo"');
  assert.strictEqual(doc.isPubliclyShareable, false, 'demo magazine must not be publicly shareable');
  assertNoEnglishFallbackText(texts, 'buggy demo');
  assertNoTerms(doc.imageAudit.selectedImages.map((entry) => entry.url), MARITIME, 'buggy selected images');
  const distinctImages = new Set(doc.imageAudit.selectedImages.map((entry) => entry.url).filter(Boolean));
  assert(distinctImages.size >= 5, 'buggy demo generated doc must contain at least 5 distinct image URLs');
}

async function testBoatSpanishDemo() {
  const profile = resolveActivityProfile({ activityType: 'Boat Tour' }, 'es');
  assert.strictEqual(profile.activityType, 'boat-tour');
  assertNoTerms(allAssetUrls(profile), BOAT_INCOMPATIBLE, 'boat demo assets');
  assert(new Set(allAssetUrls(profile)).size >= 4, 'boat demo pool must contain varied URLs');
  assert(new Set(profile.demoAssets.gallery).size >= 2, 'boat gallery must not repeat one image for every tile');

  const doc = await generateMagazine({
    templateId: profile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Demo',
    style: 'Warm & Personal',
    language: 'es',
    userPhotos: [],
    useStockFallback: false,
    generationMode: 'demo',
    activityProfile: profile,
  });

  const texts = allSlotText(doc).map(({ value }) => value);
  assertNoTerms(texts, ['buggy', 'off-road'], 'boat demo text');
  assert(texts.some((value) => /\b(barco|mar|costa)\b/i.test(value)), 'boat demo Spanish copy must mention barco, mar, or costa');
  assert(new Set(imageSlots(doc).map(({ value }) => value)).size >= 2, 'boat rendered image slots must be varied');
}

async function testTravelerModeRegression() {
  const profile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    aiDetectedActivityType: 'buggy adventure',
  }, 'es');
  const buggyTestPhoto = {
    url: '/test-assets/buggy-demo.jpg',
    originalName: 'buggy-fuerteventura.jpg',
    width: 1920,
    height: 1080,
    orientation: 'landscape',
  };
  const doc = await generateMagazine({
    templateId: profile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Cliente',
    style: 'Warm & Personal',
    language: 'es',
    userPhotos: [buggyTestPhoto],
    useStockFallback: false,
    generationMode: 'traveler',
    activityProfile: profile,
  });

  assert.strictEqual(doc.imageAudit.mode, 'traveler');
  assert(
    doc.imageAudit.selectedImages.some((entry) => entry.url === buggyTestPhoto.url && /story-photo|gallery-photo|memories-|route-photo/.test(entry.slot)),
    'traveler upload must appear in a traveler story/gallery slot'
  );
}

(async () => {
  assertNormalizeSpanishSentences();
  assertCompanyPageSpanishFallbacks();
  await testBuggySpanishDemo();
  await testBoatSpanishDemo();
  await testTravelerModeRegression();
  console.log('Magazine demo polish assertions passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
