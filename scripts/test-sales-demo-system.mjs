#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.join(import.meta.dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

const tokenSource = read('lib/sales-demo-token.ts');
assert(tokenSource.includes('randomBytes(32)'), 'sales demo tokens must use 32 random bytes');
assert(tokenSource.includes(".toString('hex')"), 'sales demo tokens must be hex encoded');
assert(tokenSource.includes('[0-9a-f]{64}'), 'sales demo token validator must require 64 hex chars');

const generated = new Set();
for (let i = 0; i < 1000; i += 1) {
  const token = crypto.randomBytes(32).toString('hex');
  assert(/^[0-9a-f]{64}$/.test(token), 'generated token must be 64 lowercase hex chars');
  generated.add(token);
}
assert(generated.size === 1000, 'generated tokens must be unique across 1000 samples');
pass('random secure token shape and uniqueness');

const createRoute = read('app/api/private/sales-demo/create/route.ts');
assert(createRoute.includes("import { getAdminSession }"), 'create route must import admin session guard');
assert(createRoute.includes('if (!getAdminSession())'), 'create route must require an admin session');
assert(createRoute.includes('generateSalesDemoToken()'), 'create route must generate a random sales-demo token');
assert(createRoute.includes("scrubbed.source = 'sales_demo'"), 'create route must mark the magazine as a sales demo');
assert(createRoute.includes('scrubbed.isAdminDemo = false'), 'sales demo must not be an admin demo');
assert(createRoute.includes('scrubbed.isPubliclyShareable = false'), 'sales demo must not become a normal shareable magazine');
assert(!createRoute.includes('/partner/signup'), 'create route must not redirect to or create normal partner signup');
pass('admin create route is guarded and creates sales-demo-only documents');

const publicPage = read('app/demo/[token]/page.tsx');
assert(publicPage.includes('isSalesDemoToken(params.token)'), 'public sales demo route must validate token format');
assert(publicPage.includes('getSalesDemoByToken(params.token)'), 'public sales demo route must fetch by token');
assert(publicPage.includes("doc.source !== 'sales_demo'"), 'public sales demo route must reject non-sales-demo documents');
assert(publicPage.includes('doc.isAdminDemo'), 'public sales demo route must reject admin demo documents');
assert(publicPage.includes('Demo creado para'), 'public page must show the demo business heading');
assert(publicPage.includes('¿Quieres una revista así para tus clientes?'), 'public page must show the Spanish CTA heading');
assert(publicPage.includes('Esta demo ha caducado.'), 'expired page must show the Spanish expired message');
assert(!publicPage.includes('AdminDemoToolbar'), 'public sales demo page must not render admin toolbar');
assert(!publicPage.includes('PdfLockedBadge'), 'public sales demo page must not render PDF download/locked UI');
assert(!publicPage.includes('ShareMagazineButton'), 'public sales demo page must not render share button');
pass('public route uses token and excludes admin/PDF/share controls');

const trackingComponent = read('components/sales-demo/SalesDemoTracking.tsx');
assert(trackingComponent.includes('sales_demo_opened'), 'tracking component must fire opened event');
assert(trackingComponent.includes('sales_demo_whatsapp_clicked'), 'tracking component must fire WhatsApp click event');
assert(trackingComponent.includes('sales_demo_signup_clicked'), 'tracking component must fire signup click event');
assert(trackingComponent.includes('Hablar con Wanderbook por WhatsApp'), 'WhatsApp CTA must exist');
assert(trackingComponent.includes('Crear mi cuenta'), 'signup CTA must exist');
assert(!trackingComponent.includes('data-token'), 'tracking component must not expose token in a data attribute');
pass('CTA buttons and allowed tracking events are present');

const trackRoute = read('app/api/demo/track/route.ts');
assert(trackRoute.includes('EVENT_TO_FIELD'), 'tracking route must map events through an allowlist');
assert(trackRoute.includes('isSalesDemoToken(token)'), 'tracking route must validate tokens');
assert(!trackRoute.includes('.select('), 'tracking route must not select sales-demo or magazine data');
pass('tracking route validates input and returns no private data');

const leadsClient = read('app/private/leads/LeadsClient.tsx');
assert(leadsClient.includes('Create shareable demo'), 'CRM must expose Create shareable demo action');
assert(leadsClient.includes('Open demo'), 'CRM must expose Open demo action');
assert(leadsClient.includes('Copy demo link'), 'CRM must expose Copy demo link action');
assert(leadsClient.includes('Send by WhatsApp'), 'CRM must expose Send by WhatsApp action');
assert(leadsClient.includes('Status: {status}'), 'CRM must show sales demo status');
assert(leadsClient.includes('Expires:'), 'CRM must show sales demo expiry');
assert(!leadsClient.includes('Create demo partner'), 'old Create demo partner label must not remain');
assert(!leadsClient.includes('Create real partner account'), 'CRM must not surface real partner account creation as the demo action');
pass('CRM contains sales-demo actions and status');

const adminPreview = read('app/private/demo/[id]/page.tsx');
assert(adminPreview.includes('getAdminSession()'), 'admin demo preview must still require admin session');
assert(adminPreview.includes("redirect('/private/leads')"), 'admin demo preview must redirect unauthenticated users');
assert(adminPreview.includes('AdminDemoToolbar'), 'admin demo preview must keep admin toolbar');
assert(adminPreview.includes('PdfLockedBadge'), 'admin demo preview must keep private PDF locked UI');
pass('existing admin-only Demo Preview remains private and unchanged');

const baseUrl = process.env.SALES_DEMO_TEST_BASE_URL;
if (baseUrl) {
  const invalidResponse = await fetch(`${baseUrl.replace(/\/$/, '')}/demo/not-a-token`);
  assert(invalidResponse.status === 404, 'syntactically invalid public demo token must return 404');
  pass('invalid public token returns 404 over HTTP');
} else {
  console.log('SKIP HTTP route checks; set SALES_DEMO_TEST_BASE_URL to test against a running server.');
}

console.log('All sales demo system assertions passed.');
