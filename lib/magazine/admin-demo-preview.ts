import crypto from 'crypto';

export type DemoPreviewLead = {
  business: string;
  type: string;
  detectedCategory?: string;
  location: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  website?: string;
};

function cleanString(value: unknown, maxLength = 220): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanNumber(value: unknown): number | undefined {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export function normalizeAdminDemoLead(input: Record<string, unknown>): DemoPreviewLead | null {
  const business = cleanString(input.business || input.businessName);
  const type = cleanString(input.type || input.businessType || input.activityType);
  const detectedCategory = cleanString(input.detectedCategory || input.detectedType || input.googlePrimaryType);
  const location = cleanString(input.location || input.island || input.mainIsland) || 'Fuerteventura';
  if (!business || !type) return null;
  return {
    business,
    type,
    detectedCategory,
    location,
    phone: cleanString(input.phone || input.whatsapp, 80),
    rating: cleanNumber(input.rating),
    reviews: cleanNumber(input.reviews || input.reviewCount),
    website: cleanString(input.website, 320),
  };
}

function leadText(lead: DemoPreviewLead): string {
  return [lead.detectedCategory, lead.type, lead.business].filter(Boolean).join(' ');
}

export function activityInputForLead(lead: DemoPreviewLead): string {
  const text = leadText(lead).toLowerCase();
  if (/(quad|buggy|off[-\s]?road)/.test(text)) return 'buggy-adventure';
  if (/(catamaran|whale|boat|ferry|barco)/.test(text)) return 'boat-tour';
  if (/(surf|kite)/.test(text)) return 'surf-school';
  if (/photograph|photographer|photo/.test(text)) return 'photographer';
  if (/(guide|guia|guided)/.test(text)) return 'tour-guide';
  if (/(villa|holiday rental|vacation rental|alquiler vacacional)/.test(text)) return 'villa-rental';
  return lead.type;
}

export function demoIdForLead(lead: DemoPreviewLead): string {
  const key = [
    lead.business,
    lead.type,
    lead.detectedCategory,
    lead.location,
    lead.phone,
    lead.website,
  ].join('|').toLowerCase();
  return `admag_${crypto.createHash('sha256').update(key).digest('hex').slice(0, 16)}`;
}

export function adminDemoCompanyBody(lead: DemoPreviewLead, activityLabel: string): string {
  const details = [
    lead.phone ? `Phone: ${lead.phone}` : '',
    lead.website ? `Website: ${lead.website}` : '',
  ].filter(Boolean).join('\n');
  return [
    `${lead.business} is previewed as a ${activityLabel.toLowerCase()} for travelers in ${lead.location}.`,
    lead.rating ? `Lead signal: ${lead.rating.toFixed(1)} rating${lead.reviews ? ` from ${lead.reviews} reviews` : ''}.` : '',
    details ? `Admin-only lead details:\n${details}` : '',
  ].filter(Boolean).join('\n\n');
}
