#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function indexOfOrFail(source, needle, label) {
  const index = source.indexOf(needle);
  assert(index >= 0, `${label} not found`);
  return index;
}

const dashboardSource = read('app/partner/dashboard/PartnerDashboardClient.tsx');
const generateRouteSource = read('app/api/generate/route.ts');

assert(
  !dashboardSource.includes('Crear demo de la empresa'),
  'partner dashboard must not render the internal demo section title'
);
assert(
  !dashboardSource.includes('createCompanyDemo') &&
    !dashboardSource.includes('demoPhotos') &&
    !dashboardSource.includes("fd.append('generationMode', 'demo')") &&
    !dashboardSource.includes('mode=demo'),
  'partner dashboard must not contain demo-only state, handlers, uploads, or navigation'
);
pass('partner dashboard does not expose demo creation UI');

assert(
  generateRouteSource.includes("import { getAdminSession } from '@/lib/admin-auth';"),
  'generate route must import the server-only admin session helper'
);
assert(
  generateRouteSource.includes("body.generationMode === 'demo' || body.mode === 'demo'"),
  'JSON generation requests must treat mode=demo as demo generation'
);
assert(
  generateRouteSource.includes("form.get('generationMode') || form.get('mode')"),
  'multipart generation requests must treat mode=demo as demo generation'
);

const guardPattern =
  /if\s*\(\s*generationMode\s*===\s*['"]demo['"]\s*&&\s*!\s*getAdminSession\s*\(\s*\)\s*\)\s*{[\s\S]*?status:\s*403/;
assert(
  guardPattern.test(generateRouteSource),
  'demo generation must return 403 unless a valid admin session is present'
);

const normalizeIndex = indexOfOrFail(generateRouteSource, 'language = normalizeLanguage(language);', 'language normalization');
const guardIndex = generateRouteSource.search(guardPattern);
const requiredFieldsIndex = indexOfOrFail(generateRouteSource, 'if (!templateId || !destination)', 'required-field validation');
const partnerLookupIndex = indexOfOrFail(generateRouteSource, 'let partnerRecord = partnerSlug', 'partner lookup');
const uploadIndex = indexOfOrFail(generateRouteSource, 'saveUploadedFiles(photoFiles)', 'photo upload');
const generationIndex = indexOfOrFail(generateRouteSource, 'generateMagazine({', 'magazine generation');

assert(
  normalizeIndex < guardIndex &&
    guardIndex < requiredFieldsIndex &&
    guardIndex < partnerLookupIndex &&
    guardIndex < uploadIndex &&
    guardIndex < generationIndex,
  'demo admin guard must run before validation side effects, database lookup, uploads, and generation'
);
pass('normal partner and anonymous demo requests are rejected before side effects');

assert(
  !generateRouteSource.includes("if (generationMode === 'demo')") &&
    generateRouteSource.includes("generationMode === 'demo' && !getAdminSession()"),
  'admin demo generation must remain permitted by guarding only missing admin sessions'
);
assert(
  generateRouteSource.includes("doc.isPubliclyShareable = generationMode !== 'demo'") &&
    generateRouteSource.includes("magazineId: generationMode === 'demo' ? undefined : doc.id"),
  'demo magazines must remain private and detached from real partner magazine counts'
);
pass('authenticated admin demo generation remains permitted and private');

console.log('All demo access-control assertions passed.');
