import { MagazineTemplate } from '@/lib/magazine/types';

export const redBoldTemplate: MagazineTemplate = {
  id: 'red-bold',
  name: 'Red Bold Retro',
  mood: 'Bold · Retro · Adventurous',
  description:
    'A striking red and white travel magazine with bold retro typography. Dramatic layouts and high-contrast editorial design.',
  source: 'canva',
  previewImage: '/templates/red-white/1.png',
  palette: {
    primary: '#E8340A',
    accent: '#FF4500',
    background: '#FFFFFF',
    text: '#1A1A1A',
    light: '#FFF5F3'
  },
  fonts: {
    heading: "'Bebas Neue', Impact, sans-serif",
    subheading: "'Bebas Neue', Impact, sans-serif",
    body: "'Inter', Arial, sans-serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'rb-cover',
      slots: [
        { type: 'image', id: 'coverHeroImage', aspect: 'landscape', required: true, preferredTags: ['hero', 'outdoor', 'adventure', 'travel'] },
        { type: 'text', id: 'coverDestination', kind: 'destination-name', maxLength: 12, required: true },
        { type: 'text', id: 'coverMagazineLabel', kind: 'kicker', maxLength: 20, required: false, defaultValue: 'TRAVEL MAGAZINE' },
        { type: 'text', id: 'coverDate', kind: 'kicker', maxLength: 15, required: false },
        { type: 'text', id: 'coverIssue', kind: 'kicker', maxLength: 15, required: false },
        { type: 'text', id: 'coverFeatureTitle', kind: 'headline', maxLength: 50, required: false }
      ]
    },
    {
      id: 'contents',
      name: 'Table of Contents',
      layout: 'rb-contents',
      slots: [
        { type: 'image', id: 'contentsImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'travel', 'outdoor'] },
        { type: 'text', id: 'item1Title', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'item1Desc', kind: 'body', maxLength: 80, required: false },
        { type: 'text', id: 'item2Title', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'item2Desc', kind: 'body', maxLength: 80, required: false },
        { type: 'text', id: 'item3Title', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'item3Desc', kind: 'body', maxLength: 80, required: false },
        { type: 'text', id: 'item4Title', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'item5Title', kind: 'headline', maxLength: 40, required: false },
        { type: 'text', id: 'item6Title', kind: 'headline', maxLength: 40, required: false }
      ]
    },
    {
      id: 'masthead',
      name: 'Masthead',
      layout: 'rb-masthead',
      slots: [
        { type: 'image', id: 'mastheadImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'outdoor', 'nature'] },
        { type: 'text', id: 'mastheadBody', kind: 'body', maxLength: 300, required: false }
      ]
    },
    {
      id: 'story1',
      name: 'Main Story',
      layout: 'rb-story',
      slots: [
        { type: 'image', id: 'story1Image', aspect: 'portrait', required: true, preferredTags: ['destination', 'scenic', 'dramatic'] },
        { type: 'text', id: 'story1Headline', kind: 'headline', maxLength: 50, required: true },
        { type: 'text', id: 'story1Body', kind: 'body', maxLength: 500, required: false }
      ]
    },
    {
      id: 'story2',
      name: 'Feature Story',
      layout: 'rb-feature',
      slots: [
        { type: 'image', id: 'story2Image1', aspect: 'landscape', required: true, preferredTags: ['outdoor', 'adventure'] },
        { type: 'image', id: 'story2Image2', aspect: 'portrait', required: false, preferredTags: ['local', 'culture'] },
        { type: 'text', id: 'story2Headline', kind: 'headline', maxLength: 40, required: true },
        { type: 'text', id: 'story2Body', kind: 'body', maxLength: 400, required: false }
      ]
    },
    {
      id: 'memories',
      name: 'Photo Grid',
      layout: 'rb-grid',
      slots: [
        { type: 'image', id: 'grid1', aspect: 'any', required: true, preferredTags: ['group', 'activity'] },
        { type: 'image', id: 'grid2', aspect: 'any', required: false, preferredTags: ['scenic'] },
        { type: 'image', id: 'grid3', aspect: 'any', required: false, preferredTags: ['food', 'local'] },
        { type: 'image', id: 'grid4', aspect: 'any', required: false, preferredTags: ['outdoor'] },
        { type: 'text', id: 'gridHeadline', kind: 'headline', maxLength: 30, required: false }
      ]
    },
    {
      id: 'quote',
      name: 'Quote Page',
      layout: 'rb-quote',
      slots: [
        { type: 'image', id: 'quoteImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'calm', 'sunset'] },
        { type: 'text', id: 'quoteText', kind: 'quote', maxLength: 120, required: true },
        { type: 'text', id: 'quoteBody', kind: 'body', maxLength: 200, required: false }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'rb-back-cover',
      slots: [
        { type: 'image', id: 'backImage', aspect: 'portrait', required: true, preferredTags: ['scenic', 'outdoor', 'dramatic'] },
        { type: 'text', id: 'backTagline', kind: 'tagline', maxLength: 60, required: false },
        { type: 'text', id: 'backWebsite', kind: 'kicker', maxLength: 30, required: false, defaultValue: 'WWW.WANDERBOOK.COM' }
      ]
    }
  ]
};
