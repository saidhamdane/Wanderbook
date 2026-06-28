import 'server-only';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE_NAME = 'wanderbook_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

type AdminSessionPayload = {
  iat: number;
};

function getAdminSecret(): string | null {
  return process.env.ADMIN_SECRET || null;
}

function signHmac(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function timingSafeHexEqual(actual: string, expected: string): boolean {
  if (actual.length !== expected.length) return false;
  try {
    const actualBuffer = Buffer.from(actual, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');
    if (actualBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

function encodeAdminSession(payload: AdminSessionPayload, secret: string): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${data}.${signHmac(data, secret)}`;
}

export function verifyAdminPassword(provided: string): boolean {
  const secret = getAdminSecret();
  if (!secret || typeof provided !== 'string') return false;
  const providedBuffer = Buffer.from(provided);
  const secretBuffer = Buffer.from(secret);
  if (providedBuffer.length !== secretBuffer.length) return false;
  try {
    return crypto.timingSafeEqual(providedBuffer, secretBuffer);
  } catch {
    return false;
  }
}

export function decodeAdminSession(token: string): AdminSessionPayload | null {
  const secret = getAdminSecret();
  if (!secret) return null;

  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;

  const data = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expectedSignature = signHmac(data, secret);
  if (!timingSafeHexEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8')) as AdminSessionPayload;
    const issuedAt = typeof payload.iat === 'number' ? payload.iat : 0;
    if (Math.floor(Date.now() / 1000) - issuedAt > SESSION_MAX_AGE) return null;
    if (issuedAt > Math.floor(Date.now() / 1000) + 60) return null;
    return { iat: issuedAt };
  } catch {
    return null;
  }
}

export function createAdminSession(): void {
  const secret = getAdminSecret();
  if (!secret) return;
  const token = encodeAdminSession({ iat: Math.floor(Date.now() / 1000) }, secret);
  cookies().set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function getAdminSession(): boolean {
  const token = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token || !token.includes('.')) return false;
  return decodeAdminSession(token) !== null;
}

export function clearAdminSession(): void {
  cookies().set(ADMIN_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}
