import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import type { MagazineDocument } from './magazine/types';
import { decodePartnerSession } from './auth/partner-session';
import { getPartnerBySlug as getSeedPartnerBySlug, slugifyPartnerName } from './partners';
import { isValidLogoSrc } from './partner-utils';

export type PartnerAccount = {
  id: string;
  email: string;
  passwordHash: string;
  businessName: string;
  slug: string;
  businessType: string;
  mainIsland: string;
  whatsapp: string;
  website?: string;
  logoUrl?: string;
  brandingNote?: string;
  preferredTemplateId?: string;
  plan: 'free' | 'unlimited_monthly' | 'pro';
  subscriptionStatus: 'none' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  monthlyMagazineLimit: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicPartner = {
  id?: string;
  slug: string;
  businessName: string;
  businessType: string;
  whatsapp: string;
  website: string;
  logoUrl: string;
  mainIsland: string;
  brandingNote: string;
  preferredTemplateId?: string;
};

type SessionRecord = {
  token: string;
  partnerId: string;
  createdAt: string;
};

const PARTNERS_FILE = path.join(process.cwd(), 'data', 'partners.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'partner-sessions.json');
const MAGAZINES_FILE = path.join(process.cwd(), 'data', 'magazines.json');
export const PARTNER_SESSION_COOKIE = 'wanderbook_partner_session';
export const FREE_MONTHLY_MAGAZINE_LIMIT = 3;
export const UNLIMITED_MONTHLY_MAGAZINE_LIMIT = Number.MAX_SAFE_INTEGER;
export const PAID_SUBSCRIPTION_STATUSES = ['active', 'trialing'] as const;

function readJsonFile<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(file: string, data: T): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

function normalizePartnerAccount(partner: PartnerAccount): PartnerAccount {
  const hasPaidSubscription = PAID_SUBSCRIPTION_STATUSES.includes(
    partner.subscriptionStatus as (typeof PAID_SUBSCRIPTION_STATUSES)[number]
  );
  const plan = hasPaidSubscription ? 'unlimited_monthly' : 'free';
  return {
    ...partner,
    plan,
    subscriptionStatus: partner.subscriptionStatus || (plan === 'unlimited_monthly' ? 'active' : 'none'),
    monthlyMagazineLimit: plan === 'unlimited_monthly'
      ? UNLIMITED_MONTHLY_MAGAZINE_LIMIT
      : partner.monthlyMagazineLimit || FREE_MONTHLY_MAGAZINE_LIMIT,
  };
}

export function hasActivePaidSubscription(partner: Pick<PartnerAccount, 'subscriptionStatus'>): boolean {
  return PAID_SUBSCRIPTION_STATUSES.includes(
    partner.subscriptionStatus as (typeof PAID_SUBSCRIPTION_STATUSES)[number]
  );
}

export function listPartnerAccounts(): PartnerAccount[] {
  return readJsonFile<PartnerAccount[]>(PARTNERS_FILE, []).map(normalizePartnerAccount);
}

function savePartnerAccounts(partners: PartnerAccount[]): void {
  writeJsonFile(PARTNERS_FILE, partners.map(normalizePartnerAccount));
}

function listSessions(): SessionRecord[] {
  return readJsonFile<SessionRecord[]>(SESSIONS_FILE, []);
}

function saveSessions(sessions: SessionRecord[]): void {
  writeJsonFile(SESSIONS_FILE, sessions);
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${key}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (stored.startsWith('scrypt:')) {
    const [, salt, key] = stored.split(':');
    if (!salt || !key) return false;
    const candidate = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(key, 'hex');
    return storedBuffer.length === candidate.length && crypto.timingSafeEqual(storedBuffer, candidate);
  }
  if (stored.startsWith('$2')) {
    // bcrypt hash — use synchronous bcryptjs compare (available at runtime)
    try {
      const bcrypt = require('bcryptjs') as { compareSync: (p: string, h: string) => boolean };
      return bcrypt.compareSync(password, stored);
    } catch {
      return false;
    }
  }
  return false;
}

function uniqueSlugForBusinessName(businessName: string, currentId?: string): string {
  const partners = listPartnerAccounts();
  const base = slugifyPartnerName(businessName) || 'partner';
  let slug = base;
  let n = 2;
  while (partners.some((partner) => partner.slug === slug && partner.id !== currentId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

export function createPartnerAccount(input: {
  email: string;
  password: string;
  businessName: string;
  businessType: string;
  mainIsland: string;
  whatsapp: string;
  website?: string;
  logoUrl?: string;
  brandingNote?: string;
  preferredTemplateId?: string;
}): PartnerAccount {
  const partners = listPartnerAccounts();
  const existing = partners.find((partner) => partner.email.toLowerCase() === input.email.toLowerCase());
  if (existing) {
    if (verifyPassword(input.password, existing.passwordHash)) return existing;
    throw new Error('A partner account already exists for this email.');
  }

  const now = new Date().toISOString();
  const businessName = input.businessName.trim();
  const account: PartnerAccount = {
    id: crypto.randomUUID(),
    email: input.email.trim().toLowerCase(),
    passwordHash: hashPassword(input.password),
    businessName,
    slug: uniqueSlugForBusinessName(businessName),
    businessType: input.businessType,
    mainIsland: input.mainIsland,
    whatsapp: input.whatsapp.trim(),
    website: input.website?.trim() || undefined,
    logoUrl: input.logoUrl?.trim() || undefined,
    brandingNote: input.brandingNote?.trim() || `Created for you by ${businessName}`,
    preferredTemplateId: input.preferredTemplateId?.trim() || undefined,
    plan: 'free',
    subscriptionStatus: 'none',
    monthlyMagazineLimit: FREE_MONTHLY_MAGAZINE_LIMIT,
    createdAt: now,
    updatedAt: now,
  };

  partners.push(account);
  savePartnerAccounts(partners);
  return account;
}

export function authenticatePartner(email: string, password: string): PartnerAccount | null {
  const account = listPartnerAccounts().find((partner) => partner.email.toLowerCase() === email.trim().toLowerCase());
  if (!account || !verifyPassword(password, account.passwordHash)) return null;
  return account;
}

export function updatePartnerAccount(id: string, input: Partial<Omit<PartnerAccount, 'id' | 'email' | 'passwordHash' | 'createdAt' | 'updatedAt' | 'plan' | 'subscriptionStatus' | 'stripeCustomerId' | 'stripeSubscriptionId' | 'currentPeriodEnd' | 'monthlyMagazineLimit'>>): PartnerAccount | null {
  const partners = listPartnerAccounts();
  const index = partners.findIndex((partner) => partner.id === id);
  if (index < 0) return null;
  const current = partners[index];
  const businessName = input.businessName?.trim() || current.businessName;
  const next: PartnerAccount = {
    ...current,
    businessName,
    slug: input.slug ? slugifyPartnerName(input.slug) : current.slug,
    businessType: input.businessType || current.businessType,
    mainIsland: input.mainIsland || current.mainIsland,
    whatsapp: input.whatsapp?.trim() || current.whatsapp,
    website: input.website?.trim() || undefined,
    logoUrl: input.logoUrl?.trim() || undefined,
    brandingNote: input.brandingNote?.trim() || `Created for you by ${businessName}`,
    preferredTemplateId: input.preferredTemplateId?.trim() || current.preferredTemplateId,
    updatedAt: new Date().toISOString(),
  };
  if (!input.slug && businessName !== current.businessName) {
    next.slug = uniqueSlugForBusinessName(businessName, current.id);
  }
  if (partners.some((partner) => partner.id !== id && partner.slug === next.slug)) {
    next.slug = uniqueSlugForBusinessName(next.slug, current.id);
  }
  partners[index] = next;
  savePartnerAccounts(partners);
  return next;
}

export function updatePartnerBilling(
  id: string,
  input: Partial<Pick<PartnerAccount, 'plan' | 'subscriptionStatus' | 'stripeCustomerId' | 'stripeSubscriptionId' | 'currentPeriodEnd' | 'monthlyMagazineLimit'>>
): PartnerAccount | null {
  const partners = listPartnerAccounts();
  const index = partners.findIndex((partner) => partner.id === id);
  if (index < 0) return null;
  const current = partners[index];
  const plan = input.plan || current.plan;
  const next: PartnerAccount = normalizePartnerAccount({
    ...current,
    ...input,
    plan,
    monthlyMagazineLimit: plan === 'unlimited_monthly'
      ? UNLIMITED_MONTHLY_MAGAZINE_LIMIT
      : input.monthlyMagazineLimit || FREE_MONTHLY_MAGAZINE_LIMIT,
    updatedAt: new Date().toISOString(),
  });
  partners[index] = next;
  savePartnerAccounts(partners);
  return next;
}

export function getPartnerAccountByStripeCustomerId(customerId: string): PartnerAccount | null {
  return listPartnerAccounts().find((partner) => partner.stripeCustomerId === customerId) || null;
}

export function getPartnerAccountByStripeSubscriptionId(subscriptionId: string): PartnerAccount | null {
  return listPartnerAccounts().find((partner) => partner.stripeSubscriptionId === subscriptionId) || null;
}

export function getPartnerAccountById(id: string): PartnerAccount | null {
  return listPartnerAccounts().find((partner) => partner.id === id) || null;
}

export function getPartnerAccountBySlug(slug: string): PartnerAccount | null {
  return listPartnerAccounts().find((partner) => partner.slug === slug) || null;
}

export function toPublicPartner(partner: PartnerAccount): PublicPartner {
  return {
    id: partner.id,
    slug: partner.slug,
    businessName: partner.businessName,
    businessType: partner.businessType,
    whatsapp: partner.whatsapp,
    website: partner.website || '',
    logoUrl: isValidLogoSrc(partner.logoUrl) ? partner.logoUrl || '' : '',
    mainIsland: partner.mainIsland,
    brandingNote: partner.brandingNote || `Created for you by ${partner.businessName}`,
    preferredTemplateId: partner.preferredTemplateId,
  };
}

export function getPublicPartnerBySlug(slug: string): PublicPartner | null {
  const account = getPartnerAccountBySlug(slug);
  if (account) return toPublicPartner(account);
  const seeded = getSeedPartnerBySlug(slug);
  if (!seeded) return null;
  return {
    slug: seeded.slug,
    businessName: seeded.businessName,
    businessType: seeded.businessType,
    whatsapp: seeded.whatsapp,
    website: seeded.website,
    logoUrl: isValidLogoSrc(seeded.logoUrl) ? seeded.logoUrl : '',
    mainIsland: seeded.defaultIsland,
    brandingNote: seeded.brandingNote,
    preferredTemplateId: seeded.preferredTemplateId,
  };
}

export function createPartnerSession(partnerId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const sessions = listSessions().filter((session) => session.partnerId !== partnerId);
  sessions.push({ token, partnerId, createdAt: new Date().toISOString() });
  saveSessions(sessions);
  return token;
}

export function getPartnerIdForSession(token?: string): string | null {
  if (!token) return null;
  // New format: signed HMAC cookie ({base64url_json}.{hex_sig})
  if (token.includes('.')) {
    const payload = decodePartnerSession(token);
    if (payload?.partnerId) return payload.partnerId;
  }
  // Legacy format: random hex token stored in data/partner-sessions.json
  return listSessions().find((session) => session.token === token)?.partnerId || null;
}

export function deletePartnerSession(token?: string): void {
  if (!token) return;
  const sessions = listSessions();
  const remaining = sessions.filter((session) => session.token !== token);
  if (remaining.length !== sessions.length) saveSessions(remaining);
}

export function countPartnerMagazines(partnerId: string): { total: number; month: number } {
  const docs = Object.values(readJsonFile<Record<string, MagazineDocument>>(MAGAZINES_FILE, {}));
  const now = new Date();
  const total = docs.filter((doc) => doc.partner?.partnerId === partnerId && doc.source === 'partner_client').length;
  const month = docs.filter((doc) => {
    if (doc.partner?.partnerId !== partnerId) return false;
    if (doc.source !== 'partner_client') return false;
    const generated = new Date(doc.generatedAt);
    return generated.getUTCFullYear() === now.getUTCFullYear() && generated.getUTCMonth() === now.getUTCMonth();
  }).length;
  return { total, month };
}
