import crypto from 'node:crypto';

const BASE_URL = process.env.ADMIN_AUTH_TEST_BASE_URL || 'http://localhost:3000';
const COOKIE_NAME = 'wanderbook_admin_session';
const adminSecret = process.env.ADMIN_SECRET;

function fail(message) {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readBody(response) {
  return await response.text();
}

async function postJson(path, body, headers = {}) {
  return await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

function extractSessionCookie(setCookieHeader) {
  if (!setCookieHeader) return null;
  const cookie = setCookieHeader
    .split(/,(?=\s*[A-Za-z0-9_]+=)/)
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return cookie || null;
}

function getCookieValue(cookie) {
  const firstPart = cookie.split(';')[0];
  return firstPart.slice(`${COOKIE_NAME}=`.length);
}

function signExpiredSession() {
  const data = Buffer.from(JSON.stringify({ iat: 0 })).toString('base64url');
  const signature = crypto.createHmac('sha256', adminSecret).update(data).digest('hex');
  return `${data}.${signature}`;
}

async function getPrivateLeads(cookieValue) {
  const headers = cookieValue ? { Cookie: `${COOKIE_NAME}=${cookieValue}` } : {};
  return await fetch(`${BASE_URL}/private/leads`, { headers });
}

async function patchLeadWithoutSession() {
  return await fetch(`${BASE_URL}/api/private/leads`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'codex-admin-auth-test', status: 'Contacted', notes: 'unauthorized test' }),
  });
}

async function expectLoginPage(cookieValue, label) {
  const response = await getPrivateLeads(cookieValue);
  const body = await readBody(response);
  assert(response.status === 200, `${label}: expected page status 200`);
  assert(body.includes('Wanderbook Admin'), `${label}: expected login form`);
  assert(!body.includes('Fuerteventura sales CRM'), `${label}: lead data page rendered`);
  return body;
}

async function run() {
  if (!adminSecret) {
    fail('ADMIN_SECRET must be set in the test environment');
    return;
  }

  try {
    const invalidPassword = adminSecret === 'wrongpassword' ? 'not-the-admin-password' : 'wrongpassword';
    const invalidResponse = await postJson('/api/private/auth/login', { password: invalidPassword });
    const invalidBody = await readBody(invalidResponse);
    assert(invalidResponse.status === 401, 'invalid password was not rejected');
    assert(!invalidBody.includes(adminSecret), 'invalid response exposed the admin secret value');
    pass('invalid password is rejected');
  } catch (error) {
    fail(`invalid password is rejected: ${error.message}`);
  }

  let validCookieValue = '';
  try {
    const validResponse = await postJson('/api/private/auth/login', { password: adminSecret });
    const validBody = await readBody(validResponse);
    const setCookie = validResponse.headers.get('set-cookie');
    const sessionCookie = extractSessionCookie(setCookie);
    assert(validResponse.status === 200, 'valid password did not return 200');
    assert(!validBody.includes(adminSecret), 'valid response exposed the admin secret value');
    assert(sessionCookie, 'session cookie was not set');
    assert(/;\s*HttpOnly/i.test(sessionCookie), 'session cookie is not HttpOnly');
    assert(/;\s*SameSite=Strict/i.test(sessionCookie), 'session cookie is not SameSite=Strict');
    assert(/;\s*Path=\//i.test(sessionCookie), 'session cookie path is not root');
    validCookieValue = getCookieValue(sessionCookie);
    assert(validCookieValue && validCookieValue !== adminSecret, 'cookie contains the raw admin secret');
    assert(!validCookieValue.includes(adminSecret), 'cookie value exposed the admin secret value');

    const protectedResponse = await getPrivateLeads(validCookieValue);
    const protectedBody = await readBody(protectedResponse);
    assert(protectedResponse.status === 200, 'valid session did not render protected page');
    assert(protectedBody.includes('Fuerteventura sales CRM'), 'valid session did not render lead page');
    assert(!protectedBody.includes(adminSecret), 'protected page exposed the admin secret value');
    pass('generated session is valid');
  } catch (error) {
    fail(`generated session is valid: ${error.message}`);
  }

  try {
    assert(validCookieValue, 'valid session cookie unavailable for tamper test');
    await expectLoginPage(`${validCookieValue}x`, 'tampered session');
    await expectLoginPage(signExpiredSession(), 'expired session');
    pass('tampered and expired sessions are rejected');
  } catch (error) {
    fail(`tampered and expired sessions are rejected: ${error.message}`);
  }

  try {
    const loginHtml = await expectLoginPage('', 'unauthenticated page');
    assert(!loginHtml.includes(adminSecret), 'login page exposed the admin secret value');
    assert(!loginHtml.includes('ADMIN_SECRET'), 'login page exposed the admin secret variable name');
    pass('raw ADMIN_SECRET is not exposed in rendered page output');
  } catch (error) {
    fail(`raw ADMIN_SECRET is not exposed in rendered page output: ${error.message}`);
  }

  try {
    const apiResponse = await patchLeadWithoutSession();
    const apiBody = await readBody(apiResponse);
    assert(apiResponse.status === 401, 'unauthenticated PATCH was not rejected');
    assert(!apiBody.includes(adminSecret), 'unauthenticated PATCH response exposed the admin secret value');
    pass('unauthenticated API PATCH is rejected');
  } catch (error) {
    fail(`unauthenticated API PATCH is rejected: ${error.message}`);
  }
}

await run();
