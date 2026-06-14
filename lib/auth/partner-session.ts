import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const PARTNER_SESSION_COOKIE_NAME = 'wanderbook_partner_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type PartnerSessionPayload = {
  partnerId: string;
  partnerSlug: string;
  email: string;
  plan: string;
  subscriptionStatus: string;
  iat: number;
};

function getSecret(): string {
  const secret = process.env.PARTNER_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('[partner-session] PARTNER_SESSION_SECRET is not set. This env var is required in production.');
  }
  return 'dev-insecure-secret-set-PARTNER_SESSION_SECRET-in-env';
}

function signHmac(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

function encodeToken(payload: PartnerSessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = signHmac(data, getSecret());
  return `${data}.${sig}`;
}

/** Decode and verify a signed session token. Returns null if invalid.
 *  Exported so partner-store.ts can call it without using next/headers. */
export function decodePartnerSession(token: string): PartnerSessionPayload | null {
  const secret = process.env.PARTNER_SESSION_SECRET;
  // In dev, accept the fallback secret so the system works without config.
  const effectiveSecret = secret || (process.env.NODE_ENV !== 'production'
    ? 'dev-insecure-secret-set-PARTNER_SESSION_SECRET-in-env'
    : null);
  if (!effectiveSecret) return null;

  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;

  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = signHmac(data, effectiveSecret);
  // constant-time compare (both are hex strings of the same length)
  if (sig.length !== expected.length) return null;
  try {
    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expected, 'hex');
    if (sigBuf.length !== expBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf-8')) as PartnerSessionPayload;
  } catch {
    return null;
  }
}

/** Set the signed session cookie. Must be called from a Next.js server action / route handler. */
export function createPartnerSessionCookie(
  payload: Omit<PartnerSessionPayload, 'iat'>,
): void {
  const full: PartnerSessionPayload = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const token = encodeToken(full);
  cookies().set(PARTNER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

/** Read and verify the session cookie. Returns null if missing or invalid. */
export function getPartnerSession(): PartnerSessionPayload | null {
  const token = cookies().get(PARTNER_SESSION_COOKIE_NAME)?.value;
  if (!token || !token.includes('.')) return null;
  return decodePartnerSession(token);
}

/** Clear the session cookie. */
export function clearPartnerSession(): void {
  cookies().set(PARTNER_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/** Get session or redirect to login. Use in Server Components / Route Handlers. */
export function requirePartnerSession(nextPath?: string): PartnerSessionPayload {
  const session = getPartnerSession();
  if (!session) {
    const dest = nextPath ? `/partner/login?next=${encodeURIComponent(nextPath)}` : '/partner/login';
    redirect(dest);
  }
  return session;
}
