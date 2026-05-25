import { MagazineTemplate, TemplatePage } from '@/lib/magazine/types';

// 8 placeholder pages — template is edited externally in Canva
const pages: TemplatePage[] = Array.from({ length: 8 }, (_, i) => ({
  id: `page-${i + 1}`,
  name: ['Cover', 'Contents', 'Welcome', 'Destination', 'Gallery', 'Memories', 'Quote', 'Back Cover'][i],
  layout: 'canva-external',
  slots: [],
}));

export const canvaTravelTemplate: MagazineTemplate = {
  id: 'canva-travel',
  name: 'Canva Travel',
  mood: 'Vibrant · Modern · Adventurous',
  description: 'Open in Canva to customize this vibrant travel magazine template. Navy, crimson, and white palette.',
  source: 'canva',
  external: true,
  canvaUrl: 'https://www.canva.com/brand/brand-templates/EAG2EuubOOg',
  palette: {
    primary: '#1a1a2e',
    accent: '#e94560',
    background: '#f5f5f5',
    text: '#1a1a1a',
    light: '#f0f0f8',
  },
  fonts: {
    heading: "'Montserrat', system-ui, sans-serif",
    subheading: "'Montserrat', system-ui, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  pages,
};
