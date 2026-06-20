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
  getActivityLabel,
} = loadTsModule('lib/magazine/resolveActivityProfile.ts');

const routeSource = fs.readFileSync(path.join(root, 'app/api/generate/route.ts'), 'utf8');
const generatorSource = fs.readFileSync(path.join(root, 'lib/magazine/generate-magazine.ts'), 'utf8');
const copySource = fs.readFileSync(path.join(root, 'lib/magazine/generate-copy.ts'), 'utf8');
const companyLayoutSource = fs.readFileSync(path.join(root, 'components/layouts/CompanyPageLayout.tsx'), 'utf8');
const cardSource = fs.readFileSync(path.join(root, 'components/layouts/PartnerBackBusinessCard.tsx'), 'utf8');
const resolveSource = fs.readFileSync(path.join(root, 'lib/magazine/resolveActivityProfile.ts'), 'utf8');
const partnerActivitySource = fs.readFileSync(path.join(root, 'lib/partner-activity.ts'), 'utf8');
const templateRecsSource = fs.readFileSync(path.join(root, 'lib/magazine/template-recommendations.ts'), 'utf8');

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function profileText(profile) {
  return normalize([
    profile.activityType,
    profile.activityLabel,
    Object.values(profile.activityLabelsByLanguage || {}).join(' '),
    Object.values(profile.pagePlan || {}).flat().join(' '),
    Object.values(profile.ctaLabels || {}).join(' '),
    Object.values(profile.localTipsTopics || {}).flat().join(' '),
    profile.copyTone,
  ].join(' '));
}

function assertContainsAll(name, text, terms) {
  for (const term of terms) {
    assert(text.includes(normalize(term)), `${name} should contain "${term}"`);
  }
}

function assertContainsOne(name, text, terms) {
  assert(terms.some((term) => text.includes(normalize(term))), `${name} should contain one of: ${terms.join(', ')}`);
}

function assertContainsNone(name, text, terms) {
  for (const term of terms) {
    assert(!text.includes(normalize(term)), `${name} should not contain "${term}"`);
  }
}

function assertWiring() {
  assert(routeSource.includes('resolveActivityProfile(partnerRecord, language)'), 'generate route must resolve one activity profile before generation');
  assert(routeSource.includes('activityProfile,') && routeSource.includes('partnerId: partnerRecord?.id'), 'generate route must pass activity profile and partner id');
  assert(generatorSource.includes('activityProfile?.allowedImageKeywords[0]'), 'generator must use activity image keywords for stock fallback');
  assert(generatorSource.includes('activityType: activityProfile?.activityType'), 'generator must pass activity type to copy generation');
  assert(generatorSource.includes('generationAudit'), 'generator must attach generation audit metadata');
  assert(copySource.includes('Every string value MUST be in'), 'copy prompt must strictly enforce language');
  assert(copySource.includes('prohibitedImageKeywords'), 'copy prompt must include prohibited activity terms');
  assert(companyLayoutSource.includes('getActivityLabel') && companyLayoutSource.includes('partner-resolved-activity-type'), 'company page must resolve translated activity labels');
  assert(cardSource.includes('realContactValue'), 'partner card must sanitize demo contact values');
  // CTAs are the single source of truth in resolveActivityProfile — not duplicated in cardSource
  assert(resolveSource.includes('Book your next buggy adventure'), 'resolveActivityProfile must define buggy CTA as single source of truth');
  assert(!cardSource.includes("'Honeymoon'"), 'PartnerBackBusinessCard must not contain Honeymoon CTA');
  // No duplicate hardcoded maps outside resolveActivityProfile
  assert(!partnerActivitySource.includes('ACTIVITY_TEMPLATE') && !partnerActivitySource.includes('ACTIVITY_CTA') && !partnerActivitySource.includes('ACTIVITY_TONE'), 'partner-activity.ts must not have duplicate hardcoded maps');
  assert(!templateRecsSource.includes("normalized.includes('boat')") && templateRecsSource.includes('resolveActivityProfile'), 'template-recommendations must derive routing from resolveActivityProfile');
}

function testSurfCampSpanish() {
  const profile = resolveActivityProfile({
    businessName: 'Nomad Surf Camp',
    activityType: 'Surf Camp',
  }, 'es');
  const text = profileText(profile);

  assert.strictEqual(profile.activityType, 'surf-camp', 'surf camp must resolve to surf-camp');
  assert.strictEqual(profile.templateId, 'wanderbook-editorial', 'surf camp must use wanderbook-editorial template');
  assert(!profile.ctaLabels.es.includes('Book'), 'Spanish surf CTA must not contain English "Book"');
  assert(profile.ctaLabels.es.length > 0, 'Spanish surf CTA must not be empty');
  assertContainsOne('surf-camp Spanish profile', text, ['surf', 'ola', 'escuela']);
  assertContainsNone('surf-camp Spanish profile', text, ['photographer', 'fotografo', 'catamaran', 'buggy', 'dolphin', 'delfin', 'barco boat']);
  assert(!text.includes('placeholder'), 'surf-camp Spanish profile must not contain placeholder contact text');
}

function testBuggySpanish() {
  const profile = resolveActivityProfile({
    businessName: 'Fuerte Experience',
    activityType: 'OTHER',
    businessType: 'Excursion Company',
    aiDetectedActivityType: 'buggy adventure',
  }, 'es');
  const text = profileText(profile);

  assert.strictEqual(profile.activityType, 'buggy-adventure');
  assert.strictEqual(profile.templateId, 'buggy-adventure-experience');
  assert.strictEqual(getActivityLabel('OTHER', 'es'), 'Experiencia en Fuerteventura');
  assert.strictEqual(getActivityLabel(profile.activityType, 'es'), 'Aventura en Buggy');
  assertContainsOne('buggy Spanish profile', text, ['buggy']);
  assertContainsOne('buggy Spanish profile', text, ['aventura']);
  assertContainsOne('buggy Spanish profile', text, ['fuerteventura']);
  assertContainsNone('buggy Spanish profile', text, ['sailing', 'boat', 'catamaran', 'surf', 'dolphin']);
  assert(!profile.ctaLabels.es.includes('Book'), 'Spanish buggy CTA must not contain English');
  assert(!text.includes('other'), 'buggy-adventure profile must not display raw "OTHER"');
  assert(cardSource.includes("normalized.includes('123456789')"), 'card source must reject fake WhatsApp numbers');
}

function testBoatSpanish() {
  const profile = resolveActivityProfile({
    businessName: 'Magic Sailing',
    activityType: 'Boat Tour',
    googleTypes: ['tourist_attraction', 'boat_tour_agency'],
  }, 'es');
  const text = profileText(profile);

  assert.strictEqual(profile.activityType, 'boat-tour');
  assert.strictEqual(profile.templateId, 'boat-trip-experience');
  assertContainsAll('boat Spanish profile', text, ['mar', 'barco', 'costa']);
  assertContainsNone('boat Spanish profile', text, ['buggy', 'off-road']);
}

function testTourGuideSpanish() {
  const profile = resolveActivityProfile({
    businessName: 'Fuerteventura Local Routes',
    activityType: 'Tour Guide',
    googleTypes: ['travel_agency'],
  }, 'es');
  const text = profileText(profile);

  assert.strictEqual(profile.activityType, 'tour-guide');
  assert.strictEqual(profile.templateId, 'tour-guide-experience');
  assertContainsAll('tour guide Spanish profile', text, ['guia', 'isla', 'ruta']);
  assertContainsNone('tour guide Spanish profile', text, ['catamaran', 'buggy']);
}

function testArchitecture() {
  // Removed google files must not exist
  assert(!fs.existsSync(path.join(root, 'lib/google/places.ts')), 'lib/google/places.ts must be removed');
  assert(!fs.existsSync(path.join(root, 'app/api/partner/google-photo')), 'google-photo API route must be removed');

  // No live imports of removed files in source
  const filesToCheck = [
    'lib/partner-activity.ts',
    'lib/magazine/template-recommendations.ts',
    'lib/magazine/generate-magazine.ts',
    'lib/magazine/generate-copy.ts',
    'app/api/generate/route.ts',
    'components/layouts/PartnerBackBusinessCard.tsx',
  ];
  for (const f of filesToCheck) {
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    assert(!src.includes('lib/google/places'), `${f} must not import lib/google/places`);
    assert(!src.includes('google-photo'), `${f} must not reference google-photo route`);
    assert(!src.includes('GOOGLE_PLACES_API_KEY'), `${f} must not reference GOOGLE_PLACES_API_KEY`);
  }

  // Only canonical SerpApi migration exists — no stale google_place_id migration
  const migrationsDir = path.join(root, 'supabase/migrations');
  const migrationFiles = fs.readdirSync(migrationsDir);
  assert(!migrationFiles.includes('20260619_ai_magazine_playbooks_company_enrichment.sql'), 'stale google_place_id migration must be removed');
  assert(migrationFiles.includes('20260619_serpapi_company_magazine_playbooks.sql'), 'canonical SerpApi migration must exist');
  const serpMigration = fs.readFileSync(path.join(migrationsDir, '20260619_serpapi_company_magazine_playbooks.sql'), 'utf8');
  assert(!serpMigration.includes('google_place_id'), 'canonical migration must not contain google_place_id');
  assert(serpMigration.includes('serpapi_place_id'), 'canonical migration must include serpapi_place_id');

  // No Honeymoon CTA anywhere in source
  for (const f of filesToCheck) {
    const src = fs.readFileSync(path.join(root, f), 'utf8');
    assert(!src.includes("'Honeymoon'"), `${f} must not contain Honeymoon CTA`);
  }

  // Fake demo contact protection in card
  assert(cardSource.includes("normalized.includes('demo')"), 'card must block demo contact values');
  assert(cardSource.includes("normalized.includes('placeholder')"), 'card must block placeholder contact values');
}

assertWiring();
testSurfCampSpanish();
testBuggySpanish();
testBoatSpanish();
testTourGuideSpanish();
testArchitecture();

console.log('All magazine activity consistency assertions passed.');
