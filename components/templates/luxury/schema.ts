import { MagazineTemplate } from '@/lib/magazine/types';

export const luxuryTemplate: MagazineTemplate = {
  id: 'wanderbook-luxury',
  name: 'Wanderbook Luxury',
  mood: 'Elegant · Editorial · Timeless',
  description:
    'Condé Nast-inspired luxury family travel magazine. Navy, gold, and cream palette with Playfair Display typography.',
  source: 'canva',
  previewImage: '/templates/luxury-cover.jpg',
  palette: {
    primary: '#0B1D3A',
    accent: '#C9A84C',
    background: '#FAF7F0',
    text: '#1a1a1a',
    light: '#F5F2EB',
  },
  fonts: {
    heading: "'Playfair Display', Georgia, serif",
    subheading: "'Montserrat', system-ui, sans-serif",
    body: "'Montserrat', system-ui, sans-serif",
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'lux-html-cover',
      slots: [
        { type: 'image', id: 'coverPhoto',    aspect: 'portrait',  required: true,  preferredTags: ['hero', 'outdoor', 'landscape', 'travel'] },
        { type: 'text',  id: 'coverKicker',   kind: 'kicker',      maxLength: 30,   required: false, defaultValue: 'Family Travel' },
        { type: 'text',  id: 'coverTitle',    kind: 'headline',    maxLength: 40,   required: true },
        { type: 'text',  id: 'coverSubtitle', kind: 'subheadline', maxLength: 60,   required: false },
      ],
    },
    {
      id: 'toc',
      name: 'Table of Contents',
      layout: 'lux-html-toc',
      slots: [
        { type: 'image', id: 'tocPhoto',  aspect: 'portrait',  required: true,  preferredTags: ['scenic', 'travel', 'outdoor'] },
        { type: 'text',  id: 'pageTitle', kind: 'headline',    maxLength: 20,   required: false, defaultValue: 'Contents' },
        { type: 'text',  id: 'item1',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item2',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item3',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item4',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item5',     kind: 'kicker',      maxLength: 40,   required: false },
        { type: 'text',  id: 'item6',     kind: 'kicker',      maxLength: 40,   required: false },
      ],
    },
    {
      id: 'welcome',
      name: 'Welcome Story',
      layout: 'lux-html-welcome',
      slots: [
        { type: 'image', id: 'widePhoto', aspect: 'landscape', required: true,  preferredTags: ['destination', 'scenic', 'outdoor'] },
        { type: 'text',  id: 'pageTitle', kind: 'headline',    maxLength: 50,   required: true },
        { type: 'text',  id: 'body',      kind: 'body',        maxLength: 400,  required: false },
      ],
    },
    {
      id: 'destination',
      name: 'Destination Spread',
      layout: 'lux-html-destination',
      slots: [
        { type: 'image', id: 'featurePhoto', aspect: 'portrait',  required: true,  preferredTags: ['destination', 'dramatic', 'landscape'] },
        { type: 'text',  id: 'featureTitle', kind: 'headline',    maxLength: 50,   required: false },
        { type: 'text',  id: 'body',         kind: 'body',        maxLength: 300,  required: false },
      ],
    },
    {
      id: 'photo-grid',
      name: 'Photo Grid',
      layout: 'lux-html-grid',
      slots: [
        { type: 'image', id: 'gridA',        aspect: 'any',    required: true,  preferredTags: ['group', 'activity', 'family'] },
        { type: 'image', id: 'gridB',        aspect: 'any',    required: false, preferredTags: ['scenic', 'outdoor'] },
        { type: 'image', id: 'gridC',        aspect: 'any',    required: false, preferredTags: ['food', 'detail'] },
        { type: 'image', id: 'gridD',        aspect: 'any',    required: false, preferredTags: ['street', 'local'] },
        { type: 'text',  id: 'collageTitle', kind: 'headline', maxLength: 30,   required: false, defaultValue: 'Our Favourite Frames' },
      ],
    },
    {
      id: 'memories',
      name: 'Memories Collage',
      layout: 'lux-html-memories',
      slots: [
        { type: 'image', id: 'memoryA',  aspect: 'portrait',  required: true,  preferredTags: ['people', 'family', 'travel'] },
        { type: 'image', id: 'memoryB',  aspect: 'landscape', required: false, preferredTags: ['scenic', 'outdoor'] },
        { type: 'image', id: 'memoryC',  aspect: 'landscape', required: false, preferredTags: ['detail', 'local', 'food'] },
        { type: 'text',  id: 'pageTitle',kind: 'headline',    maxLength: 40,   required: false, defaultValue: 'The Moments Between' },
        { type: 'text',  id: 'body',     kind: 'body',        maxLength: 300,  required: false },
      ],
    },
    {
      id: 'highlights',
      name: 'Highlights',
      layout: 'lux-html-highlights',
      slots: [
        { type: 'image', id: 'featurePhoto', aspect: 'landscape', required: true, preferredTags: ['dramatic', 'scenic', 'outdoor'] },
        { type: 'text',  id: 'pageTitle',    kind: 'headline',    maxLength: 40,  required: false, defaultValue: 'The Best of Our Journey' },
      ],
    },
    {
      id: 'quote',
      name: 'Quote Page',
      layout: 'lux-html-quote',
      slots: [
        { type: 'image', id: 'featurePhoto', aspect: 'landscape', required: true,  preferredTags: ['scenic', 'sunset', 'calm'] },
        { type: 'text',  id: 'quote',        kind: 'quote',       maxLength: 150,  required: true },
        { type: 'text',  id: 'caption',      kind: 'caption',     maxLength: 60,   required: false },
      ],
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'lux-html-back',
      slots: [
        { type: 'image', id: 'coverPhoto', aspect: 'landscape', required: true,  preferredTags: ['scenic', 'outdoor', 'dramatic'] },
        { type: 'text',  id: 'pageTitle',  kind: 'tagline',     maxLength: 50,   required: false, defaultValue: 'Until We Travel Again' },
        { type: 'text',  id: 'body',       kind: 'body',        maxLength: 200,  required: false },
      ],
    },
  ],
};
