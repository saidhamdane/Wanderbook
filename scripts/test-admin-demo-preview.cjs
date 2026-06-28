#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

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
  function localRequire(request) {
    return require(request);
  }
  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
  fn(localRequire, module, module.exports, filename, path.dirname(filename));
  return module.exports;
}

function loadRouteWithStubs(options = {}) {
  const filename = path.join(root, 'app/api/private/demo-preview/route.ts');
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
    },
  }).outputText;

  const saved = [];
  const profile = {
    activityType: 'buggy-adventure',
    activityLabel: 'Buggy Adventure',
    templateId: 'buggy-adventure-experience',
    copyTone: 'active',
    demoAssets: { company: ['/template-covers/buggy-adventure.jpg'] },
  };
  const module = { exports: {} };

  function localRequire(request) {
    if (request === 'crypto') return require('crypto');
    if (request === 'next/server') {
      return {
        NextResponse: {
          json(body, init = {}) {
            return { body, status: init.status || 200 };
          },
        },
      };
    }
    if (request === '@/lib/admin-auth') {
      return { getAdminSession: () => Boolean(options.adminSession) };
    }
    if (request === '@/lib/magazine/generate-magazine') {
      return {
        generateMagazine: async (input) => ({
          id: 'mag_stub',
          templateId: input.templateId,
          destination: input.destination,
          familyName: input.familyName,
          createdAt: input.createdAt,
          generatedAt: input.createdAt,
          language: input.language,
          generationMode: input.generationMode,
          isPubliclyShareable: true,
          pages: [{ pageId: 'back', layout: 'are-back', slots: {} }],
          template: { id: input.templateId, palette: {}, fonts: {}, pages: [] },
          generationAudit: {
            resolvedActivityType: input.activityProfile.activityType,
            selectedTemplate: input.templateId,
            language: input.language,
            copySource: 'defaults',
            imageSourceSummary: '',
            generatedAt: input.createdAt,
          },
          imageAudit: {
            mode: input.generationMode,
            resolvedActivityType: input.activityProfile.activityType,
            selectedImages: [],
            rejectedImages: [],
          },
        }),
        insertCompanyPageIfNeeded: (doc) => {
          doc.pages.push({ pageId: 'company-page-partner', layout: 'company-page', slots: {} });
          return doc;
        },
      };
    }
    if (request === '@/lib/magazine/resolveActivityProfile') {
      return {
        resolveActivityProfile: (source) => ({
          ...profile,
          activityType: source.businessType === 'buggy-adventure' ? 'buggy-adventure' : 'other',
        }),
      };
    }
    if (request === '@/lib/magazine/store') {
      return {
        loadMagazine: async () => null,
        saveMagazine: async (doc) => saved.push(doc),
      };
    }
    if (request === '@/lib/magazine/admin-demo-preview') {
      return loadTsModule('lib/magazine/admin-demo-preview.ts');
    }
    return require(request);
  }

  const fn = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
  fn(localRequire, module, module.exports, filename, path.dirname(filename));
  return { exports: module.exports, saved };
}

async function run() {
  const leadsSource = read('app/private/leads/LeadsClient.tsx');
  const routeSource = read('app/api/private/demo-preview/route.ts');
  const privateDemoPageSource = read('app/private/demo/[id]/page.tsx');
  const previewPageSource = read('app/preview/[id]/page.tsx');
  const magazinePageSource = read('app/magazine/[id]/page.tsx');
  const screenshotRouteSource = read('app/api/page-screenshot/[id]/[page]/route.ts');
  const { activityInputForLead } = loadTsModule('lib/magazine/admin-demo-preview.ts');

  assert(leadsSource.includes('Preview demo'), 'CRM must render the renamed Preview demo action');
  assert(!leadsSource.includes('Create demo partner'), 'old Create demo partner label must be removed');
  assert(leadsSource.includes("fetch('/api/private/demo-preview'"), 'Preview demo must call the private demo endpoint');
  assert(leadsSource.includes("window.open(`/private/demo/${payload.id}`"), 'Preview demo must open the private demo route');
  assert(leadsSource.includes('Create real partner account'), 'real account action must remain available');
  assert(leadsSource.includes('This creates a real partner account. Continue?'), 'real account action must confirm first');
  assert(leadsSource.includes('window.open(demoSignupHref(lead)'), 'real account action must still open the prefixed signup page');
  pass('CRM preview and real account actions are separated');

  assert(routeSource.includes("import { getAdminSession } from '@/lib/admin-auth';"), 'demo route must use admin session auth');
  assert(!routeSource.includes('@/lib/db/partners'), 'demo route must not import partner database writes');
  assert(!routeSource.includes('/api/partner/signup'), 'demo route must not call signup');
  assert(!routeSource.includes('trackPartnerEvent'), 'demo route must not write partner analytics or billing events');
  assert(routeSource.includes("doc.generationMode = 'demo'"), 'demo route must mark generationMode as demo');
  assert(routeSource.includes('doc.isAdminDemo = true'), 'demo route must mark admin demos');
  assert(routeSource.includes('doc.isPubliclyShareable = false'), 'demo route must make demos non-shareable');
  assert(routeSource.includes("doc.source = 'admin_demo'"), 'demo route must identify admin demo source');
  pass('demo route is private and does not create real partners');

  const unauthorized = loadRouteWithStubs({ adminSession: false });
  const unauthorizedResponse = await unauthorized.exports.POST({ json: async () => ({}) });
  assert.equal(unauthorizedResponse.status, 401, 'unauthorized POST must fail');
  assert.equal(unauthorized.saved.length, 0, 'unauthorized POST must not save a magazine');
  pass('unauthorized requests fail before side effects');

  const authorized = loadRouteWithStubs({ adminSession: true });
  assert.equal(
    activityInputForLead({
      business: 'Fuerte Quad Tours',
      type: 'Quad / Buggy lead',
      location: 'Fuerteventura',
    }),
    'buggy-adventure',
    'Quad / Buggy lead must map to buggy-adventure'
  );
  assert.equal(
    activityInputForLead({
      business: 'Kite Surf School',
      type: 'Surf / Kite lead',
      location: 'Fuerteventura',
    }),
    'surf-school',
    'Surf / Kite lead must map to surf-school'
  );

  const response = await authorized.exports.POST({
    json: async () => ({
      business: 'Fuerte Quad Tours',
      type: 'Quad / Buggy lead',
      location: 'Fuerteventura',
      phone: '+34 600 000 000',
      rating: 4.9,
      reviews: 120,
      website: 'https://example.com',
    }),
  });
  assert.equal(response.status, 200, 'authorized POST must succeed');
  assert.match(response.body.id, /^admag_[a-f0-9]{16}$/, 'authorized POST must return a private admin demo id');
  assert.equal(authorized.saved.length, 1, 'authorized POST must save one demo magazine');
  const doc = authorized.saved[0];
  assert.equal(doc.isAdminDemo, true, 'saved demo must be marked admin-only');
  assert.equal(doc.isPubliclyShareable, false, 'saved demo must be non-shareable');
  assert.equal(doc.source, 'admin_demo', 'saved demo must not count as partner/client source');
  assert.equal(doc.generationAudit.resolvedActivityType, 'buggy-adventure', 'saved demo must keep buggy activity mapping');
  assert.equal(doc.partner.magazineId, undefined, 'admin demo partner card must not get a public magazine id');
  assert.equal(doc.partner.whatsapp, undefined, 'admin demo must not activate WhatsApp CTA');
  assert.equal(doc.partner.website, undefined, 'admin demo must not activate website CTA');
  pass('authorized preview creates a private non-shareable buggy demo only');

  assert(privateDemoPageSource.includes('getAdminSession()'), 'private demo page must require admin session');
  assert(privateDemoPageSource.includes('!doc || !doc.isAdminDemo'), 'private demo page must only render admin demos');
  assert(privateDemoPageSource.includes('DEMO PREVIEW'), 'private demo page must show a demo badge');
  assert(privateDemoPageSource.includes('No PDF'), 'private demo page must not expose PDF download UI');
  pass('private demo viewer is admin-only and clearly badged');

  assert(previewPageSource.includes('if (doc.isAdminDemo) notFound();'), 'public preview must block admin demos');
  assert(magazinePageSource.includes('if (doc.isAdminDemo) notFound();'), 'public magazine page must block admin demos');
  assert(screenshotRouteSource.includes('if (doc.isAdminDemo)'), 'public screenshot route must block admin demos');
  pass('public routes block admin demo magazines');

  console.log('All admin demo preview assertions passed.');
}

run().catch((error) => {
  console.error(`FAIL ${error.message}`);
  process.exitCode = 1;
});
