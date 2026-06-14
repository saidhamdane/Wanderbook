#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const id = process.argv[2];
if (!id) {
  console.error('Usage: npm run inspect:magazine -- <magazineId>');
  process.exit(1);
}

const file = path.join(process.cwd(), 'data', 'magazines.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const doc = data[id];

if (!doc) {
  console.error(`Magazine not found: ${id}`);
  process.exit(1);
}

const textSlotPattern = /(^|[-_])(title|body|text|caption|kicker|line|item|lead|stat|edition|contact|brand|cta|byline|attr|subtitle)([-_]|$)/i;
const allowed = [
  'Wanderbook',
  'Wanderbook Canarias',
  'Magic & Sailing',
  'Holi',
  'Turfuerte',
  'WhatsApp',
  'Website',
  'Fuerteventura',
  'Tenerife',
  'Corralejo',
  'Atlantic',
  'Atlantico',
  'Atlantik',
];
const englishSignals = [
  /\b(in this issue|contents|introduction|discovering the island|feature story|photo gallery|the story|until we return)\b/i,
  /\b(gallery|family|travel edition|island edition|created with|thank you for travelling with)\b/i,
  /\b(open coast|slow days|family light|days well spent|where the dunes meet the atlantic)\b/i,
  /\b(we woke|the island|every journey|a note from the road|until we travel again)\b/i,
  /\b(mornings|morning light|family moments|quiet reflections|endless horizon|the sea|journey|memories)\b/i,
  /\b(the|and|with|your|journey|memory|memories|light|wind|sea|story)\b/i,
];

function stripAllowed(value) {
  return allowed.reduce((text, term) => text.replaceAll(term, ''), value);
}

function isLikelyEnglish(value) {
  if (doc.language === 'en') return false;
  const text = stripAllowed(String(value || ''));
  if (!/[A-Za-z]/.test(text)) return false;
  return englishSignals.some((pattern) => pattern.test(text));
}

console.log(`magazine id: ${doc.id}`);
console.log(`language: ${doc.language || 'n/a'}`);
console.log(`style: ${doc.style || 'n/a'}`);
console.log(`copySource: ${doc.copySource || 'n/a'}`);
console.log(`copyProvider: ${doc.copyProvider || 'n/a'}`);
if (doc.copyFallbackReason) console.log(`copyFallbackReason: ${doc.copyFallbackReason}`);

let warnings = 0;
for (const [pageIndex, page] of (doc.pages || []).entries()) {
  console.log(`--- page ${pageIndex + 1}: ${page.pageId} (${page.layout})`);
  const entries = Object.entries(page.slots || {})
    .filter(([key, value]) => typeof value === 'string' && value.trim() && textSlotPattern.test(key));
  for (const [key, value] of entries) {
    console.log(`${key}: ${value}`);
    if (isLikelyEnglish(value)) {
      warnings += 1;
      console.log(`WARNING possible English text in ${doc.language}: page ${pageIndex + 1} ${key}`);
    }
  }
}

console.log(`warnings: ${warnings}`);
if (warnings > 0) process.exitCode = 2;
