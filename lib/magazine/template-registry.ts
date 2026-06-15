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
  photographerExperienceTemplate,
  tourGuideExperienceTemplate,
  boatTripExperienceTemplate,
  buggyAdventureExperienceTemplate,
  holidayRentalMemoryTemplate,
} from '@/components/templates';

const TEMPLATES: MagazineTemplate[] = [
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
