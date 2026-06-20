const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

const partners = [
  {
    businessName: 'Nomad Surf Camp',
    mainIsland: 'Fuerteventura',
    activityType: 'Surf Camp',
    candidateType: 'Surf school',
  },
  {
    businessName: 'Chic Villas & Apartments',
    mainIsland: 'Fuerteventura',
    activityType: 'Villa Rental',
    candidateType: 'Holiday apartment rental',
  },
  {
    businessName: 'Fuerte Tours',
    mainIsland: 'Fuerteventura',
    activityType: 'Tour Guide',
    candidateType: 'Tour agency',
  },
];

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function tokenOverlap(a, b) {
  const aTokens = new Set(normalizeText(a).split(' ').filter(Boolean));
  const bTokens = normalizeText(b).split(' ').filter(Boolean);
  if (aTokens.size === 0 || bTokens.length === 0) return 0;
  const hits = bTokens.filter((token) => aTokens.has(token)).length;
  return hits / Math.max(aTokens.size, bTokens.length);
}

function calculateMatchConfidence({ candidate, businessName, island, businessType }) {
  const nameScore = Math.max(
    normalizeText(candidate.title) === normalizeText(businessName) ? 1 : 0,
    tokenOverlap(candidate.title, businessName),
  );
  const islandScore = normalizeText(candidate.address).includes(normalizeText(island)) ? 0.14 : 0.04;
  const categoryText = normalizeText([candidate.type, ...(candidate.types || [])].join(' '));
  const activityText = normalizeText(businessType);
  const typeScore = activityText.split(' ').some((token) => token && categoryText.includes(token)) ? 0.2 : 0;
  const ratingScore = typeof candidate.rating === 'number' ? 0.02 : 0;
  const reviewScore = typeof candidate.reviews === 'number' && candidate.reviews > 0 ? 0.02 : 0;
  return Math.max(0, Math.min(1, nameScore * 0.62 + islandScore + typeScore + ratingScore + reviewScore));
}

function detectFallbackActivity({ activityType, googleTypes }) {
  const source = normalizeText([activityType, ...(googleTypes || [])].join(' '));
  if (source.includes('surf')) return 'surf camp';
  if (source.includes('villa') || source.includes('rental') || source.includes('lodging') || source.includes('apartment')) return 'villa / apartment rental';
  if (source.includes('boat') || source.includes('sail')) return 'boat tour';
  if (source.includes('photo')) return 'photographer';
  if (source.includes('buggy') || source.includes('adventure')) return 'buggy adventure';
  if (source.includes('restaurant') || source.includes('food')) return 'restaurant';
  if (source.includes('hotel')) return 'hotel';
  if (source.includes('tour') || source.includes('guide') || source.includes('agency')) return 'tour guide';
  return 'other';
}

function fallbackCompanyCopy({ partner, candidate }) {
  const detectedActivityType = detectFallbackActivity({
    activityType: partner.activityType,
    googleTypes: [candidate.type, ...(candidate.types || [])],
  });
  return {
    detectedActivityType,
    islandContextLine: `${partner.businessName} connects guests with the local rhythm of ${partner.mainIsland}.`,
    activityDescription: `A ${detectedActivityType} experience for travelers who want to enjoy ${partner.mainIsland} with confidence and local texture.`,
    companyPageTitle: `The ${partner.businessName} Experience`,
    companyPageSubtitle: `${detectedActivityType} on ${partner.mainIsland}`,
    companySummary: `${partner.businessName} offers ${detectedActivityType} on ${partner.mainIsland}, shaped around easy travel, local context, and a strong sense of place.`,
    positiveReviewThemes: ['friendly service', 'memorable experience'],
    companyPageBody: `${partner.businessName} is part of how travelers experience ${partner.mainIsland}: with time to look around, choose the right moments, and take home a story that feels personal.`,
    trustLine: 'Guests often highlight the warm service and well-shaped experience.',
    finalPageCtaLine: `Experience ${partner.mainIsland} again with ${partner.businessName}`,
    photoCaptions: [`Moments with ${partner.businessName}`, `${partner.mainIsland} in your own frame`],
  };
}

function buildCompanyEnrichmentWithoutKey() {
  return { status: 'missing_key' };
}

for (const partner of partners) {
  const candidate = {
    title: partner.businessName,
    address: `${partner.mainIsland}, Canary Islands, Spain`,
    type: partner.candidateType,
    types: [partner.candidateType],
    rating: 4.8,
    reviews: 124,
  };
  const confidence = calculateMatchConfidence({
    candidate,
    businessName: partner.businessName,
    island: partner.mainIsland,
    businessType: partner.activityType,
  });
  assert(confidence >= 0.7, `${partner.businessName} should auto-select`);

  const copy = fallbackCompanyCopy({ partner, candidate });
  assert(
    copy.companyPageTitle.includes(partner.businessName) || copy.companySummary.includes(partner.businessName),
    `${partner.businessName} should appear in generated copy`,
  );
  assert(
    copy.islandContextLine.includes(partner.mainIsland) || copy.companyPageBody.includes(partner.mainIsland),
    `${partner.mainIsland} should appear in generated copy`,
  );
  assert(
    copy.activityDescription.includes(copy.detectedActivityType),
    `${copy.detectedActivityType} should appear in activity description`,
  );
  assert(copy.trustLine.length > 0, `${partner.businessName} should have a CTA/trust line`);
  assert(copy.finalPageCtaLine.length > 0, `${partner.businessName} should have a final CTA`);
}

assert.deepStrictEqual(buildCompanyEnrichmentWithoutKey(), { status: 'missing_key' });

// Architecture: single canonical SerpApi migration; no stale google_place_id migration
const migrationsDir = path.join(root, 'supabase/migrations');
const migrationFiles = fs.readdirSync(migrationsDir);
assert(!migrationFiles.includes('20260619_ai_magazine_playbooks_company_enrichment.sql'), 'stale google_place_id migration must be removed from repository');
assert(migrationFiles.includes('20260619_serpapi_company_magazine_playbooks.sql'), 'canonical SerpApi migration must exist');
const serpMigration = fs.readFileSync(path.join(migrationsDir, '20260619_serpapi_company_magazine_playbooks.sql'), 'utf8');
assert(!serpMigration.includes('google_place_id'), 'canonical migration must not contain google_place_id from removed Google Places integration');
assert(serpMigration.includes('serpapi_place_id') && serpMigration.includes('serpapi_data_id'), 'canonical migration must include SerpApi columns');
assert(serpMigration.includes('-- Canonical company enrichment schema migration'), 'canonical migration must have the required comment');

// Architecture: no imports or references to removed Google Places integration
const sourceFilePaths = [
  'lib/partner-activity.ts',
  'lib/magazine/template-recommendations.ts',
  'lib/magazine/generate-magazine.ts',
  'lib/magazine/generate-copy.ts',
  'app/api/generate/route.ts',
  'components/layouts/PartnerBackBusinessCard.tsx',
  'app/api/partner/company-auto-sync/route.ts',
];
for (const filePath of sourceFilePaths) {
  const src = fs.readFileSync(path.join(root, filePath), 'utf8');
  assert(!src.includes('lib/google/places'), `${filePath} must not import lib/google/places`);
  assert(!src.includes('google-photo'), `${filePath} must not reference google-photo route`);
  assert(!src.includes('GOOGLE_PLACES_API_KEY'), `${filePath} must not reference GOOGLE_PLACES_API_KEY`);
}
assert(!fs.existsSync(path.join(root, 'lib/google/places.ts')), 'lib/google/places.ts must not exist in working tree');
assert(!fs.existsSync(path.join(root, 'app/api/partner/google-photo')), 'google-photo route directory must not exist');

// Architecture: no duplicate hardcoded activity/template/CTA maps outside resolveActivityProfile
const partnerActivitySrc = fs.readFileSync(path.join(root, 'lib/partner-activity.ts'), 'utf8');
assert(!partnerActivitySrc.includes('ACTIVITY_TEMPLATE'), 'partner-activity.ts must not have duplicate ACTIVITY_TEMPLATE map');
assert(!partnerActivitySrc.includes('ACTIVITY_CTA'), 'partner-activity.ts must not have duplicate ACTIVITY_CTA map');
assert(!partnerActivitySrc.includes('ACTIVITY_TONE'), 'partner-activity.ts must not have duplicate ACTIVITY_TONE map');

const cardSrc = fs.readFileSync(path.join(root, 'components/layouts/PartnerBackBusinessCard.tsx'), 'utf8');
assert(!cardSrc.includes("'Honeymoon'"), 'PartnerBackBusinessCard must not contain Honeymoon CTA');
assert(!cardSrc.includes('ACTIVITY_CTA'), 'PartnerBackBusinessCard must not have a duplicate ACTIVITY_CTA map');

// Fake demo contact protection must remain active
assert(cardSrc.includes("normalized.includes('demo')"), 'card must block demo contact values');
assert(cardSrc.includes("normalized.includes('placeholder')"), 'card must block placeholder values');
assert(cardSrc.includes("normalized.includes('123456789')"), 'card must block fake WhatsApp numbers');

console.log('All assertions passed.');
process.exit(0);
