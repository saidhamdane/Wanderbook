import { MagazineTemplate } from '@/lib/magazine/types';

export const wanderTogetherTemplate: MagazineTemplate = {
  id: 'wander-together',
  name: 'Wander Together',
  mood: 'Elegant · Warm · Family Keepsake',
  description:
    'A timeless family travel magazine. Warm tones, editorial spreads, and generous storytelling.',
  palette: {
    primary: '#1B2A4A',
    accent: '#8B7355',
    background: '#FFFFFF',
    text: '#1A1A1A',
    light: '#F8F5F0'
  },
  fonts: {
    heading: "'Playfair Display', serif",
    subheading: "'Playfair Display', serif",
    body: "'Montserrat', sans-serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'wt-cover',
      slots: [
        { type: 'image', id: 'coverHeroImage', aspect: 'portrait', required: true, preferredTags: ['hero', 'group', 'outdoor', 'scenic'] },
        { type: 'text', id: 'coverTitle', kind: 'headline', maxLength: 10, required: true, defaultValue: 'WANDER' },
        { type: 'text', id: 'coverSubtitle', kind: 'subheadline', maxLength: 15, required: true, defaultValue: 'Together' },
        { type: 'text', id: 'coverMagazineLabel', kind: 'kicker', maxLength: 20, required: false, defaultValue: 'TRAVEL MAGAZINE' },
        { type: 'text', id: 'coverDestination', kind: 'destination-name', maxLength: 25, required: true },
        { type: 'text', id: 'coverSubdestination', kind: 'subheadline', maxLength: 20, required: false },
        { type: 'text', id: 'coverYear', kind: 'year', maxLength: 4, required: false },
        { type: 'text', id: 'coverBullet1', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'coverBullet2', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'coverBullet3', kind: 'kicker', maxLength: 60, required: false },
        { type: 'text', id: 'coverBullet4', kind: 'kicker', maxLength: 60, required: false }
      ]
    },
    {
      id: 'contents',
      name: 'Contents',
      layout: 'wt-contents',
      slots: [
        { type: 'text', id: 'contentsHeading', kind: 'headline', maxLength: 12, required: false, defaultValue: 'CONTENTS' },
        { type: 'text', id: 'contentsItem1', kind: 'contents-list', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem2', kind: 'contents-list', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem3', kind: 'contents-list', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem4', kind: 'contents-list', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem5', kind: 'contents-list', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem6', kind: 'contents-list', maxLength: 50, required: false },
        { type: 'image', id: 'contentsImage', aspect: 'portrait', required: true, preferredTags: ['aerial', 'scenic', 'landscape'] }
      ]
    },
    {
      id: 'welcome',
      name: 'Welcome',
      layout: 'wt-welcome',
      slots: [
        { type: 'text', id: 'welcomeHeadline1', kind: 'headline', maxLength: 20, required: true },
        { type: 'text', id: 'welcomeHeadline2', kind: 'headline', maxLength: 20, required: false },
        { type: 'text', id: 'welcomeSubhead', kind: 'subheadline', maxLength: 30, required: false },
        { type: 'text', id: 'welcomeBody', kind: 'body', maxLength: 450, required: true },
        { type: 'image', id: 'welcomeImage', aspect: 'portrait', required: true, preferredTags: ['group', 'family', 'beach', 'golden-hour'] }
      ]
    },
    {
      id: 'destination',
      name: 'Destination',
      layout: 'wt-destination',
      slots: [
        { type: 'text', id: 'destHeadline', kind: 'headline', maxLength: 40, required: true },
        { type: 'text', id: 'destBody', kind: 'body', maxLength: 250, required: true },
        { type: 'text', id: 'destLocation', kind: 'kicker', maxLength: 30, required: false },
        { type: 'image', id: 'destImage', aspect: 'portrait', required: true, preferredTags: ['scenic', 'nature', 'landmark', 'outdoor'] }
      ]
    },
    {
      id: 'taste',
      name: 'Eat Well',
      layout: 'wt-taste',
      slots: [
        { type: 'text', id: 'tasteHeadline', kind: 'headline', maxLength: 35, required: true },
        { type: 'text', id: 'tasteBody', kind: 'body', maxLength: 200, required: false },
        { type: 'image', id: 'tasteImage1', aspect: 'square', required: true, preferredTags: ['food'] },
        { type: 'image', id: 'tasteImage2', aspect: 'square', required: false, preferredTags: ['food'] },
        { type: 'image', id: 'tasteImage3', aspect: 'square', required: false, preferredTags: ['food'] },
        { type: 'image', id: 'tasteImage4', aspect: 'square', required: false, preferredTags: ['food'] },
        { type: 'text', id: 'tasteCaption1', kind: 'caption', maxLength: 25, required: false },
        { type: 'text', id: 'tasteCaption2', kind: 'caption', maxLength: 25, required: false },
        { type: 'text', id: 'tasteCaption3', kind: 'caption', maxLength: 25, required: false },
        { type: 'text', id: 'tasteCaption4', kind: 'caption', maxLength: 25, required: false }
      ]
    },
    {
      id: 'memories',
      name: 'Memories',
      layout: 'wt-memories',
      slots: [
        { type: 'text', id: 'memoriesHeadline', kind: 'headline', maxLength: 25, required: true },
        { type: 'image', id: 'mem1', aspect: 'landscape', required: true, preferredTags: ['group', 'activity', 'outdoor'] },
        { type: 'image', id: 'mem2', aspect: 'portrait', required: false, preferredTags: ['scenic', 'landmark'] },
        { type: 'image', id: 'mem3', aspect: 'portrait', required: false, preferredTags: ['group', 'family'] },
        { type: 'image', id: 'mem4', aspect: 'square', required: false, preferredTags: ['any'] },
        { type: 'image', id: 'mem5', aspect: 'square', required: false, preferredTags: ['sunset', 'scenic'] }
      ]
    },
    {
      id: 'quote',
      name: 'Quote',
      layout: 'wt-quote',
      slots: [
        { type: 'text', id: 'quoteText', kind: 'quote', maxLength: 80, required: true },
        { type: 'text', id: 'quoteAttribution', kind: 'caption', maxLength: 60, required: false },
        { type: 'text', id: 'quoteSignoff', kind: 'kicker', maxLength: 30, required: false },
        { type: 'image', id: 'quoteImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'road', 'calm', 'sunset'] }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'wt-back-cover',
      slots: [
        { type: 'image', id: 'backImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'outdoor', 'road', 'nature'] },
        { type: 'text', id: 'backBrand', kind: 'kicker', maxLength: 20, required: false, defaultValue: 'WANDER TOGETHER' },
        { type: 'text', id: 'backTagline', kind: 'tagline', maxLength: 40, required: false }
      ]
    }
  ]
};
