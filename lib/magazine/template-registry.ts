import { MagazineTemplate } from './types';
import {
  wanderTogetherTemplate,
  blueBoldTemplate,
  exploreEditorialTemplate,
  travelMinimalTemplate,
  redBoldTemplate,
  greenBeigeTemplate
} from '@/components/templates';

const TEMPLATES: MagazineTemplate[] = [
  wanderTogetherTemplate,
  blueBoldTemplate,
  exploreEditorialTemplate,
  travelMinimalTemplate,
  redBoldTemplate,
  greenBeigeTemplate
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
