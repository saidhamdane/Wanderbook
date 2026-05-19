import OpenAI from 'openai';
import { getTemplateById } from './template-registry';

export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian'
};

export const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_NAMES);

export function normalizeLanguage(value: string | undefined | null): string {
  if (!value) return 'en';
  return SUPPORTED_LANGUAGES.includes(value) ? value : 'en';
}

type CopyInput = {
  destination: string;
  travelers: string;
  style: string;
  templateId: string;
  notes?: string;
  language: string;
};

function slotIdsForTemplate(templateId: string): string[] {
  const template = getTemplateById(templateId);
  const ids: string[] = [];
  for (const page of template.pages) {
    for (const slot of page.slots) {
      if (slot.type === 'text') ids.push(slot.id);
    }
  }
  return ids;
}

function defaultsFor(input: CopyInput): Record<string, string> {
  const d = input.destination;
  const y = String(new Date().getFullYear());
  return {
    coverTitle: 'WANDER',
    coverSubtitle: 'Together',
    coverMagazineLabel: 'TRAVEL MAGAZINE',
    coverDestination: d,
    coverSubdestination: 'A Family Journey',
    coverYear: y,
    coverBullet1: 'GOLDEN HOURS · HIDDEN COVES',
    coverBullet2: 'SMALL TOWN STORIES',
    coverBullet3: 'EAT WELL, WALK FAR',
    coverBullet4: 'FAMILY FIELD GUIDE',
    contentsHeading: 'CONTENTS',
    contentsItem1: 'A Welcome Letter',
    contentsItem2: 'The Destination',
    contentsItem3: 'Eat Well',
    contentsItem4: 'Our Favourite Memories',
    contentsItem5: 'Words To Keep',
    contentsItem6: 'Back Cover',
    welcomeHeadline1: 'Welcome to',
    welcomeHeadline2: d,
    welcomeSubhead: 'A family edition',
    welcomeBody:
      'The morning ' + input.travelers + ' arrived in ' + d + ', the air smelled of salt and warm stone. We dropped the bags and ran straight for the water. This is the magazine we made afterwards — short stories, favourite meals, and the small ordinary moments that we want to keep forever.',
    destHeadline: 'A slow walk through ' + d,
    destBody:
      'There is a particular light in ' + d + ' that arrives just before sunset and turns every building gold. We walked for hours that first evening, the kids stopping to point at every window box. By the time we sat down for dinner none of us could speak — just smiled into our plates, grateful and tired.',
    destLocation: d.toUpperCase(),
    tasteHeadline: 'Eating our way through ' + d,
    tasteBody:
      'Two markets, three bakeries, one long lunch by the water. The family verdict: anything fried, anything with lemon, and as much bread as the table will hold.',
    tasteCaption1: 'MARKET BREAKFAST',
    tasteCaption2: 'LONG LUNCH',
    tasteCaption3: 'WALKING SNACKS',
    tasteCaption4: 'LATE DESSERT',
    memoriesHeadline: 'Moments we want to keep',
    quoteText:
      'Travel is the small print of a family — the things we did when nobody was watching.',
    quoteAttribution: 'A note from the road',
    quoteSignoff: '— ' + input.travelers,
    backBrand: 'WANDER TOGETHER',
    backTagline: 'A keepsake from ' + d + ', ' + y,
    coverBigTitle: 'TRAVEL',
    coverSeason: y + ' EDITION',
    coverStatNumber: '12',
    coverStatLabel: 'HIDDEN PLACES',
    coverTagline:
      'Explore mountains, beaches, cities and beyond — a family field guide to ' + d + '.',
    coverAuthor: 'BY ' + (input.travelers || 'OUR FAMILY').toUpperCase(),
    coverIssueDate: y + ' · ISSUE 01',
    coverWebsite: 'WWW.WANDERBOOK.COM',
    contentsTitle: 'CONTENTS',
    introHeading: 'Beyond the obvious: a family trip to ' + d,
    introStat: '26',
    introStatLabel: 'MOST HIDDEN PLACES',
    introBody:
      'We left on a Wednesday and came back changed. ' + d + ' was supposed to be a quiet week away with ' + input.travelers + ', but the island had different plans. There were hikes that became picnics, dinners that became dances, and a thousand small jokes that only we will ever understand. This issue gathers the best of it.',
    introImage: '',
    aboutHeading: 'About this issue',
    aboutBody:
      'Every page of this magazine is built from real photos, real days, and a real ' + input.travelers + ' figuring out a new place together. We wrote it for ourselves first, then for anyone who might want to do the same thing.',
    storyHeadline: 'Every trip writes its own story',
    storyCaption: 'CAPTURE THE TRAVEL MOMENT',
    discoveryHeadline: 'New places, old souls',
    discoveryBody:
      'The best afternoon of the trip was the one we did not plan. We were lost, the map was useless, and the kids were tired. Then a small bakery appeared with chairs in the sun and a dog asleep at the door. We stayed an hour.',
    discoveryQuote: 'Wander often, stay curious, eat the bread warm.',
    hl1Title: 'CLIFF WALK',
    hl1Body: 'A short hike that turned into the best view of the trip.',
    hl2Title: 'BAKERY MORNINGS',
    hl2Body: 'Warm pastries before anyone else was awake.',
    hl3Title: 'SUNSET PORCH',
    hl3Body: 'Quiet, golden, slightly windy. We did not say much.',
    coverMagazineName: 'explore',
    coverSubtitle2: 'Magazine',
    coverVolume: 'VOLUME 01 · ' + y,
    coverHighlight1: 'Beyond the cloud',
    coverHighlight2: 'Capture the travel moment',
    coverHighlight3: 'Most hidden place',
    coverMainTitle: 'A field guide for ' + input.travelers + ' in ' + d,
    openerHeadline: 'START YOUR TRAVELING TODAY',
    mastheadTitle: 'MASTHEAD',
    mastheadBody:
      'Edited by ' + input.travelers + '. Photography by everyone in the car. Layout assembled while the kids slept. This issue is dedicated to ' + d + ' and to every place that ever made us slow down.',
    section1: 'BEYOND THE CLOUD',
    section2: 'CAPTURE THE MOMENT',
    section3: 'MOST HIDDEN PLACE',
    section4: 'EAT, WALK, REPEAT',
    section5: 'A LETTER HOME',
    destName: d,
    destSection: 'DESTINATION FEATURE',
    destHeadline2: 'A slow chapter in ' + d,
    regionName: d.toUpperCase(),
    regionBody:
      'The road in had a strange honesty to it — empty, golden, faintly salty. ' + d + ' did not try to impress us. It just opened the door and let us in. By the end of the week we felt half-local: knew which café opened first, which bakery to skip, which corner caught the last of the sun.',
    cultureVerticalTitle: 'CULTURE',
    cultureBody:
      'In ' + d + ', the smallest details are the loudest. A blue door against a white wall. A grandmother braiding garlic on a step. A boy chasing pigeons across a square. We took more pictures of the everyday than the grand.',
    cultureCaption: 'EVERYDAY ' + d.toUpperCase(),
    coverLabel: 'Magazine',
    coverStat1Number: '12',
    coverStat1Label: 'BEACHES',
    coverStat1Body: 'From wild to tame, mapped.',
    coverStat2Number: '8',
    coverStat2Label: 'BAKERIES',
    coverStat2Body: 'Tested before noon.',
    coverStat3Number: '04',
    coverStat3Label: 'SUNSETS',
    coverStat3Body: 'All worth a porch.',
    coverStat4Number: '∞',
    coverStat4Label: 'MOMENTS',
    coverStat4Body: 'Quiet ones especially.',
    item1: 'WELCOME · NOTES FROM THE ROAD',
    item2: 'THE DESTINATION',
    item3: 'EAT WELL',
    item4: 'PHOTO GRID · MOMENTS',
    item5: 'MANUAL · WHAT TO PACK',
    item6: 'BACK MATTER',
    introTitle: 'Travel',
    introBody1:
      'A short field journal from ' + d + ', written by ' + input.travelers + ' and laid out somewhere between the hotel desk and the kitchen table.',
    introBody2:
      'We tried not to over-plan. The best moments happened when we put the map away — a beach at low tide, a quiet square, a bakery that opened at five.',
    aboutTitle: 'A note about us',
    gridCaption1: 'MORNING LIGHT',
    gridCaption2: 'BAKERY 06:30',
    gridCaption3: 'KIDS RUNNING',
    gridCaption4: 'WIND',
    gridCaption5: 'A LONG LUNCH',
    gridCaption6: 'LAST SUNSET',
    manualTitle: 'The trip manual',
    check1: 'Sun cream that actually works for kids.',
    check2: 'A light jacket for the evening wind.',
    check3: 'Cash for the early bakery.',
    check4: 'A book you will not finish but love anyway.',
    servicesTitle: 'How we travel',
    servicesBody:
      'We move slowly. One town a day, two cafés, one walk, one nap. We bring fewer clothes than we think we need and more snacks than seems reasonable. This is what works for ' + input.travelers + '.',
    coverStatNumber2: '25+',
    coverStatLabel2: 'HIDDEN PLACES'
  };
}

function buildUserPrompt(input: CopyInput): string {
  const slotIds = slotIdsForTemplate(input.templateId);
  const slotList = slotIds.map((id) => '- ' + id).join('\n');
  const notes = input.notes ? '\n\nFamily notes: ' + input.notes : '';
  const languageName = LANGUAGE_NAMES[input.language] ?? 'English';
  return [
    'Write the editorial copy for a personal family travel magazine.',
    'Destination: ' + input.destination + '.',
    'Travelers: ' + input.travelers + '.',
    'Preferred tone: ' + input.style + '.' + notes,
    '',
    'Return ONLY a JSON object whose keys match exactly these slot IDs, with string values:',
    slotList,
    '',
    'Rules:',
    '- Write every value in ' + languageName + '. Do not mix languages. Keep place names and proper nouns in their original spelling.',
    '- Be specific to ' + input.destination + '. Reference real local food, light, terrain.',
    '- Tone should feel like a polished magazine, warm and intimate, never generic.',
    '- Keep headlines short. Keep body copy under the implied magazine length.',
    '- Do not use markdown. Do not include any text outside the JSON.'
  ].join('\n');
}

export async function generateEditorialCopy(
  input: CopyInput
): Promise<Record<string, string>> {
  const defaults = defaultsFor(input);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return defaults;

  try {
    const client = new OpenAI({ apiKey });
    const languageName = LANGUAGE_NAMES[input.language] ?? 'English';
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a senior editorial writer for a luxury travel magazine writing in ' +
            languageName +
            '. Respond ONLY with valid JSON, no markdown, no explanation. Every string value must be in ' +
            languageName +
            '.'
        },
        { role: 'user', content: buildUserPrompt(input) }
      ]
    });
    const raw = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...defaults, ...parsed };
    }
    return defaults;
  } catch {
    return defaults;
  }
}
