import { resolveActivityProfile } from './resolveActivityProfile';
import { MagazineTemplate } from './types';

export const EXPERIENCE_TEMPLATE_IDS = [
  'photographer-experience',
  'tour-guide-experience',
  'boat-trip-experience',
  'buggy-adventure-experience',
  'holiday-rental-memory',
] as const;

const VALID_PREFERRED_TEMPLATE_IDS = [
  ...EXPERIENCE_TEMPLATE_IDS,
  'wanderbook-editorial',
  'aurora-editorial',
  'atlas-nocturne-editorial',
] as const;

export function defaultTemplateIdForPartnerClient(
  businessType?: string,
  preferredTemplateId?: string
): string {
  const preferred = preferredTemplateId?.trim();
  if (preferred && VALID_PREFERRED_TEMPLATE_IDS.includes(preferred as (typeof VALID_PREFERRED_TEMPLATE_IDS)[number])) {
    return preferred;
  }
  return resolveActivityProfile({ businessType }).templateId;
}

export function recommendedTemplateIdsForBusinessType(businessType?: string): string[] | null {
  if (!businessType) return null;
  const profile = resolveActivityProfile({ businessType });
  if (profile.activityType === 'other') return null;
  return [profile.templateId, 'aurora-editorial', 'atlas-nocturne-editorial'];
}

export function filterTemplatesForBusinessType(
  templates: MagazineTemplate[],
  businessType?: string
): MagazineTemplate[] {
  const ids = recommendedTemplateIdsForBusinessType(businessType);
  if (!ids) return templates;
  const byId = new Map(templates.map((t) => [t.id, t]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as MagazineTemplate[];
}

export function defaultTemplateIdForBusinessType(businessType?: string): string {
  return recommendedTemplateIdsForBusinessType(businessType)?.[0] || 'aurora-editorial';
}
