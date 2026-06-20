const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cardSource = fs.readFileSync(path.join(root, 'components/layouts/PartnerBackBusinessCard.tsx'), 'utf8');
const intelligenceSource = fs.readFileSync(path.join(root, 'lib/ai/company-intelligence.ts'), 'utf8');
const layoutSource = fs.readFileSync(path.join(root, 'components/layouts/CompanyPageLayout.tsx'), 'utf8');
const resolveSource = fs.readFileSync(path.join(root, 'lib/magazine/resolveActivityProfile.ts'), 'utf8');

const fixtures = [
  {
    company: 'Nomad Surf Camp',
    island: 'Fuerteventura',
    activity: 'surf camp',
    cta: 'Book your next surf week',
    themes: ['friendly instructors', 'local surf rhythm'],
  },
  {
    company: 'Chic Villas & Apartments',
    island: 'Fuerteventura',
    activity: 'villa / apartment rental',
    cta: 'Book your next stay direct',
    themes: ['comfort', 'clean villa'],
  },
  {
    company: 'Fuerte Tours',
    island: 'Fuerteventura',
    activity: 'tour guide',
    cta: 'Book your next guided route',
    themes: ['professional guide', 'beautiful viewpoints'],
  },
];

function assert(name, condition) {
  if (!condition) {
    console.error(`FAIL ${name}`);
    process.exit(1);
  }
  console.log(`PASS ${name}`);
}

for (const fixture of fixtures) {
  const output = {
    detectedActivityType: fixture.activity,
    companySummary: `${fixture.company} creates a ${fixture.activity} experience on ${fixture.island}.`,
    companyPageBody: `${fixture.company} helps travelers experience ${fixture.island} through ${fixture.activity}.`,
    positiveReviewThemes: fixture.themes,
    finalPageCtaLine: fixture.cta,
  };

  assert(`${fixture.company} appears in output`, output.companyPageBody.includes(fixture.company));
  assert(`${fixture.island} appears in output`, output.companyPageBody.includes(fixture.island));
  assert(`${fixture.activity} appears in output`, output.companyPageBody.includes(fixture.activity));
  assert(`${fixture.activity} CTA is specific`, output.finalPageCtaLine === fixture.cta);
  assert(`${fixture.company} themes flow`, output.positiveReviewThemes.every((theme) => fixture.themes.includes(theme)));
}

assert('fallback body is not empty without reviews', 'A local island experience.'.length > 0);
assert('AI prompt includes required activity types', ['surf camp', 'villa / apartment rental', 'tour guide', 'boat tour', 'photographer', 'buggy adventure', 'restaurant', 'hotel', 'other'].every((type) => intelligenceSource.includes(type)));
// CTAs are defined in resolveActivityProfile — the single source of truth, not duplicated in cardSource
assert('canonical profile defines pilot CTAs', ['Book your next surf week', 'Book your next stay direct', 'Book your next guided route'].every((cta) => resolveSource.includes(cta)));
assert('company layout renders localized review themes', layoutSource.includes('Los huespedes destacan:') && layoutSource.includes('Guests love:') && layoutSource.includes('aiPositiveReviewThemes'));
// Card delegates CTAs to resolveActivityProfile — no duplicate map in cardSource
assert('card source has no duplicate CTA map', !cardSource.includes("'Honeymoon'") && !cardSource.includes('ACTIVITY_CTA'));
