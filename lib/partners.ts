export type PartnerProfile = {
  slug: string;
  businessName: string;
  businessType: string;
  whatsapp: string;
  website: string;
  logoUrl: string;
  defaultIsland: string;
  brandingNote: string;
  preferredTemplateId?: string;
};

export const partners: PartnerProfile[] = [
  {
    slug: 'canary-dream-photos',
    businessName: 'Canary Dream Photos',
    businessType: 'Photographer',
    whatsapp: '+34 600 000 000',
    website: 'https://canarydreamphotos.com',
    logoUrl: '',
    defaultIsland: 'Fuerteventura',
    brandingNote: 'Created for you by Canary Dream Photos',
  },
];

export function getPartnerBySlug(slug: string): PartnerProfile | undefined {
  return partners.find((partner) => partner.slug === slug);
}

export function slugifyPartnerName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
