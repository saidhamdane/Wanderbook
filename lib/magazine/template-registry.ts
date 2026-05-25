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
];

export function getAllTemplates(): MagazineTemplate[] {
  return TEMPLATES;
}

export function getTemplateById(id: string): MagazineTemplate {
  const found = TEMPLATES.find((t) => t.id === id);
  if (!found) {
    throw new Error('Template not found: ' + id);
  }
  return found;
}
