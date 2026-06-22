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
      jsx: ts.JsxEmit.React,
    },
  }).outputText;
  module._compile(output, filename);
};

const classifierPath = require.resolve(path.join(root, 'lib/magazine/classify-demo-image.ts'));
require.cache[classifierPath] = {
  id: classifierPath,
  filename: classifierPath,
  loaded: true,
  exports: {
    classifyDemoImage: async (url, activityType) => {
      if (url.includes('boat-demo')) {
        return {
          url,
          concepts: ['boat', 'catamaran'],
          accepted: false,
          rejectionReason: `boat-catamaran image rejected for ${activityType}`,
        };
      }
      if (url.includes('buggy-demo')) {
        return {
          url,
          concepts: ['buggy', 'off-road', 'volcanic'],
          accepted: true,
        };
      }
      return {
        url,
        concepts: [],
        accepted: false,
        rejectionReason: 'classification-unavailable',
      };
    },
    conceptsMatchActivity: (concepts) => !concepts.some((concept) => ['boat', 'catamaran'].includes(concept)),
  },
};

const { generateMagazine } = require(path.join(root, 'lib/magazine/generate-magazine.ts'));
const { resolveActivityProfile } = require(path.join(root, 'lib/magazine/resolveActivityProfile.ts'));

const boatTestPhoto = {
  url: '/test-assets/boat-demo.jpg',
  originalName: 'boat-catamaran.jpg',
  width: 1920,
  height: 1080,
  orientation: 'landscape',
};

const buggyTestPhoto = {
  url: '/test-assets/buggy-demo.jpg',
  originalName: 'buggy-fuerteventura.jpg',
  width: 1920,
  height: 1080,
  orientation: 'landscape',
};

const MARITIME = ['boat', 'sailing', 'catamaran', 'yacht', 'dolphin', 'marina', 'surf'];
const ENGLISH_MARKERS = [/^the\s/i, /\sunleash\s/i, /\byour\b/i, /buggy adventure/i];

function imageSlots(doc) {
  const values = [];
  for (const page of doc.pages) {
    for (const [slot, value] of Object.entries(page.slots)) {
      if (typeof value === 'string' && /\.(jpg|jpeg|png|webp|gif|avif)(\?|$)/i.test(value)) {
        values.push({ pageId: page.pageId, slot, value });
      }
    }
  }
  return values;
}

function assertNoTermsInRenderedDoc(doc, terms, label) {
  for (const page of doc.pages) {
    for (const [slot, value] of Object.entries(page.slots)) {
      if (typeof value !== 'string') continue;
      const lower = value.toLowerCase();
      for (const term of terms) {
        assert(!lower.includes(term), `${label}: page ${page.pageId} slot ${slot} must not contain "${term}"`);
      }
    }
  }
}

function assertNoEnglishFallback(doc) {
  for (const page of doc.pages) {
    for (const [slot, value] of Object.entries(page.slots)) {
      if (typeof value !== 'string') continue;
      for (const marker of ENGLISH_MARKERS) {
        assert(!marker.test(value), `Spanish output must not contain English marker ${marker} in ${page.pageId}.${slot}: ${value}`);
      }
    }
  }
}

async function testBuggyDemo() {
  const activityProfile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    aiDetectedActivityType: 'buggy adventure',
    mainIsland: 'Fuerteventura',
  }, 'es');

  const doc = await generateMagazine({
    templateId: activityProfile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Demo',
    style: 'Adventurous',
    language: 'es',
    userPhotos: [],
    useStockFallback: false,
    generationMode: 'demo',
    demoUploads: [boatTestPhoto, buggyTestPhoto],
    activityProfile,
    partnerId: 'test-partner',
  });

  assert.strictEqual(doc.imageAudit.mode, 'demo');
  assert(doc.imageAudit.rejectedImages.length > 0, 'buggy demo must reject at least one demo upload');
  assert(
    doc.imageAudit.rejectedImages.some((entry) => /boat|catamaran/i.test(`${entry.url} ${entry.reason}`)),
    'image audit must identify rejected boat/catamaran upload'
  );
  assert(
    doc.imageAudit.selectedImages.some((entry) => entry.url === buggyTestPhoto.url || activityProfile.demoAssets.cover.includes(entry.url)),
    'buggy demo must select the accepted buggy upload or curated buggy asset'
  );
  for (const entry of doc.imageAudit.selectedImages) {
    for (const term of MARITIME) {
      assert(!entry.url.toLowerCase().includes(term), `selected image audit must not include ${term}: ${entry.url}`);
    }
  }
  assertNoTermsInRenderedDoc(doc, MARITIME, 'buggy demo');
  assertNoEnglishFallback(doc);
  assert(
    doc.pages[0].slots['cover-title'] === 'AVENTURA EN BUGGY',
    'Spanish buggy cover title must be localized'
  );
}

async function testBoatTourDemo() {
  const activityProfile = resolveActivityProfile({ businessName: 'Magic Sailing', activityType: 'Boat Tour' }, 'es');
  const doc = await generateMagazine({
    templateId: activityProfile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Demo',
    style: 'Warm & Personal',
    language: 'es',
    userPhotos: [],
    useStockFallback: false,
    generationMode: 'demo',
    activityProfile,
  });

  assert(new Set(imageSlots(doc).map(({ value }) => value)).size >= 2, 'boat demo image slots must use varied curated boat assets');
  assertNoTermsInRenderedDoc(doc, ['buggy', 'off-road'], 'boat demo');
}

async function testSurfCampDemo() {
  const activityProfile = resolveActivityProfile({ businessName: 'Nomad Surf', activityType: 'surf camp' }, 'es');
  const doc = await generateMagazine({
    templateId: activityProfile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Demo',
    style: 'Warm & Personal',
    language: 'es',
    userPhotos: [],
    useStockFallback: false,
    generationMode: 'demo',
    activityProfile,
  });

  for (const { value } of imageSlots(doc)) {
    assert(!/boat|catamaran|yacht|buggy/i.test(value), `surf demo must not use unrelated activity assets: ${value}`);
  }
  assertNoTermsInRenderedDoc(doc, ['catamaran', 'yacht', 'buggy'], 'surf demo');
}

async function testTravelerModePreservesPhotos() {
  const activityProfile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    aiDetectedActivityType: 'buggy adventure',
  }, 'es');
  const doc = await generateMagazine({
    templateId: activityProfile.templateId,
    destination: 'Fuerteventura',
    travelers: 'Cliente',
    style: 'Warm & Personal',
    language: 'es',
    userPhotos: [buggyTestPhoto],
    useStockFallback: false,
    generationMode: 'traveler',
    activityProfile,
  });

  assert.strictEqual(doc.imageAudit.mode, 'traveler');
  const travelerSlot = imageSlots(doc).find(({ slot, value }) => value === buggyTestPhoto.url && /story-photo|gallery-photo|memories-|route-photo/.test(slot));
  assert(travelerSlot, 'traveler image must be preserved in a traveler story/gallery slot');
  assert.notStrictEqual(doc.pages[0].slots['cover-photo'], buggyTestPhoto.url, 'traveler image must not become the cover');
}

(async () => {
  await testBuggyDemo();
  await testBoatTourDemo();
  await testSurfCampDemo();
  await testTravelerModePreservesPhotos();
  console.log('Rendered magazine demo output assertions passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
