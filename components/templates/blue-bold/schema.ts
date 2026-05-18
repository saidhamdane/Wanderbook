import { MagazineTemplate } from '@/lib/magazine/types';

export const blueBoldTemplate: MagazineTemplate = {
  id: 'blue-bold',
  name: 'Blue Bold',
  mood: 'Bold · Editorial · Confident',
  description:
    'A cobalt and ink magazine with massive type and dramatic single-image spreads.',
  palette: {
    primary: '#0052CC',
    accent: '#FF4444',
    background: '#FFFFFF',
    text: '#1A1A1A',
    light: '#F0F4FF'
  },
  fonts: {
    heading: "'Oswald', sans-serif",
    subheading: "'Oswald', sans-serif",
    body: "'Inter', sans-serif"
  },
  pages: [
    {
      id: 'cover',
      name: 'Cover',
      layout: 'bb-cover',
      slots: [
        { type: 'image', id: 'coverHeroImage', aspect: 'portrait', required: true, preferredTags: ['hero', 'mountain', 'scenic', 'outdoor'] },
        { type: 'text', id: 'coverBigTitle', kind: 'headline', maxLength: 10, required: true, defaultValue: 'TRAVEL' },
        { type: 'text', id: 'coverSeason', kind: 'kicker', maxLength: 25, required: false, defaultValue: 'SUMMER ISSUE' },
        { type: 'text', id: 'coverStatNumber', kind: 'subheadline', maxLength: 6, required: false, defaultValue: '25+' },
        { type: 'text', id: 'coverStatLabel', kind: 'kicker', maxLength: 30, required: false, defaultValue: 'HIDDEN PLACES' },
        { type: 'text', id: 'coverTagline', kind: 'body', maxLength: 120, required: false },
        { type: 'text', id: 'coverAuthor', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'coverIssueDate', kind: 'kicker', maxLength: 20, required: false },
        { type: 'text', id: 'coverWebsite', kind: 'kicker', maxLength: 30, required: false, defaultValue: 'WWW.WANDERBOOK.COM' }
      ]
    },
    {
      id: 'contents',
      name: 'Contents',
      layout: 'bb-contents',
      slots: [
        { type: 'text', id: 'contentsTitle', kind: 'headline', maxLength: 12, required: false, defaultValue: 'CONTENTS' },
        { type: 'text', id: 'contentsItem1', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem2', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem3', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem4', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem5', kind: 'kicker', maxLength: 50, required: false },
        { type: 'text', id: 'contentsItem6', kind: 'kicker', maxLength: 50, required: false },
        { type: 'image', id: 'contentsImage', aspect: 'landscape', required: false, preferredTags: ['scenic', 'aerial'] }
      ]
    },
    {
      id: 'intro',
      name: 'Introduction',
      layout: 'bb-intro',
      slots: [
        { type: 'text', id: 'introHeading', kind: 'headline', maxLength: 40, required: true },
        { type: 'text', id: 'introStat', kind: 'subheadline', maxLength: 6, required: false },
        { type: 'text', id: 'introStatLabel', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'introBody', kind: 'body', maxLength: 600, required: true },
        { type: 'image', id: 'introImage', aspect: 'portrait', required: true, preferredTags: ['mountain', 'scenic'] }
      ]
    },
    {
      id: 'about',
      name: 'About',
      layout: 'bb-about',
      slots: [
        { type: 'text', id: 'aboutHeading', kind: 'headline', maxLength: 30, required: true },
        { type: 'text', id: 'aboutBody', kind: 'body', maxLength: 400, required: true },
        { type: 'image', id: 'aboutImage', aspect: 'portrait', required: false, preferredTags: ['group', 'family'] }
      ]
    },
    {
      id: 'story',
      name: 'Story',
      layout: 'bb-story',
      slots: [
        { type: 'text', id: 'storyHeadline', kind: 'headline', maxLength: 50, required: true },
        { type: 'image', id: 'storyImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'outdoor'] },
        { type: 'text', id: 'storyCaption', kind: 'caption', maxLength: 60, required: false }
      ]
    },
    {
      id: 'discovery',
      name: 'Discovery',
      layout: 'bb-discovery',
      slots: [
        { type: 'text', id: 'discoveryHeadline', kind: 'headline', maxLength: 40, required: true },
        { type: 'text', id: 'discoveryBody', kind: 'body', maxLength: 350, required: true },
        { type: 'text', id: 'discoveryQuote', kind: 'quote', maxLength: 60, required: false },
        { type: 'image', id: 'discoveryImage', aspect: 'portrait', required: true, preferredTags: ['scenic', 'nature'] }
      ]
    },
    {
      id: 'highlights',
      name: 'Highlights',
      layout: 'bb-highlights',
      slots: [
        { type: 'image', id: 'hl1Image', aspect: 'portrait', required: false, preferredTags: ['scenic'] },
        { type: 'image', id: 'hl2Image', aspect: 'portrait', required: false, preferredTags: ['food'] },
        { type: 'image', id: 'hl3Image', aspect: 'portrait', required: false, preferredTags: ['group'] },
        { type: 'text', id: 'hl1Title', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'hl2Title', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'hl3Title', kind: 'kicker', maxLength: 30, required: false },
        { type: 'text', id: 'hl1Body', kind: 'caption', maxLength: 80, required: false },
        { type: 'text', id: 'hl2Body', kind: 'caption', maxLength: 80, required: false },
        { type: 'text', id: 'hl3Body', kind: 'caption', maxLength: 80, required: false }
      ]
    },
    {
      id: 'back-cover',
      name: 'Back Cover',
      layout: 'bb-back-cover',
      slots: [
        { type: 'image', id: 'backImage', aspect: 'landscape', required: true, preferredTags: ['scenic', 'sunset'] },
        { type: 'text', id: 'backTagline', kind: 'tagline', maxLength: 60, required: false },
        { type: 'text', id: 'backBrand', kind: 'headline', maxLength: 10, required: false, defaultValue: 'TRAVEL' }
      ]
    }
  ]
};
