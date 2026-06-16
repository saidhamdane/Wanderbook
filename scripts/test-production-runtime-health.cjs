#!/usr/bin/env node
'use strict';

const http = require('http');
const https = require('https');

const BASE = process.env.TEST_BASE || 'http://localhost:3002';
const PROD = 'https://wanderbookcanarias.com';
const RESULTS = [];
let passed = 0;
let failed = 0;

function fetch(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000,
    };
    const req = lib.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
    if (options.body) req.write(options.body);
    req.end();
  });
}

function check(name, status, allowed, body = '') {
  const ok = allowed.includes(status);
  const crashWords = ['Internal Server Error', 'Template not found', 'Application error'];
  const hasCrash = crashWords.some((w) => body.includes(w));
  const pass = ok && !hasCrash;

  RESULTS.push({ name, status, pass, note: hasCrash ? 'crash detected in body' : '' });
  if (pass) passed++;
  else failed++;
  const icon = pass ? '✓' : '✗';
  console.log(`  ${icon} ${name} → HTTP ${status}${hasCrash ? ' [CRASH IN BODY]' : ''}`);
}

async function run() {
  console.log(`\nWanderbook Production Runtime Health Check`);
  console.log(`Base: ${BASE}\n`);

  // 1. Homepage
  try {
    const r = await fetch(`${BASE}/`);
    check('Homepage', r.status, [200], r.body);
  } catch (e) { check('Homepage', 0, [200]); }

  // 2. Partner login
  try {
    const r = await fetch(`${BASE}/partner/login`);
    check('/partner/login', r.status, [200], r.body);
  } catch (e) { check('/partner/login', 0, [200]); }

  // 3. Partner register
  try {
    const r = await fetch(`${BASE}/partner/register`);
    check('/partner/register', r.status, [200], r.body);
  } catch (e) { check('/partner/register', 0, [200]); }

  // 4. Known partner slug (magic-sailing) — must not be 500
  try {
    const r = await fetch(`${BASE}/partner/magic-sailing`);
    check('/partner/magic-sailing (no 500)', r.status, [200, 301, 302, 307, 308, 404], r.body);
  } catch (e) { check('/partner/magic-sailing (no 500)', 0, [200, 301, 302, 307, 308, 404]); }

  // 5. Non-existent partner slug — must not be 500
  try {
    const r = await fetch(`${BASE}/partner/9999-nonexistent-test`);
    check('/partner/9999 (no 500)', r.status, [200, 301, 302, 307, 308, 404], r.body);
  } catch (e) { check('/partner/9999 (no 500)', 0, [200, 301, 302, 307, 308, 404]); }

  // 6. QR API — GET with dummy magazine id
  try {
    const r = await fetch(`${BASE}/api/partner?slug=test`);
    check('Partner API (no 500)', r.status, [200, 400, 404], r.body);
  } catch (e) { check('Partner API (no 500)', 0, [200, 400, 404]); }

  // 7. Analytics POST — must not crash
  try {
    const body = JSON.stringify({ eventType: 'partner_page_opened', partnerSlug: 'test' });
    const r = await fetch(`${BASE}/api/partner/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    check('Analytics POST (no 500)', r.status, [200, 201, 400, 404, 405], r.body);
  } catch (e) { check('Analytics POST (no 500)', 0, [200, 201, 400, 404, 405]); }

  // 8. Template fallback test — partner page with a slug that uses aurora-editorial template
  // Uses a known partner slug; 200 or 404 both mean no crash. 500 = bad.
  try {
    const r = await fetch(`${BASE}/partner/magic-sailing`);
    const nocrash = !r.body.includes('Template not found') && !r.body.includes('Internal Server Error');
    const pass = [200, 301, 302, 307, 308, 404].includes(r.status) && nocrash;
    RESULTS.push({ name: 'Template fallback (partner page, no crash)', status: r.status, pass, note: nocrash ? '' : 'crash detected' });
    if (pass) passed++;
    else failed++;
    console.log(`  ${pass ? '✓' : '✗'} Template fallback (partner page, no crash) → HTTP ${r.status}${nocrash ? '' : ' [CRASH DETECTED]'}`);
  } catch (e) {
    RESULTS.push({ name: 'Template fallback (partner page, no crash)', status: 0, pass: false, note: String(e) });
    failed++;
    console.log(`  ✗ Template fallback (partner page, no crash) → connection error: ${e}`);
  }

  // 9. Production HTTPS check
  try {
    const r = await fetch(`${PROD}/`);
    check('Production HTTPS (200)', r.status, [200], r.body);
  } catch (e) { check('Production HTTPS (200)', 0, [200]); }

  // Summary
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    console.log('FAILED CHECKS:');
    RESULTS.filter((r) => !r.pass).forEach((r) => {
      console.log(`  ✗ ${r.name} → HTTP ${r.status}${r.note ? ` (${r.note})` : ''}`);
    });
    console.log('');
    process.exit(1);
  } else {
    console.log('All checks passed.\n');
  }
}

run().catch((err) => {
  console.error('Health check script error:', err);
  process.exit(1);
});
