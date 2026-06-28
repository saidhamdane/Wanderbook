import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = process.cwd();
const moduleCache = new Map();

function loadTsModule(relativePath) {
  const filename = path.join(root, relativePath);
  if (moduleCache.has(filename)) return moduleCache.get(filename).exports;

  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(filename, module);

  function localRequire(request) {
    if (request.startsWith('.')) {
      const base = path.resolve(path.dirname(filename), request);
      for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`]) {
        if (fs.existsSync(candidate)) {
          if (candidate.endsWith('.ts') || candidate.endsWith('.tsx')) {
            return loadTsModule(path.relative(root, candidate));
          }
          return createRequire(filename)(candidate);
        }
      }
    }
    return createRequire(filename)(request);
  }

  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
  fn(localRequire, module, module.exports, filename, path.dirname(filename));
  return module.exports;
}

const {
  resolveActivityProfile,
  resolveActivityType,
} = loadTsModule('lib/magazine/resolveActivityProfile.ts');
const { resolvePartnerHeroImage } = loadTsModule('lib/magazine/resolvePartnerHeroImage.ts');

function assertNoGenericRoadImage(name, image) {
  const lower = String(image || '').toLowerCase();
  for (const term of ['road', 'car', 'default-cover', 'aurora-editorial']) {
    assert(!lower.includes(term), `${name} must not use generic travel/car image term "${term}"`);
  }
}

{
  const activityType = resolveActivityType({
    slug: 'family-buggy-fuerteventura',
    businessType: 'Excursion Company',
  });

  assert.equal(activityType, 'buggy-adventure');
}

{
  const profileEs = resolveActivityProfile({
    slug: 'family-buggy-fuerteventura',
    businessType: 'Excursion Company',
  }, 'es');
  const profileEn = resolveActivityProfile({
    slug: 'family-buggy-fuerteventura',
    businessType: 'Excursion Company',
  }, 'en');
  const hero = resolvePartnerHeroImage(null, profileEs);
  const previewCover = profileEs.previewImage;

  assert.equal(profileEs.activityType, 'buggy-adventure');
  assert.equal(profileEs.activityBadge.en, 'BUGGY ADVENTURE');
  assert.equal(profileEs.activityBadge.es, 'AVENTURA EN BUGGY');
  assert.equal(profileEs.previewTitle.es, 'Tu aventura en buggy en Fuerteventura');
  assert.equal(profileEn.previewTitle.en, 'Your buggy adventure in Fuerteventura');
  assert.equal(hero, '/template-covers/buggy-adventure.jpg');
  assert.equal(previewCover, '/template-covers/buggy-adventure.jpg');
  assertNoGenericRoadImage('Family Buggy hero', hero);
  assertNoGenericRoadImage('Family Buggy preview cover', previewCover);
}

{
  assert.equal(resolveActivityType({ activityType: 'buggy-adventure' }), 'buggy-adventure');
  assert.equal(resolveActivityType({ businessType: 'Boat Tour' }), 'boat-tour');
  assert.equal(resolveActivityType({ activityType: 'photographer' }), 'photographer');
  assert.equal(resolveActivityType({ businessType: 'Excursion Company' }), 'other');
}

{
  const boat = resolveActivityProfile({ activityType: 'boat-tour' }, 'en');
  const photographer = resolveActivityProfile({ activityType: 'photographer' }, 'en');
  const unknown = resolveActivityProfile({ businessType: 'Random Unknown Business' }, 'en');

  assert.equal(boat.activityType, 'boat-tour');
  assert.equal(boat.previewImage, '/template-covers/boat-trip.jpg');
  assert(!boat.previewImage.includes('buggy'), 'boat image must stay isolated from buggy images');

  assert.equal(photographer.activityType, 'photographer');
  assert(photographer.previewImage.includes('pexels-photo-1456613'), 'photographer image must stay portrait-specific');
  assert(!photographer.previewImage.includes('buggy'), 'photographer image must stay isolated from buggy images');

  assert.equal(unknown.activityType, 'other');
  assert.equal(unknown.previewImage, '/template-covers/atlas-nocturne.jpg');
  assertNoGenericRoadImage('unknown fallback', unknown.previewImage);
}

{
  const buggyProfile = resolveActivityProfile({ activityType: 'buggy-adventure' }, 'en');
  const uploadedCover = 'https://example.com/custom-partner-cover.jpg';

  assert.equal(resolvePartnerHeroImage({ businessCoverImage: uploadedCover }, buggyProfile), uploadedCover);
  assert.equal(resolvePartnerHeroImage({}, buggyProfile), '/template-covers/buggy-adventure.jpg');
}

console.log('All buggy partner image resolver assertions passed.');
