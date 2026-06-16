import { MagazineTemplate } from './types';
import {
  wanderTogetherTemplate,
  blueBoldTemplate,
  exploreEditorialTemplate,
  travelMinimalTemplate,
  redBoldTemplate,
  greenBeigeTemplate,
  hanoverTemplate,
  luxuryTemplate,
  canvaTravelTemplate,
  auroraEditorialTemplate,
  atlasNocturneEditorialTemplate,
  wanderbookEditorialTemplate,
  photographerExperienceTemplate,
  tourGuideExperienceTemplate,
  boatTripExperienceTemplate,
  buggyAdventureExperienceTemplate,
  holidayRentalMemoryTemplate,
} from '@/components/templates';

const TEMPLATES: MagazineTemplate[] = [
  wanderbookEditorialTemplate,
  wanderTogetherTemplate,
  blueBoldTemplate,
  exploreEditorialTemplate,
  travelMinimalTemplate,
  redBoldTemplate,
  greenBeigeTemplate,
  hanoverTemplate,
  luxuryTemplate,
  canvaTravelTemplate,
  auroraEditorialTemplate,
  atlasNocturneEditorialTemplate,
  photographerExperienceTemplate,
  tourGuideExperienceTemplate,
  boatTripExperienceTemplate,
  buggyAdventureExperienceTemplate,
  holidayRentalMemoryTemplate,
];

const ID_ALIASES: Record<string, string> = {
  'atlas-nocturne': 'atlas-nocturne-editorial',
  'holiday-rental-guest-memory': 'holiday-rental-memory',
};

const SAFE_FALLBACK_ORDER = ['wanderbook-editorial', 'canva-travel', 'aurora-editorial'];

export function getAllTemplates(): MagazineTemplate[] {
  return TEMPLATES;
}

export function getTemplateById(id: string): MagazineTemplate {
  const found = TEMPLATES.find((t) => t.id === id);
  if (!found) {
    return auroraEditorialTemplate;
  }
  return found;
}

export function getSafeTemplateId(templateId?: string | null): string {
  if (!templateId) return _pickFallback();

  const normalized = ID_ALIASES[templateId] ?? templateId;
  if (TEMPLATES.some((t) => t.id === normalized)) return normalized;

  console.warn(`[template-registry] Unknown template id "${templateId}" — using fallback`);
  return _pickFallback();
}

function _pickFallback(): string {
  for (const id of SAFE_FALLBACK_ORDER) {
    if (TEMPLATES.some((t) => t.id === id)) return id;
  }
  return TEMPLATES[0]?.id ?? 'aurora-editorial';
}
