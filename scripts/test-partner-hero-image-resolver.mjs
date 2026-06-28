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

const { resolveActivityProfile } = loadTsModule('lib/magazine/resolveActivityProfile.ts');
const { resolvePartnerHeroImage } = loadTsModule('lib/magazine/resolvePartnerHeroImage.ts');

function lower(value) {
  return String(value || '').toLowerCase();
}

function assertNoTerms(name, text, terms) {
  for (const term of terms) {
    assert(!lower(text).includes(lower(term)), `${name} must not contain "${term}"`);
  }
}

function assertProfileTextIncludes(name, profile, terms) {
  const text = lower([
    profile.previewImage,
    profile.previewAlt?.en,
    profile.previewAlt?.es,
    profile.previewTitle?.en,
    profile.previewTitle?.es,
    profile.previewSubtitle?.en,
    profile.previewSubtitle?.es,
    profile.allowedImageKeywords?.join(' '),
  ].join(' '));
  assert(terms.some((term) => text.includes(lower(term))), `${name} should include one of: ${terms.join(', ')}`);
}

{
  const profile = resolveActivityProfile({
    businessName: 'Family Buggy Fuerteventura',
    businessType: 'Buggy Adventure',
  }, 'es');
  const hero = resolvePartnerHeroImage(null, profile);

  assert.equal(profile.activityType, 'buggy-adventure');
  assert.equal(hero, '/template-covers/buggy-adventure.jpg');
  assert.equal(profile.activityBadge.en, 'BUGGY ADVENTURE');
  assert.equal(profile.activityBadge.es, 'AVENTURA EN BUGGY');
  assert(!hero.includes('default-cover'), 'buggy hero must not be the generic default cover');
  assertNoTerms('buggy hero', hero, ['boat', 'catamaran', 'villa', 'photographer', 'surf', 'road']);
}

{
  const profile = resolveActivityProfile({ activityType: 'boat-tour' }, 'en');
  const hero = resolvePartnerHeroImage(null, profile);

  assert.equal(profile.activityType, 'boat-tour');
  assert.equal(hero, '/template-covers/boat-trip.jpg');
  assert.equal(profile.activityBadge.en, 'BOAT TRIP');
  assertProfileTextIncludes('boat profile', profile, ['boat', 'ocean', 'atlantic', 'catamaran', 'sailing']);
  assertNoTerms('boat hero', hero, ['buggy', 'off-road', 'dunes']);
}

{
  const profile = resolveActivityProfile({ activityType: 'photographer' }, 'en');
  const hero = resolvePartnerHeroImage(null, profile);

  assert.equal(profile.activityType, 'photographer');
  assert.equal(profile.activityBadge.en, 'PHOTOGRAPHY');
  assert.notEqual(hero, '/template-covers/aurora-editorial.jpg');
  assert.notEqual(hero, '/template-covers/default-cover.jpg');
  assertProfileTextIncludes('photographer profile', profile, ['family', 'couple', 'portrait', 'photography']);
  assertNoTerms('photographer hero', hero, ['buggy', 'boat', 'catamaran', 'villa']);
}

{
  const profile = resolveActivityProfile({ activityType: 'unknown-xyzzy' }, 'en');
  const hero = resolvePartnerHeroImage(null, profile);

  assert.equal(profile.activityType, 'other');
  assert.equal(hero, '/template-covers/atlas-nocturne.jpg');
  assert.equal(profile.activityBadge.en, 'FUERTEVENTURA EXPERIENCE');
  assertNoTerms('unknown fallback', hero, ['buggy', 'boat-trip', 'catamaran', 'surf']);
}

{
  const profile = resolveActivityProfile({ activityType: 'surf-school' }, 'en');
  const hero = resolvePartnerHeroImage(null, profile);

  assert.equal(profile.activityType, 'surf-camp');
  assert(hero.startsWith('https://images.pexels.com/photos/'), 'surf hero must be a direct Pexels CDN image');
  assert(!hero.includes('default-cover'), 'surf hero must not use default-cover.jpg');
  assertNoTerms('surf hero', hero, ['buggy', 'boat', 'catamaran', 'villa']);
}

{
  const profile = resolveActivityProfile({ activityType: 'buggy-adventure' }, 'en');
  const partnerCover = '/uploads/partners/demo-business/cover.jpg';
  const hero = resolvePartnerHeroImage({ businessCoverImage: partnerCover }, profile);

  assert.equal(hero, partnerCover);
}

{
  const profile = resolveActivityProfile({ businessType: 'guided tour' }, 'en');
  const hero = resolvePartnerHeroImage('javascript:alert(1)', profile);

  assert.equal(profile.activityType, 'tour-guide');
  assert.equal(hero, '/template-covers/tour-guide.jpg');
  assert.equal(profile.activityBadge.en, 'TOUR GUIDE');
}

{
  const buggy = resolvePartnerHeroImage(null, resolveActivityProfile({ activityType: 'buggy-adventure' }, 'en'));
  const boat = resolvePartnerHeroImage(null, resolveActivityProfile({ activityType: 'boat-tour' }, 'en'));
  const photographer = resolvePartnerHeroImage(null, resolveActivityProfile({ activityType: 'photographer' }, 'en'));

  assert.notEqual(buggy, boat);
  assert.notEqual(buggy, photographer);
  assert.notEqual(boat, photographer);
  assertNoTerms('buggy cross-activity hero', buggy, ['boat', 'catamaran', 'photographer']);
  assertNoTerms('boat cross-activity hero', boat, ['buggy', 'off-road']);
  assertNoTerms('photographer cross-activity hero', photographer, ['buggy', 'boat', 'catamaran']);
}

console.log('All partner hero image resolver assertions passed.');
