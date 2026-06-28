'use strict';

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

const {
  resolveActivityProfile,
  resolveActivityType,
} = loadTsModule('lib/magazine/resolveActivityProfile.ts');

const pageSource = fs.readFileSync(path.join(root, 'app/partner/[slug]/page.tsx'), 'utf8');

function lower(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function previewText(profile, lang) {
  return lower([
    profile.previewTitle?.[lang],
    profile.previewSubtitle?.[lang],
    profile.previewImage,
    profile.previewAlt?.[lang],
  ].join(' '));
}

function assertContainsOne(name, text, terms) {
  assert(terms.some((term) => text.includes(lower(term))), `${name} should contain one of: ${terms.join(', ')}`);
}

function assertContainsNone(name, text, terms) {
  for (const term of terms) {
    assert(!text.includes(lower(term)), `${name} should not contain "${term}"`);
  }
}

function assertPreviewImageExists(profile) {
  assert(profile.previewImage, `${profile.activityType} must define previewImage`);
  if (/^https:\/\/images\.pexels\.com\/photos\/.+\.(jpe?g|png|webp)(\?|$)/i.test(profile.previewImage)) {
    return;
  }
  assert(
    fs.existsSync(path.join(root, 'public', profile.previewImage.replace(/^\//, ''))),
    `${profile.activityType} previewImage must exist: ${profile.previewImage}`
  );
}

function assertPageWiring() {
  assert(pageSource.includes('resolveActivityProfile'), 'public partner page must use resolveActivityProfile');
  assert(pageSource.includes('resolvePartnerHeroImage'), 'public partner page must resolve hero and cover image centrally');
  assert(pageSource.includes('activityProfile.previewTitle'), 'public partner page must read previewTitle from activityProfile');
  assert(pageSource.includes('activityProfile.previewSubtitle'), 'public partner page must read previewSubtitle from activityProfile');
  assert(pageSource.includes('activityProfile.previewAlt'), 'public partner page must read previewAlt from activityProfile');
  assert(pageSource.includes('activityProfile.activityBadge'), 'public partner page must render the activity badge');
  assert(!pageSource.includes("'Tour Guide Experience'"), 'public partner page must not hardcode Tour Guide Experience');
  assert(!pageSource.includes('"Tour Guide Experience"'), 'public partner page must not hardcode Tour Guide Experience');
  assert(!pageSource.includes('tour-guide.jpg'), 'public partner page must not hardcode tour-guide image');
  assert(!pageSource.includes('selectedTemplate.name'), 'public partner page preview title must not come from template name');
  assert(!pageSource.includes('getTemplateCoverImage'), 'public partner page preview image must not come from template cover lookup');
}

function assertPriorityOrder() {
  assert.strictEqual(
    resolveActivityType({
      aiDetectedActivityType: 'buggy adventure',
      activityType: 'Tour Guide',
      businessType: 'Boat Tour',
      googlePrimaryType: 'surf_school',
    }),
    'buggy-adventure',
    'valid aiDetectedActivityType must win over activityType, businessType, and enrichment'
  );

  assert.strictEqual(
    resolveActivityType({
      activityType: 'Boat Tour',
      businessType: 'Tour Guide',
      googlePrimaryType: 'surf_school',
    }),
    'boat-tour',
    'valid activityType must win over businessType and enrichment when AI is absent'
  );

  assert.strictEqual(
    resolveActivityType({
      businessType: 'Surf Camp',
      googlePrimaryType: 'restaurant',
    }),
    'surf-camp',
    'valid businessType must win over enrichment when AI and activityType are absent'
  );

  assert.strictEqual(
    resolveActivityType({
      googlePrimaryType: 'restaurant',
      googleTypes: ['food', 'establishment'],
    }),
    'restaurant',
    'saved company enrichment must resolve when AI, activityType, and businessType are absent'
  );

  assert.strictEqual(resolveActivityType({}), 'other', 'empty source must resolve to other');
}

function assertFuerteBuggy() {
  const profile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    activityType: 'OTHER',
    businessType: 'Excursion Company',
    aiDetectedActivityType: 'buggy adventure',
  }, 'es');
  const text = previewText(profile, 'es');

  assert.strictEqual(profile.activityType, 'buggy-adventure', 'Fuerte Experience must resolve to buggy-adventure');
  assert.strictEqual(profile.previewTitle.es, 'Aventura en Buggy');
  assertContainsOne('buggy preview', text, ['buggy', 'aventura']);
  assertContainsOne('buggy preview concept', text, ['volcanic', 'volcanicas', 'dunes', 'dunas', 'off-road', 'todoterreno']);
  assertContainsNone('buggy preview', text, ['tour guide', 'guide', 'guia', 'boat', 'barco', 'catamaran', 'surf']);
  assert(profile.previewImage.includes('buggy-adventure'), 'buggy previewImage must be the buggy cover');
  assertPreviewImageExists(profile);
}

function assertBoatTour() {
  const profile = resolveActivityProfile({ activityType: 'boat-tour' }, 'en');
  const text = previewText(profile, 'en');

  assert.strictEqual(profile.activityType, 'boat-tour');
  assert.strictEqual(profile.previewTitle.en, 'Boat Tour Experience');
  assertContainsOne('boat preview', text, ['boat', 'coast', 'atlantic', 'sailing', 'catamaran']);
  assertContainsNone('boat preview', text, ['buggy', 'tour guide', 'guide defaults']);
  assert(profile.previewImage.includes('boat'), 'boat previewImage must be boat related');
  assertPreviewImageExists(profile);
}

function assertSurfCamp() {
  const profile = resolveActivityProfile({ activityType: 'surf-camp' }, 'en');
  const text = previewText(profile, 'en');

  assert.strictEqual(profile.activityType, 'surf-camp');
  assert.strictEqual(profile.previewTitle.en, 'Surf Camp Experience');
  assertContainsOne('surf preview', text, ['surf', 'waves', 'board']);
  assertContainsNone('surf preview', text, ['photographer', 'photography experience', 'tour guide', 'guided tour']);
  assertPreviewImageExists(profile);
}

function assertOtherFallback() {
  const profile = resolveActivityProfile({}, 'en');
  const text = previewText(profile, 'en');

  assert.strictEqual(profile.activityType, 'other');
  assert.strictEqual(profile.previewTitle.en, 'Your Fuerteventura Experience');
  assertContainsOne('other preview', text, ['fuerteventura', 'island', 'landscape', 'canary']);
  assertContainsNone('other preview', text, ['tour guide', 'guided tour', 'tour-guide']);
  assertPreviewImageExists(profile);
}

function assertLanguageAwarePreview() {
  const es = resolveActivityProfile({ activityType: 'buggy-adventure' }, 'es');
  const en = resolveActivityProfile({ activityType: 'buggy-adventure' }, 'en');

  assert.strictEqual(es.previewTitle.es, 'Aventura en Buggy');
  assert.strictEqual(en.previewTitle.en, 'Buggy Adventure');
  assert.strictEqual(resolveActivityProfile({ activityType: 'boat-tour' }, 'es').previewTitle.es, 'Experiencia en Barco');
  assert.strictEqual(resolveActivityProfile({ activityType: 'surf-camp' }, 'es').previewTitle.es, 'Semana de Surf');
  assert.strictEqual(resolveActivityProfile({ activityType: 'tour-guide' }, 'es').previewTitle.es, 'Ruta Guiada');
  assert.strictEqual(resolveActivityProfile({ activityType: 'photographer' }, 'es').previewTitle.es, 'Sesión Fotográfica');
  assert.strictEqual(resolveActivityProfile({ activityType: 'villa-rental' }, 'es').previewTitle.es, 'Tu Estancia en la Isla');
  assert.strictEqual(resolveActivityProfile({ activityType: 'restaurant' }, 'es').previewTitle.es, 'Sabores de Fuerteventura');
  assert.strictEqual(resolveActivityProfile({ activityType: 'hotel' }, 'es').previewTitle.es, 'Tu Estancia Premium');
  assert.strictEqual(resolveActivityProfile({ activityType: 'other' }, 'es').previewTitle.es, 'Tu Experiencia en Fuerteventura');

  assert(es.previewSubtitle.es && !lower(es.previewSubtitle.es).includes('volcanic roads'), 'Spanish subtitle must be Spanish');
  assert(en.previewSubtitle.en && lower(en.previewSubtitle.en).includes('volcanic roads'), 'English subtitle must be English');
}

assertPageWiring();
assertPriorityOrder();
assertFuerteBuggy();
assertBoatTour();
assertSurfCamp();
assertOtherFallback();
assertLanguageAwarePreview();

console.log('All partner preview activity consistency assertions passed.');
