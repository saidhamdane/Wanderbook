import { MagazineTemplate } from './types';

export const EXPERIENCE_TEMPLATE_IDS = [
  'photographer-experience',
  'tour-guide-experience',
  'boat-trip-experience',
  'buggy-adventure-experience',
  'holiday-rental-memory',
] as const;

const FALLBACK_EDITORIAL_IDS = ['aurora-editorial', 'atlas-nocturne-editorial'];
const PARTNER_CLIENT_TEMPLATE_IDS = [
  ...EXPERIENCE_TEMPLATE_IDS,
  ...FALLBACK_EDITORIAL_IDS,
];

export function defaultTemplateIdForPartnerClient(
  businessType?: string,
  preferredTemplateId?: string
): string {
  const preferred = preferredTemplateId?.trim();
  if (preferred && PARTNER_CLIENT_TEMPLATE_IDS.includes(preferred as (typeof PARTNER_CLIENT_TEMPLATE_IDS)[number])) {
    return preferred;
  }
  const normalized = (businessType || '').trim().toLowerCase();
  if (normalized.includes('boat') || normalized.includes('sailing') || normalized.includes('catamaran')) {
    return 'boat-trip-experience';
  }
  return defaultTemplateIdForBusinessType(businessType);
}

export function recommendedTemplateIdsForBusinessType(businessType?: string): string[] | null {
  const normalized = (businessType || '').trim().toLowerCase();
  if (!normalized || normalized === 'other') return null;
  if (normalized === 'photographer') {
    return ['photographer-experience', ...FALLBACK_EDITORIAL_IDS];
  }
  if (normalized === 'tour guide') {
    return ['tour-guide-experience', ...FALLBACK_EDITORIAL_IDS];
  }
  if (normalized === 'excursion company') {
    return [
      'buggy-adventure-experience',
      'boat-trip-experience',
      'tour-guide-experience',
      ...FALLBACK_EDITORIAL_IDS,
    ];
  }
  if (normalized === 'holiday rental' || normalized === 'hotel') {
    return ['holiday-rental-memory', ...FALLBACK_EDITORIAL_IDS];
  }
  return null;
}

export function filterTemplatesForBusinessType(
  templates: MagazineTemplate[],
  businessType?: string
): MagazineTemplate[] {
  const ids = recommendedTemplateIdsForBusinessType(businessType);
  if (!ids) return templates;
  const byId = new Map(templates.map((template) => [template.id, template]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as MagazineTemplate[];
}

export function defaultTemplateIdForBusinessType(businessType?: string): string {
  return recommendedTemplateIdsForBusinessType(businessType)?.[0] || 'aurora-editorial';
}
