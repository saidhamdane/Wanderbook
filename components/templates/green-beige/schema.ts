import { MagazineTemplate } from '@/lib/magazine/types';

export const greenBeigeTemplate: MagazineTemplate = {
  id: 'green-beige',
  name: 'Modern Editorial',
  mood: 'Fresh · Editorial · Contemporary',
  description:
    'A modern editorial magazine with bold green typography on warm beige. Clean contemporary layouts.',
  source: 'canva',
  previewImage: '/templates/green-beige/cover.png',
  palette: {
    primary: '#2D5016',
    accent: '#8DC63F',
    background: '#F5F0E8',
    text: '#1A1A1A',
    light: '#FAF7F2'
  },
  fonts: {
    heading: "'Inter', Arial, sans-serif",
    subheading: "'Inter', Arial, sans-serif",
    body: "'Inter', Arial, sans-serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'gb-cover',
      slots: [
        { type: 'image', id: 'coverHeroImage', aspect: 'portrait', required: true, preferredTags: ['hero', 'group', 'portrait', 'scenic'] },
        { type: 'text', id: 'coverMagazineName', kind: 'headline', maxLength: 12, required: false, defaultValue: 'WANDERBOOK' },
        { type: 'text', id: 'coverDate', kind: 'kicker', maxLength: 25, required: false },
        { type: 'text', id: 'coverStory1Title', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'coverStory1Body', kind: 'caption', maxLength: 60, required: false },
        { type: 'text', id: 'coverStory2Title', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'coverMainName', kind: 'subheadline', maxLength: 25, required: true },
        { type: 'text', id: 'coverSubtitle', kind: 'caption', maxLength: 50, required: false }
      ]
    },
    {
      id: 'contents',
      name: 'Contents',
      layout: 'gb-contents',
      slots: [
        { type: 'text', id: 'toc1', kind: 'kicker', maxLength: 40, required: false },
        { type: 'text', id: 'toc2', kind: 'kicker', maxLength: 40, required: false },
        { type: 'text', id: 'toc3', kind: 'kicker', maxLength: 40, required: false },
        { type: 'text', id: 'toc4', kind: 'kicker', maxLength: 40, required: false },
        { type: 'text', id: 'toc5', kind: 'kicker', maxLength: 40, required: false },
        { type: 'text', id: 'toc6', kind: 'kicker', maxLength: 40, required: false },
        { type: 'text', id: 'editorialBody', kind: 'body', maxLength: 300, required: false }
      ]
    },
    {
      id: 'letter',
      name: 'Letter from Editor',
      layout: 'gb-letter',
      slots: [
        { type: 'image', id: 'letterImage', aspect: 'portrait', required: true, preferredTags: ['group', 'people', 'scenic'] },
        { type: 'text', id: 'letterHeadline', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'letterBody', kind: 'body', maxLength: 500, required: false }
      ]
    },
    {
      id: 'article1',
      name: 'Article 1',
      layout: 'gb-article',
      slots: [
        { type: 'image', id: 'art1ImageLeft', aspect: 'portrait', required: true, preferredTags: ['destination', 'scenic'] },
        { type: 'image', id: 'art1ImageRight', aspect: 'landscape', required: false, preferredTags: ['outdoor', 'nature'] },
        { type: 'text', id: 'art1Headline', kind: 'headline', maxLength: 50, required: true },
        { type: 'text', id: 'art1Body', kind: 'body', maxLength: 600, required: false }
      ]
    },
    {
      id: 'article2',
      name: 'Article 2',
      layout: 'gb-article2',
      slots: [
        { type: 'image', id: 'art2Image', aspect: 'landscape', required: true, preferredTags: ['scenic', 'outdoor'] },
        { type: 'text', id: 'art2Headline', kind: 'headline', maxLength: 50, required: true },
        { type: 'text', id: 'art2Body', kind: 'body', maxLength: 500, required: false }
      ]
    },
    {
      id: 'collage',
      name: 'Photo Collage',
      layout: 'gb-collage',
      slots: [
        { type: 'image', id: 'col1', aspect: 'portrait', required: true, preferredTags: ['group', 'family'] },
        { type: 'image', id: 'col2', aspect: 'landscape', required: false, preferredTags: ['scenic'] },
        { type: 'image', id: 'col3', aspect: 'square', required: false, preferredTags: ['food', 'local'] },
        { type: 'image', id: 'col4', aspect: 'portrait', required: false, preferredTags: ['outdoor'] },
        { type: 'text', id: 'collageTitle', kind: 'headline', maxLength: 30, required: false },
        { type: 'text', id: 'collageBody', kind: 'body', maxLength: 200, required: false }
      ]
    },
    {
      id: 'memories',
      name: 'Memories',
      layout: 'gb-memories',
      slots: [
        { type: 'image', id: 'mem1', aspect: 'any', required: true, preferredTags: ['group', 'activity'] },
        { type: 'image', id: 'mem2', aspect: 'any', required: false, preferredTags: ['scenic', 'sunset'] },
        { type: 'image', id: 'mem3', aspect: 'any', required: false, preferredTags: ['food', 'local'] },
        { type: 'text', id: 'memHeadline', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'memBody', kind: 'body', maxLength: 300, required: false }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'gb-back-cover',
      slots: [
        { type: 'image', id: 'backImage', aspect: 'portrait', required: true, preferredTags: ['hero', 'scenic', 'dramatic'] },
        { type: 'text', id: 'backBrand', kind: 'headline', maxLength: 15, required: false, defaultValue: 'WANDERBOOK' },
        { type: 'text', id: 'backTagline', kind: 'tagline', maxLength: 50, required: false }
      ]
    }
  ]
};
