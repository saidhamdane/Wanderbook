const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = process.cwd();

function loadTsModule(relativePath) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
  }).outputText;
  const module = { exports: {} };
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
  fn(require, module, module.exports, filename, path.dirname(filename));
  return module.exports;
}

const { resolveActivityProfile } = loadTsModule('lib/magazine/resolveActivityProfile.ts');

function assetUrls(profile) {
  return Object.values(profile.demoAssets).flat();
}

function testBuggyDemoVisual() {
  const profile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    aiDetectedActivityType: 'buggy adventure',
    mainIsland: 'Fuerteventura',
  }, 'es');

  assert(profile.demoAssets, 'buggy-adventure must have demoAssets');
  const buggyImage = '/template-covers/buggy-adventure.jpg';
  assert.strictEqual(profile.demoAssets.cover, buggyImage, 'cover must be buggy image');
  assert.strictEqual(profile.demoAssets.contents, buggyImage, 'contents must be buggy image');
  assert.strictEqual(profile.demoAssets.welcome, buggyImage, 'welcome must be buggy image');
  assert.strictEqual(profile.demoAssets.company, buggyImage, 'company must be buggy image');
  assert.strictEqual(profile.demoAssets.localHighlights, buggyImage, 'local highlights must be buggy image');
  assert.strictEqual(profile.demoAssets.story, buggyImage, 'story must be buggy image');
  assert.strictEqual(profile.demoAssets.finalCta, buggyImage, 'final CTA must be buggy image');
  profile.demoAssets.gallery.forEach((img, i) =>
    assert.strictEqual(img, buggyImage, `gallery[${i}] must be buggy image`)
  );

  const maritime = ['boat', 'catamaran', 'sailing', 'dolphin', 'marina', 'yacht'];
  for (const url of assetUrls(profile)) {
    for (const word of maritime) {
      assert(!url.toLowerCase().includes(word), `buggy demoAssets must not reference "${word}" image`);
    }
  }

  const copySource = fs.readFileSync(path.join(root, 'lib/magazine/generate-copy.ts'), 'utf8');
  assert(
    copySource.includes("'Pistas volcanicas'") ||
      copySource.includes('pistas volcanicas') ||
      copySource.includes('Volcan') ||
      copySource.includes('aventura en buggy'),
    'Spanish buggy copy must exist in generate-copy.ts'
  );

  const layoutSource = fs.readFileSync(path.join(root, 'components/layouts/CompanyPageLayout.tsx'), 'utf8');
  assert(
    !layoutSource.includes("`The ${businessName} Experience`") || layoutSource.includes('isSpanish'),
    'CompanyPageLayout must not use English-only title fallback'
  );

  const routeSource = fs.readFileSync(path.join(root, 'app/api/generate/route.ts'), 'utf8');
  assert(
    routeSource.includes('applySpanishCompanyCopyOverride') || routeSource.includes('looksEnglish'),
    'route.ts must apply Spanish override for company copy'
  );
}

function testBoatDemoVisual() {
  const profile = resolveActivityProfile({ businessName: 'Magic Sailing', activityType: 'Boat Tour' }, 'es');
  assert(profile.demoAssets, 'boat-tour must have demoAssets');
  const boatImage = '/template-covers/boat-trip.jpg';
  assert.strictEqual(profile.demoAssets.cover, boatImage);
  profile.demoAssets.gallery.forEach((img) => assert.strictEqual(img, boatImage));
  for (const url of assetUrls(profile)) {
    assert(!url.includes('buggy'), 'boat demoAssets must not reference buggy images');
  }
}

function testSurfDemoVisual() {
  const profile = resolveActivityProfile({ businessName: 'Nomad Surf', activityType: 'surf camp' }, 'es');
  assert(profile.demoAssets, 'surf-camp must have demoAssets');
  for (const url of assetUrls(profile)) {
    assert(!url.includes('boat'), 'surf demoAssets must not use boat images');
    assert(!url.includes('buggy'), 'surf demoAssets must not use buggy images');
    assert(!url.includes('catamaran'), 'surf demoAssets must not use catamaran images');
  }
}

function testOtherDemoVisual() {
  const profile = resolveActivityProfile({ businessName: 'Unknown Co', activityType: 'other' }, 'es');
  assert(profile.demoAssets, 'other must have demoAssets');
  const prohibited = ['boat-trip', 'tour-guide', 'catamaran', 'buggy'];
  for (const url of assetUrls(profile)) {
    for (const bad of prohibited) {
      assert(!url.includes(bad), `other demoAssets must not use "${bad}" image`);
    }
  }
}

function testTravelerPhotoSlotRules() {
  const genSource = fs.readFileSync(path.join(root, 'lib/magazine/generate-magazine.ts'), 'utf8');
  assert(genSource.includes('isDemoMode') || genSource.includes('analyzed.length === 0'), 'generate-magazine.ts must detect demo mode from analyzed.length');
  assert(genSource.includes('demoAssets'), 'generate-magazine.ts must use demoAssets in demo mode');
  assert(genSource.includes('!isDemoMode') || genSource.includes('isDemoMode &&'), 'generate-magazine.ts must skip Pexels only in demo mode');
}

testBuggyDemoVisual();
testBoatDemoVisual();
testSurfDemoVisual();
testOtherDemoVisual();
testTravelerPhotoSlotRules();

console.log('All demo visual consistency assertions passed.');
