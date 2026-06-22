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
  activityType?: string;
  activityLabel?: string;
  activityLabelsByLanguage?: Record<'en' | 'es', string>;
  pagePlan?: Record<'en' | 'es', string[]>;
  ctaLabels?: Record<'en' | 'es', string>;
  localTipsTopics?: Record<'en' | 'es', string[]>;
  copyTone?: string;
  prohibitedImageKeywords?: string[];
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

export function normalizeSpanishSentences(text: string): string {
  const properNouns = ['Fuerteventura', 'Fuerte Experience', 'WhatsApp', 'Buggy', 'Instagram', 'Google'];
  return text
    .replace(/^\s*([a-záéíóúüñ])/u, (match, char) => match.replace(char, char.toUpperCase()))
    .replace(/([a-záéíóúüñ\d,;])\s+([A-ZÁÉÍÓÚÜÑ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)/g, (match, prev, word, offset, source) => {
      const before = source.slice(0, offset + 1);
      const repeatedBuggy = word === 'Buggy' && /\bbuggy$/i.test(before);
      if (!repeatedBuggy && properNouns.some((noun) => word === noun || noun.startsWith(`${word} `))) return match;
      return `${prev}. ${word}`;
    })
    .replace(/(^|[.!?]\s+)([a-záéíóúüñ])/g, (_, separator, char) => separator + char.toUpperCase());
}

function defaultsFor(input: CopyInput): Record<string, string> {
  const d = input.destination;
  const y = String(new Date().getFullYear());
  const defaults = {
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
    coverStatLabel2: 'HIDDEN PLACES',
    // Red Bold Retro template slot defaults — overlay-only template,
    // these prevent any "Lorem ipsum" from showing through the Canva PNG.
    coverDate: new Date()
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      .toUpperCase(),
    coverIssue: 'ISSUE NO. 01',
    coverFeatureTitle:
      'A JOURNEY THROUGH THE HEART OF ' + d.toUpperCase(),
    item1Title: 'DISCOVERING ' + d.toUpperCase(),
    item1Desc: 'A journey through the landscapes and culture of ' + d + '.',
    item2Title: 'LOCAL FLAVORS',
    item2Desc: 'The tastes and traditions that define this destination.',
    item3Title: 'HIDDEN GEMS',
    item3Desc: 'Places most visitors to ' + d + ' never find.',
    item4Title: 'TRAVEL TIPS',
    item5Title: 'MEMORIES',
    item6Title: 'UNTIL NEXT TIME',
    story1Headline: 'THE HEART OF ' + d.toUpperCase(),
    story1Body:
      'Every great journey begins with a single step. Our time in ' + d + ' was no different — each day brought new landscapes, new faces, and new stories to carry home. ' + input.travelers + ' walked slowly, ate well, and stopped often.',
    story2Headline: 'WHERE THE ROAD LEADS',
    story2Body:
      'The roads of ' + d + ' have a way of surprising you. Around every corner a new vista opens up — a quiet beach, a stone village, a stranger waving from a doorway. We learned to keep the map folded and the windows down.',
    gridHeadline: 'MEMORIES',
    quoteBody:
      'Our journey to ' + d + ' reminded us why we travel — not to escape life, but to keep life from escaping us.'
  };
  if (!input.activityType) return defaults;
  return { ...defaults, ...activityDefaultsFor(input, y) };
}

function activityDefaultsFor(input: CopyInput, year: string): Record<string, string> {
  const d = input.destination;
  const lang = input.language === 'es' ? 'es' : 'en';
  const label = input.activityLabelsByLanguage?.[lang] || input.activityLabel || (lang === 'es' ? 'Experiencia en Fuerteventura' : 'Fuerteventura Experience');
  const plan = input.pagePlan?.[lang] || [];
  const cta = input.ctaLabels?.[lang] || (lang === 'es' ? 'Reserva tu proxima experiencia' : 'Book your next experience');
  const topics = input.localTipsTopics?.[lang] || [];
  const isSpanish = lang === 'es';
  const finish = (result: Record<string, string>) => {
    if (!isSpanish) return result;
    return Object.fromEntries(
      Object.entries(result).map(([key, value]) => [key, normalizeSpanishSentences(value)])
    ) as Record<string, string>;
  };

  const common = isSpanish
    ? {
        edition: 'EDICION ' + year,
        'cover-title': label.toUpperCase(),
        'cover-kicker': 'FUERTEVENTURA',
        'cover-line-1': plan[0] || label + ' en ' + d,
        'cover-line-2': 'Una revista creada para recordar la experiencia',
        'cover-year': year,
        'cover-stat': '8 PAGINAS · UNA EXPERIENCIA',
        'toc-item-1': plan[1] || 'Bienvenida',
        'toc-item-2': plan[2] || 'Sobre la empresa',
        'toc-item-3': plan[3] || 'La isla',
        'toc-item-4': plan[4] || 'Momentos destacados',
        'toc-item-5': plan[5] || 'Historia en fotos',
        'toc-item-6': plan[7] || 'Reserva',
        'toc-caption': label + ' · ' + d,
        'intro-title': 'Bienvenido a tu ' + label.toLowerCase(),
        'intro-body': 'Esta revista recoge una experiencia real en ' + d + ': el ambiente, el recorrido, los detalles de la empresa y los momentos que hacen que el recuerdo sea propio.',
        'intro-byline': 'Creado para viajeros de ' + d,
        'feature-title': plan[3] || 'Fuerteventura en primera persona',
        'feature-body': 'La experiencia se entiende mejor desde el terreno: luz volcanica, caminos abiertos, costa y pueblos cercanos segun el ritmo de la actividad. Cada pagina mantiene el foco en ' + label.toLowerCase() + '.',
        'feature-stat-1': topics[0] || 'Contexto local',
        'feature-stat-2': topics[1] || 'Momentos reales',
        'feature-stat-3': topics[2] || 'Recuerdo personal',
        'gallery-caption-1': 'Llegada',
        'gallery-caption-2': 'Paisaje',
        'gallery-caption-3': 'Detalle',
        'gallery-caption-4': 'Ruta',
        'gallery-caption-5': 'Recuerdo',
        'story-title': plan[4] || 'Momentos de la experiencia',
        'story-lead': 'Una historia visual de ' + label.toLowerCase() + ' en ' + d + '.',
        'story-body': 'Las mejores paginas salen de los detalles concretos: el punto de encuentro, la energia del grupo, el paisaje y la manera en que la empresa acompana cada momento.',
        'quote-text': 'Un buen recuerdo no necesita exagerar: basta con volver a mirar el dia y reconocerlo.',
        'quote-attr': 'Nota de la experiencia',
        'back-title': cta,
        'back-contact': 'Gracias por viajar con nosotros',
      }
    : {
        edition: year + ' EDITION',
        'cover-title': label.toUpperCase(),
        'cover-kicker': 'FUERTEVENTURA',
        'cover-line-1': plan[0] || label + ' in ' + d,
        'cover-line-2': 'A magazine made to remember the experience',
        'cover-year': year,
        'cover-stat': '8 PAGES · ONE EXPERIENCE',
        'toc-item-1': plan[1] || 'Welcome',
        'toc-item-2': plan[2] || 'About the company',
        'toc-item-3': plan[3] || 'The island',
        'toc-item-4': plan[4] || 'Highlights',
        'toc-item-5': plan[5] || 'Photo story',
        'toc-item-6': plan[7] || 'Book again',
        'toc-caption': label + ' · ' + d,
        'intro-title': 'Welcome to your ' + label,
        'intro-body': 'This magazine gathers one real experience in ' + d + ': the atmosphere, the route, the company details and the moments that make the memory feel personal.',
        'intro-byline': 'Created for travelers in ' + d,
        'feature-title': plan[3] || 'Fuerteventura up close',
        'feature-body': 'The experience is best understood through the setting: volcanic light, open roads, coast and villages shaped around the rhythm of the activity. Every page keeps the focus on ' + label + '.',
        'feature-stat-1': topics[0] || 'Local context',
        'feature-stat-2': topics[1] || 'Real moments',
        'feature-stat-3': topics[2] || 'Personal memory',
        'gallery-caption-1': 'Arrival',
        'gallery-caption-2': 'Landscape',
        'gallery-caption-3': 'Detail',
        'gallery-caption-4': 'Route',
        'gallery-caption-5': 'Memory',
        'story-title': plan[4] || 'Experience highlights',
        'story-lead': 'A visual story of ' + label + ' in ' + d + '.',
        'story-body': 'The best pages come from concrete details: the meeting point, the energy of the group, the landscape and the way the company shapes each moment.',
        'quote-text': 'A good memory does not need exaggeration: it only needs the day to feel true when you see it again.',
        'quote-attr': 'Experience note',
        'back-title': cta,
        'back-contact': 'Thank you for travelling with us',
      };

  if (input.activityType === 'buggy-adventure') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'AVENTURA EN BUGGY' : 'BUGGY ADVENTURE',
      'intro-title': isSpanish ? 'La aventura empieza en tierra volcanica' : 'The adventure starts on volcanic ground',
      'intro-body': isSpanish
        ? 'Tu aventura en buggy en Fuerteventura recorre caminos abiertos, terreno volcanico y rincones donde la isla se siente directa, seca y llena de energia.'
        : 'Your buggy adventure in Fuerteventura follows open roads, volcanic ground and corners where the island feels direct, dry and full of energy.',
      'feature-title': isSpanish ? 'El lado todoterreno de Fuerteventura' : 'The off-road side of Fuerteventura',
      'feature-body': isSpanish
        ? 'Polvo, pistas volcanicas y paisajes abiertos marcan el ritmo. Esta pagina habla solo de la ruta, la conduccion y la sensacion de explorar Fuerteventura desde un buggy.'
        : 'Dust, volcanic tracks and open landscapes set the pace. This page stays with the route, the drive and the feeling of exploring Fuerteventura from a buggy.',
      'story-title': isSpanish ? 'Ruta, motor y paisaje' : 'Route, engine and landscape',
      'story-lead': isSpanish ? 'Una historia de aventura en buggy, caminos de tierra y miradores abiertos.' : 'A story of buggy adventure, dirt roads and open viewpoints.',
      'story-body': isSpanish
        ? 'Las fotos del cliente cuentan la parte mas viva del dia: prepararse, salir a la ruta, sentir el terreno y volver con la ropa marcada por el polvo.'
        : 'The customer photos tell the liveliest part of the day: getting ready, heading onto the route, feeling the ground and returning with dust on every layer.',
      'feature-stat-1': isSpanish ? 'Pistas volcanicas' : 'Volcanic tracks',
      'feature-stat-2': isSpanish ? 'Ruta todoterreno' : 'Off-road route',
      'feature-stat-3': isSpanish ? 'Aventura en buggy' : 'Buggy adventure',
    });
  }

  if (input.activityType === 'boat-tour') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'TOUR EN BARCO' : 'BOAT TOUR',
      'intro-title': isSpanish ? 'Fuerteventura desde el mar' : 'Fuerteventura from the sea',
      'intro-body': isSpanish
        ? 'El viaje mira la isla desde el Atlantico: mar, barco, costa y luz abierta para recordar una salida tranquila y especial.'
        : 'This journey sees the island from the Atlantic: sea, boat, coast and open light for a calm, memorable trip.',
      'feature-title': isSpanish ? 'Costa y Atlantico' : 'Coast and Atlantic',
      'feature-body': isSpanish
        ? 'El mar cambia la forma de ver Fuerteventura. Desde el barco aparecen la costa, el viento y esa luz azul que hace que el dia se quede en la memoria.'
        : 'The sea changes how Fuerteventura looks. From the boat come the coast, the wind and the blue light that keeps the day in memory.',
      'story-title': isSpanish ? 'Momentos de mar y costa' : 'Sea and coast highlights',
      'story-lead': isSpanish ? 'Una historia de barco, mar y costa en Fuerteventura.' : 'A story of boat, sea and coast in Fuerteventura.',
      'feature-stat-1': isSpanish ? 'Mar' : 'Sea',
      'feature-stat-2': isSpanish ? 'Barco' : 'Boat',
      'feature-stat-3': isSpanish ? 'Costa' : 'Coast',
    });
  }

  if (input.activityType === 'tour-guide') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'GUIA TURISTICO' : 'TOUR GUIDE',
      'intro-title': isSpanish ? 'La isla con una guia cercana' : 'The island with a local guide',
      'intro-body': isSpanish
        ? 'Una ruta guiada convierte Fuerteventura en una historia: guia, isla, pueblos, miradores y detalles que no siempre aparecen en un mapa.'
        : 'A guided route turns Fuerteventura into a story: guide, island, villages, viewpoints and details that do not always appear on a map.',
      'feature-title': isSpanish ? 'Historias autenticas de la isla' : 'Authentic island stories',
      'feature-body': isSpanish
        ? 'La ruta une paisaje y contexto local. Con una guia clara, cada parada ayuda a entender la isla, sus caminos y sus pueblos con mas profundidad.'
        : 'The route connects landscape and local context. With a clear guide, each stop helps travelers understand the island, its roads and its villages more deeply.',
      'story-title': isSpanish ? 'Ruta, isla y memoria' : 'Route, island and memory',
      'story-lead': isSpanish ? 'Una historia de guia local, ruta y lugares visitados.' : 'A story of local guiding, route and places visited.',
      'feature-stat-1': isSpanish ? 'Guia' : 'Guide',
      'feature-stat-2': isSpanish ? 'Isla' : 'Island',
      'feature-stat-3': isSpanish ? 'Ruta' : 'Route',
    });
  }

  if (input.activityType === 'surf-camp') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'ESCUELA DE SURF' : 'SURF CAMP',
      'intro-title': isSpanish ? 'El ritmo del mar en Fuerteventura' : 'The rhythm of the sea in Fuerteventura',
      'intro-body': isSpanish
        ? 'Tu semana de surf en Fuerteventura combina clases, olas y la energia de una isla pensada para surfear.'
        : 'Your surf week in Fuerteventura combines lessons, waves and the energy of an island built for surfing.',
      'feature-title': isSpanish ? 'Olas, clases y progresion' : 'Waves, lessons and progression',
      'feature-body': isSpanish
        ? 'El viento y el swell de Fuerteventura ofrecen condiciones distintas cada dia. La escuela adapta cada sesion al nivel y al estado del mar.'
        : 'The wind and swell of Fuerteventura offer different conditions every day. The camp adapts each session to level and sea state.',
      'story-title': isSpanish ? 'En el agua y en la orilla' : 'In the water and on the shore',
      'story-lead': isSpanish ? 'Una historia de olas, clases y progresion en Fuerteventura.' : 'A story of waves, lessons and progression in Fuerteventura.',
      'feature-stat-1': isSpanish ? 'Olas' : 'Waves',
      'feature-stat-2': isSpanish ? 'Clases' : 'Lessons',
      'feature-stat-3': isSpanish ? 'Progresion' : 'Progression',
    });
  }

  if (input.activityType === 'villa-rental') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'ALQUILER VACACIONAL' : 'HOLIDAY RENTAL',
      'intro-title': isSpanish ? 'Una estancia a tu ritmo en Fuerteventura' : 'A stay at your own pace in Fuerteventura',
      'intro-body': isSpanish
        ? 'Tu estancia en Fuerteventura tiene la comodidad de un hogar local y la libertad de descubrir la isla sin prisa.'
        : 'Your stay in Fuerteventura has the comfort of a local home and the freedom to discover the island at your own pace.',
      'feature-title': isSpanish ? 'Vivir la isla como local' : 'Living the island like a local',
      'feature-body': isSpanish
        ? 'Mercados, playas cercanas, atardeceres desde la terraza. La estancia hace que Fuerteventura se sienta propia desde el primer dia.'
        : 'Markets, nearby beaches, sunsets from the terrace. The stay makes Fuerteventura feel like yours from day one.',
      'story-title': isSpanish ? 'Los dias de la estancia' : 'Days of the stay',
      'story-lead': isSpanish ? 'Una historia de descanso, luz y vida local en Fuerteventura.' : 'A story of rest, light and local life in Fuerteventura.',
      'feature-stat-1': isSpanish ? 'Comodidad' : 'Comfort',
      'feature-stat-2': isSpanish ? 'Playas' : 'Beaches',
      'feature-stat-3': isSpanish ? 'Estancia' : 'Stay',
    });
  }

  if (input.activityType === 'photographer') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'SESION DE FOTOS' : 'PHOTO SESSION',
      'intro-title': isSpanish ? 'La luz de Fuerteventura en cada imagen' : 'The light of Fuerteventura in every image',
      'intro-body': isSpanish
        ? 'Tu sesion de fotos captura la luz dorada, los paisajes abiertos y los momentos que hacen que Fuerteventura sea tan especial.'
        : 'Your photo session captures the golden light, open landscapes and moments that make Fuerteventura so special.',
      'feature-title': isSpanish ? 'La luz y el encuadre perfecto' : 'The perfect light and frame',
      'feature-body': isSpanish
        ? 'El fotografo conoce los rincones y las horas donde la isla se ve mejor. Cada sesion es un recorrido por la luz.'
        : 'The photographer knows the corners and hours where the island looks its best. Each session is a journey through light.',
      'story-title': isSpanish ? 'Momentos de la sesion' : 'Session highlights',
      'story-lead': isSpanish ? 'Una historia de luz, encuadre y recuerdo en Fuerteventura.' : 'A story of light, frame and memory in Fuerteventura.',
      'feature-stat-1': isSpanish ? 'Luz dorada' : 'Golden hour',
      'feature-stat-2': isSpanish ? 'Playas' : 'Beaches',
      'feature-stat-3': isSpanish ? 'Recuerdo' : 'Memory',
    });
  }

  if (input.activityType === 'restaurant') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'RESTAURANTE' : 'RESTAURANT',
      'intro-title': isSpanish ? 'Sabores locales en Fuerteventura' : 'Local flavors in Fuerteventura',
      'intro-body': isSpanish
        ? 'La experiencia en el restaurante une producto local, ambiente y los momentos de mesa que se quedan en la memoria.'
        : 'The restaurant experience brings together local produce, atmosphere and the table moments that stay in memory.',
      'feature-title': isSpanish ? 'Cocina y producto de la isla' : 'Island cuisine and produce',
      'feature-body': isSpanish
        ? 'El restaurante trabaja con ingredientes locales y una cocina que refleja el caracter de Fuerteventura.'
        : 'The restaurant works with local ingredients and a cuisine that reflects the character of Fuerteventura.',
      'story-title': isSpanish ? 'Momentos en la mesa' : 'Table moments',
      'story-lead': isSpanish ? 'Una historia de comida, sabor y ambiente en Fuerteventura.' : 'A story of food, flavor and atmosphere in Fuerteventura.',
      'feature-stat-1': isSpanish ? 'Sabor local' : 'Local flavor',
      'feature-stat-2': isSpanish ? 'Producto' : 'Produce',
      'feature-stat-3': isSpanish ? 'Mesa' : 'Table',
    });
  }

  if (input.activityType === 'hotel') {
    return finish({
      ...common,
      'cover-title': isSpanish ? 'HOTEL' : 'HOTEL',
      'intro-title': isSpanish ? 'Una estancia en Fuerteventura' : 'A stay in Fuerteventura',
      'intro-body': isSpanish
        ? 'El hotel ofrece comodidad, servicio y la isla al alcance de la mano para que cada dia sea sencillo y especial.'
        : 'The hotel offers comfort, service and the island within reach so every day is easy and special.',
      'feature-title': isSpanish ? 'Servicio y comodidad en la isla' : 'Service and comfort on the island',
      'feature-body': isSpanish
        ? 'Desde la llegada hasta la salida, el hotel hace que la estancia en Fuerteventura sea sin esfuerzo y con todo a la mano.'
        : 'From arrival to departure, the hotel makes the stay in Fuerteventura effortless and well-appointed.',
      'story-title': isSpanish ? 'Los dias de la estancia en el hotel' : 'Hotel stay highlights',
      'story-lead': isSpanish ? 'Una historia de comodidad, servicio y estancia en Fuerteventura.' : 'A story of comfort, service and island stays in Fuerteventura.',
      'feature-stat-1': isSpanish ? 'Llegada' : 'Arrival',
      'feature-stat-2': isSpanish ? 'Comodidad' : 'Comfort',
      'feature-stat-3': isSpanish ? 'Estancia' : 'Stay',
    });
  }

  return finish(common);
}

function buildUserPrompt(input: CopyInput): string {
  const slotIds = slotIdsForTemplate(input.templateId);
  const slotList = slotIds.map((id) => '- ' + id).join('\n');
  const notes = input.notes ? '\n\nNotes: ' + input.notes : '';
  const languageName = LANGUAGE_NAMES[input.language] ?? 'English';
  const activityLine = input.activityType
    ? 'Write the editorial copy for a ' + (input.activityLabel || input.activityType) + ' travel magazine.'
    : 'Write the editorial copy for a personal family travel magazine.';
  const activityRules = input.activityType
    ? [
        '',
        'Resolved activity profile:',
        '- Activity type: ' + input.activityType + '.',
        '- Activity label: ' + (input.activityLabel || input.activityType) + '.',
        '- Page plan: ' + (input.pagePlan?.[input.language === 'es' ? 'es' : 'en'] || []).join(' | '),
        '- Copy tone: ' + (input.copyTone || input.style) + '.',
        '- Never mention or imply these unrelated activities unless user notes explicitly require them: ' + (input.prohibitedImageKeywords || []).join(', ') + '.',
      ].join('\n')
    : '';
  return [
    activityLine,
    'Destination: ' + input.destination + '.',
    'Travelers: ' + input.travelers + '.',
    'Preferred tone: ' + input.style + '.' + notes,
    activityRules,
    '',
    'Return ONLY a JSON object whose keys match exactly these slot IDs, with string values:',
    slotList,
    '',
    'Rules:',
    '- Every string value MUST be in ' + languageName + '. This is mandatory and applies to every field including CTA labels, button text, and captions. Do not mix languages. Keep place names and proper nouns in their original spelling.',
    '- Be specific to ' + input.destination + '. Reference real local food, light, terrain.',
    '- Tone should feel like a polished magazine, warm and intimate, never generic.',
    '- Keep headlines short. Keep body copy under the implied magazine length.',
    '- Do not use markdown. Do not include any text outside the JSON.'
  ].join('\n');
}

// Claude Haiku enrichment — generates poetic headline-level copy.
// Runs only if ANTHROPIC_API_KEY is set; always falls back gracefully.
async function enrichWithClaude(
  copy: Record<string, string>,
  input: CopyInput
): Promise<Record<string, string>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return copy;
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });
    const languageName = LANGUAGE_NAMES[input.language] ?? 'English';
    const magazineSubject = input.activityType
      ? `${input.activityLabel || input.activityType} travel magazine`
      : 'family travel magazine';
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        {
          role: 'user',
          content: [
            'You are an editor at Condé Nast Traveller.',
            `Write editorial copy in ${languageName} for a ${magazineSubject} about ${input.destination}.`,
            `Travelers: ${input.travelers}. Tone: ${input.copyTone || input.style}.`,
            input.prohibitedImageKeywords?.length
              ? `Never mention these unrelated activities: ${input.prohibitedImageKeywords.join(', ')}.`
              : '',
            `Every string value MUST be in ${languageName}.`,
            'Return ONLY a JSON object with these keys (max 20 words each):',
            '  coverKicker   — witty 3-word travel phrase (e.g. "Sun. Salt. Story.")',
            '  storyIntro    — two evocative opening sentences about the destination',
            '  pullQuote     — one beautiful sentence about the experience',
            '  featureTitle  — four-word editorial section title',
            '  quoteBody     — poetic one-liner about this specific place',
            'JSON only. No markdown. No explanation.'
          ].filter(Boolean).join('\n'),
        }
      ]
    });
    const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '{}';
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : {};
    return {
      ...copy,
      ...(parsed.coverKicker   ? { coverKicker:   parsed.coverKicker }   : {}),
      ...(parsed.storyIntro    ? { welcomeBody:   parsed.storyIntro }    : {}),
      ...(parsed.pullQuote     ? { pullQuote:     parsed.pullQuote }      : {}),
      ...(parsed.featureTitle  ? { coverFeatureTitle: parsed.featureTitle } : {}),
      ...(parsed.quoteBody     ? { quoteBody:     parsed.quoteBody }      : {}),
    };
  } catch {
    return copy;
  }
}

export async function generateEditorialCopy(
  input: CopyInput
): Promise<Record<string, string>> {
  const defaults = defaultsFor(input);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return enrichWithClaude(defaults, input);

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
            '. Respond ONLY with valid JSON, no markdown, no explanation. Every string value MUST be in ' +
            languageName +
            '. This is mandatory and applies to every field including CTA labels, button text, and captions.'
        },
        { role: 'user', content: buildUserPrompt(input) }
      ]
    });
    const raw = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    const oaiCopy = parsed && typeof parsed === 'object'
      ? { ...defaults, ...parsed }
      : defaults;
    // Overlay Claude's poetic fields on top of the GPT-4o-mini base
    return enrichWithClaude(oaiCopy, input);
  } catch {
    return enrichWithClaude(defaults, input);
  }
}
