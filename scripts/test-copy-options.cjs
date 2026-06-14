#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

require('sucrase/register');

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function resolveWithRepoAlias(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    return originalResolve.call(this, path.join(process.cwd(), request.slice(2)), parent, isMain, options);
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    let value = rawValue.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function slotValue(doc, ids) {
  for (const page of doc.pages || []) {
    for (const id of ids) {
      const value = page.slots?.[id];
      if (typeof value === 'string' && value.trim()) return value.trim();
    }
  }
  return '';
}

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function hasSpanishSignals(value) {
  return /\b(el|la|los|las|un|una|con|para|día|mar|viento|aventura|Atlántico|Fuerteventura)\b/i.test(value);
}

async function main() {
  loadLocalEnv();
  const { generateMagazine } = require('../lib/magazine/generate-magazine.ts');

  const cases = [
    {
      name: 'Magic & Sailing',
      templateId: 'boat-trip-experience',
      destination: 'Fuerteventura',
      travelers: 'Magic & Sailing guests',
      businessName: 'Magic & Sailing',
      businessType: 'Sailing / Boat Trip',
      language: 'en',
      style: 'Warm & Personal',
    },
    {
      name: 'Magic & Sailing',
      templateId: 'boat-trip-experience',
      destination: 'Fuerteventura',
      travelers: 'Invitados de Magic & Sailing',
      businessName: 'Magic & Sailing',
      businessType: 'Sailing / Boat Trip',
      language: 'es',
      style: 'Warm & Personal',
    },
    {
      name: 'Magic & Sailing',
      templateId: 'boat-trip-experience',
      destination: 'Fuerteventura',
      travelers: 'Magic & Sailing guests',
      businessName: 'Magic & Sailing',
      businessType: 'Sailing / Boat Trip',
      language: 'en',
      style: 'Epic & Bold',
    },
    {
      name: 'Holi',
      templateId: 'holiday-rental-memory',
      destination: 'Tenerife',
      travelers: 'Holi guests',
      businessName: 'Holi',
      businessType: 'Holiday Rental',
      language: 'de',
      style: 'Calm & Minimal',
    },
    {
      name: 'Turfuerte',
      templateId: 'buggy-adventure-experience',
      destination: 'Fuerteventura',
      travelers: 'Ospiti Turfuerte',
      businessName: 'Turfuerte',
      businessType: 'Excursion Company',
      language: 'it',
      style: 'Epic & Bold',
    },
  ];

  const results = [];
  for (const testCase of cases) {
    const doc = await generateMagazine({
      templateId: testCase.templateId,
      destination: testCase.destination,
      travelers: testCase.travelers,
      familyName: testCase.travelers,
      style: testCase.style,
      language: testCase.language,
      notes: `${testCase.name} copy option verification.`,
      partnerMode: true,
      businessName: testCase.businessName,
      businessType: testCase.businessType,
      clientName: testCase.travelers,
      userPhotos: [],
      useStockFallback: false,
    });
    const intro = slotValue(doc, ['intro-body', 'introBody', 'welcomeBody', 'body']);
    const quote = slotValue(doc, ['quote-text', 'quoteText', 'quote', 'quoteBody']);
    const result = { ...testCase, copySource: doc.copySource, intro, quote };
    results.push(result);

    console.log('---');
    console.log(`case: ${testCase.name}`);
    console.log(`language: ${testCase.language}`);
    console.log(`style: ${testCase.style}`);
    console.log(`copySource: ${doc.copySource}`);
    if (doc.copyFallbackReason) console.log(`copyFallbackReason: ${doc.copyFallbackReason}`);
    console.log(`intro (${wordCount(intro)} words): ${intro}`);
    console.log(`quote (${wordCount(quote)} words): ${quote}`);
  }

  const warmEn = results.find((r) => r.name === 'Magic & Sailing' && r.language === 'en' && r.style === 'Warm & Personal');
  const warmEs = results.find((r) => r.name === 'Magic & Sailing' && r.language === 'es');
  const epicEn = results.find((r) => r.name === 'Magic & Sailing' && r.language === 'en' && r.style === 'Epic & Bold');
  const calmDe = results.find((r) => r.name === 'Holi');

  console.log('---');
  console.log(`spanishSignals: ${warmEs && hasSpanishSignals(`${warmEs.intro} ${warmEs.quote}`) ? 'yes' : 'no'}`);
  console.log(`warmVsEpicIdentical: ${warmEn && epicEn && warmEn.intro === epicEn.intro && warmEn.quote === epicEn.quote ? 'yes' : 'no'}`);
  console.log(`calmIntroWordCount: ${calmDe ? wordCount(calmDe.intro) : 0}`);
  console.log('test:copy-options complete');
}

main().catch((error) => {
  const message = String(error?.message || error).replace(/sk-[^\s),]+/g, (match) => `${match.slice(0, 7)}[redacted]`);
  console.error('test:copy-options failed:', message);
  process.exitCode = 1;
});
