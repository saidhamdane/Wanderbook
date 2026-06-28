import type { ActivityProfile } from './resolveActivityProfile';
import { DEFAULT_TEMPLATE_COVER_IMAGE } from './template-covers';

type PartnerHeroImageSource = string | null | undefined | Record<string, unknown>;

const PARTNER_IMAGE_FIELDS = [
  'businessCoverImage',
  'businessImage',
  'uploadedBusinessImage',
  'heroImage',
  'coverImage',
  'demoCompanyImage',
];

export function resolvePartnerHeroImage(
  partnerImageSource: PartnerHeroImageSource,
  activityProfile: ActivityProfile
): string {
  const partnerImage = resolvePartnerProvidedImage(partnerImageSource);
  if (partnerImage) return partnerImage;

  if (isUsableImage(activityProfile.previewImage)) {
    return activityProfile.previewImage.trim();
  }

  return DEFAULT_TEMPLATE_COVER_IMAGE;
}

function resolvePartnerProvidedImage(source: PartnerHeroImageSource): string | null {
  if (typeof source === 'string') {
    return isUsableImage(source) ? source.trim() : null;
  }

  if (!source) return null;

  for (const field of PARTNER_IMAGE_FIELDS) {
    const value = source[field];
    if (typeof value === 'string' && isUsableImage(value)) {
      return value.trim();
    }
  }

  return null;
}

function isUsableImage(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (/[\u0000-\u001f]/.test(trimmed)) return false;
  if (/^(javascript|data):/i.test(trimmed)) return false;
  if (/^https?:\/\//i.test(trimmed)) return true;
  return trimmed.startsWith('/') && !trimmed.startsWith('//');
}
