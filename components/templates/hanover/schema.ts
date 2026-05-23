import { MagazineTemplate, TemplatePage } from '@/lib/magazine/types';

// 19 static pages — no dynamic slots, images served directly as PNGs
const PAGE_NAMES = [
  'Cover', 'Contents', 'Welcome', 'Destination', 'Story',
  'Feature', 'Photo Essay', 'Gallery', 'Culture', 'Food & Drink',
  'Adventure', 'Highlights', 'People', 'Landscape', 'Night Life',
  'Tips', 'Map', 'Memory Wall', 'Back Cover',
];

const pages: TemplatePage[] = Array.from({ length: 19 }, (_, i) => ({
  id: `page-${i + 1}`,
  name: PAGE_NAMES[i] ?? `Page ${i + 1}`,
  layout: 'hanover-static',
  slots: [],
}));

export const hanoverTemplate: MagazineTemplate = {
  id: 'hanover',
  name: 'Hanover Magazine',
  mood: 'Bold · Retro · Adventurous',
  description: 'Striking red and white bold typography with dramatic layouts and high-contrast design. A classic editorial statement.',
  source: 'canva',
  palette: {
    primary: '#EF321F',
    accent: '#EF321F',
    background: '#FFFFFF',
    text: '#1A1A1A',
    light: '#FFF5F5',
  },
  fonts: {
    heading: "'Bebas Neue', Impact, sans-serif",
    subheading: "'Space Grotesk', system-ui, sans-serif",
    body: "'Space Grotesk', system-ui, sans-serif",
  },
  pages,
};
