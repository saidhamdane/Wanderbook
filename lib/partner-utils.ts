export const PUBLIC_SITE_ORIGIN = 'https://wanderbookcanarias.com';
export const DEFAULT_PARTNER_DISPLAY_NAME = 'Wanderbook Canarias';
export const DEFAULT_PARTNER_OG_IMAGE = `${PUBLIC_SITE_ORIGIN}/og/wanderbook-canarias.jpg`;

const TEST_BUSINESS_NAMES = new Set(['sss', 'test', 'demo', 'asdf', 'sdffg']);

type PartnerDisplayNameSource = {
  businessName?: string | null;
  name?: string | null;
};

export function formatSpanishWhatsapp(value: string): string {
  const raw = value.trim();
  const digits = raw.replace(/\D/g, '');
  let national = digits;

  if (digits.startsWith('0034')) national = digits.slice(4);
  else if (digits.startsWith('34') && digits.length >= 11) national = digits.slice(2);
  else if (raw.startsWith('+34')) national = digits.slice(2);

  if (national.length === 9) {
    return `+34 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`;
  }
  return raw;
}

export function formatPartnerWebsiteDisplay(value?: string): string {
  const raw = (value || '').trim();
  if (!raw) return '';

  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(withProtocol);
    return url.hostname.replace(/^www\./i, '').toLowerCase();
  } catch {
    return raw
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/+$/g, '')
      .toLowerCase();
  }
}

export function getPartnerBookingCta({
  businessType,
  businessName,
  website,
}: {
  businessType?: string;
  businessName?: string;
  website?: string;
}): string {
  const normalized = `${businessType || ''} ${businessName || ''} ${website || ''}`.toLowerCase();

  if (/boat|catamaran|sail|sailing|yacht|marine|ocean/.test(normalized)) {
    return 'Book your next boat experience';
  }
  if (/buggy|quad|excursion|adventure|tour/.test(normalized)) {
    return 'Book your next adventure';
  }
  if (/holiday rental|hotel|villa|apartment|stay|airbnb/.test(normalized)) {
    return 'Book your next stay';
  }
  if (/photographer|photo|photoshoot|portrait/.test(normalized)) {
    return 'Book your next photoshoot';
  }

  return 'Book your next experience';
}

function isValidPartnerName(value?: string | null): value is string {
  const trimmed = (value || '').trim();
  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');

  return trimmed.length >= 3 && !TEST_BUSINESS_NAMES.has(normalized);
}

export function getPartnerDisplayName(partner: PartnerDisplayNameSource): string {
  if (isValidPartnerName(partner.businessName)) return partner.businessName.trim();
  if (isValidPartnerName(partner.name)) return partner.name.trim();
  return DEFAULT_PARTNER_DISPLAY_NAME;
}

export function getSafePartnerBusinessName(value?: string): string {
  return getPartnerDisplayName({ businessName: value });
}

export function getCanonicalPartnerUrl(slug: string): string {
  return `${PUBLIC_SITE_ORIGIN}/partner/${encodeURIComponent(slug)}`;
}

export function isValidHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidLogoSrc(value?: string): boolean {
  if (!value) return false;
  if (value.startsWith('/uploads/partners/')) return true;
  return isValidHttpUrl(value);
}

export function publicOriginFromEnvOrHost(host?: string): string {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  if (appUrl && !/localhost|127\.0\.0\.1/i.test(appUrl)) return appUrl.replace(/\/$/, '');
  if (host && !/localhost|127\.0\.0\.1/i.test(host)) return `http://${host}`;
  return PUBLIC_SITE_ORIGIN;
}
