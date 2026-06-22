export type ResolvedActivityType =
  | 'surf-camp'
  | 'villa-rental'
  | 'tour-guide'
  | 'boat-tour'
  | 'photographer'
  | 'buggy-adventure'
  | 'restaurant'
  | 'hotel'
  | 'other';

export type DemoAssets = {
  cover: string[];
  contents: string[];
  welcome: string[];
  company: string[];
  localHighlights: string[];
  story: string[];
  gallery: string[];
  finalCta: string[];
};

export type ActivityProfile = {
  activityType: ResolvedActivityType;
  activityLabel: string;
  activityLabelsByLanguage: Record<'en' | 'es', string>;
  templateId: string;
  allowedImageKeywords: string[];
  prohibitedImageKeywords: string[];
  pagePlan: Record<'en' | 'es', string[]>;
  ctaLabels: Record<'en' | 'es', string>;
  localTipsTopics: Record<'en' | 'es', string[]>;
  copyTone: string;
  previewTitle: Record<'en' | 'es', string>;
  previewSubtitle: Record<'en' | 'es', string>;
  previewImage: string;
  previewAlt: Record<'en' | 'es', string>;
  demoAssets: DemoAssets;
};

type ActivitySource = {
  activityType?: string | null;
  aiDetectedActivityType?: string | null;
  businessType?: string | null;
  businessName?: string | null;
  googlePlaceName?: string | null;
  googlePrimaryType?: string | null;
  googleTypes?: string[] | null;
  serpApiType?: string | null;
  serpApiTypes?: string[] | null;
  reviews?: Array<{ text?: string | null }> | null;
};

const ACTIVITY_TYPES: ResolvedActivityType[] = [
  'surf-camp',
  'villa-rental',
  'tour-guide',
  'boat-tour',
  'photographer',
  'buggy-adventure',
  'restaurant',
  'hotel',
  'other',
];

function demoAssetsFor(image: string): DemoAssets {
  return {
    cover: [image],
    contents: [image],
    welcome: [image],
    company: [image],
    localHighlights: [image],
    story: [image],
    gallery: [image, image, image, image, image],
    finalCta: [image],
  };
}

const ACTIVITY_PROFILES: Record<ResolvedActivityType, Omit<ActivityProfile, 'activityType' | 'activityLabel'>> = {
  'surf-camp': {
    activityLabelsByLanguage: { en: 'Surf Camp', es: 'Escuela de Surf' },
    templateId: 'wanderbook-editorial',
    allowedImageKeywords: ['fuerteventura surf lesson', 'corralejo waves', 'surf camp canary islands'],
    prohibitedImageKeywords: ['buggy', 'quad', 'catamaran', 'sailing', 'dolphin'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the surf camp', 'Fuerteventura wave rhythm', 'Surf week highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre la escuela de surf', 'El ritmo de las olas en Fuerteventura', 'Momentos de la semana de surf', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next surf week', es: 'Reserva tu proxima semana de surf' },
    localTipsTopics: {
      en: ['wave conditions', 'beach rhythm', 'local surf towns'],
      es: ['condiciones de olas', 'ritmo de playa', 'pueblos surferos'],
    },
    copyTone: 'energetic, coastal and practical, focused on surf progression and island rhythm',
    previewTitle: { en: 'Surf Camp Experience', es: 'Semana de Surf' },
    previewSubtitle: { en: 'Waves, board and island sun', es: 'Olas, tabla y sol en la isla' },
    previewImage: '/template-covers/default-cover.jpg',
    previewAlt: {
      en: 'Surfer riding waves at a Fuerteventura surf camp',
      es: 'Surfista en las olas de una escuela de surf en Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/default-cover.jpg'),
  },
  'villa-rental': {
    activityLabelsByLanguage: { en: 'Holiday Rental', es: 'Alquiler Vacacional' },
    templateId: 'holiday-rental-memory',
    allowedImageKeywords: ['fuerteventura villa pool', 'canary islands holiday apartment', 'fuerteventura terrace'],
    prohibitedImageKeywords: ['buggy', 'quad', 'catamaran', 'sailing', 'dolphin'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the stay', 'Living locally in Fuerteventura', 'Guest highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre la estancia', 'Vivir Fuerteventura como local', 'Momentos de la estancia', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next stay direct', es: 'Reserva tu proxima estancia directa' },
    localTipsTopics: {
      en: ['arrival comfort', 'local beaches', 'easy days'],
      es: ['comodidad al llegar', 'playas cercanas', 'dias tranquilos'],
    },
    copyTone: 'calm, welcoming and local, focused on comfort, direct booking and guest memories',
    previewTitle: { en: 'Your Island Stay', es: 'Tu Estancia en la Isla' },
    previewSubtitle: { en: 'A premium guest memory magazine', es: 'Tu revista recuerdo de la estancia' },
    previewImage: '/template-covers/holiday-rental.jpg',
    previewAlt: {
      en: 'Holiday villa with pool in Fuerteventura',
      es: 'Villa vacacional con piscina en Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/holiday-rental.jpg'),
  },
  'tour-guide': {
    activityLabelsByLanguage: { en: 'Tour Guide', es: 'Guia Turistico' },
    templateId: 'tour-guide-experience',
    allowedImageKeywords: ['fuerteventura volcanic landscape', 'betancuria village', 'fuerteventura island route'],
    prohibitedImageKeywords: ['boat', 'sailing', 'catamaran', 'buggy', 'quad', 'surf'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the guide/company', 'Authentic island stories', 'Places visited or local highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre el guia o la empresa', 'Historias autenticas de la isla', 'Lugares visitados o destacados locales', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next guided route', es: 'Reserva tu proxima ruta guiada' },
    localTipsTopics: {
      en: ['island routes', 'viewpoints', 'villages'],
      es: ['rutas por la isla', 'miradores', 'pueblos'],
    },
    copyTone: 'knowledgeable, warm and place-specific, focused on routes, villages and local stories',
    previewTitle: { en: 'Tour Guide Experience', es: 'Ruta Guiada' },
    previewSubtitle: {
      en: 'Local routes, viewpoints and island stories',
      es: 'Rutas locales, miradores e historias de la isla',
    },
    previewImage: '/template-covers/tour-guide.jpg',
    previewAlt: {
      en: 'Guided tour through Fuerteventura volcanic landscape',
      es: 'Ruta guiada por el paisaje volcanico de Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/tour-guide.jpg'),
  },
  'boat-tour': {
    activityLabelsByLanguage: { en: 'Boat Tour', es: 'Tour en Barco' },
    templateId: 'boat-trip-experience',
    allowedImageKeywords: ['fuerteventura boat tour atlantic', 'fuerteventura coast boat', 'atlantic ocean boat fuerteventura'],
    prohibitedImageKeywords: ['buggy', 'quad', 'off-road', 'dunes'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the company', 'Fuerteventura from the Atlantic', 'Sea/coast highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre la empresa', 'Fuerteventura desde el Atlantico', 'Momentos de mar y costa', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next boat tour', es: 'Reserva tu proxima salida en barco' },
    localTipsTopics: {
      en: ['sea conditions', 'coastline', 'Atlantic light'],
      es: ['estado del mar', 'costa', 'luz atlantica'],
    },
    copyTone: 'fresh, coastal and relaxed, focused on sea views, coastline and the Atlantic',
    previewTitle: { en: 'Boat Tour Experience', es: 'Experiencia en Barco' },
    previewSubtitle: {
      en: 'Atlantic coast, sailing and sea moments',
      es: 'Costa atlantica, vela y momentos en el mar',
    },
    previewImage: '/template-covers/boat-trip.jpg',
    previewAlt: {
      en: 'Catamaran or boat tour on the Atlantic coast of Fuerteventura',
      es: 'Tour en catamaran o barco por la costa atlantica de Fuerteventura',
    },
    demoAssets: {
      cover: ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=1200'],
      contents: ['https://images.pexels.com/photos/1001683/pexels-photo-1001683.jpeg?w=1200'],
      welcome: ['https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?w=1200'],
      company: ['https://images.pexels.com/photos/296242/pexels-photo-296242.jpeg?w=1200'],
      localHighlights: ['https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?w=1200'],
      story: ['https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?w=1200'],
      gallery: [
        'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?w=1200',
        'https://images.pexels.com/photos/1001683/pexels-photo-1001683.jpeg?w=1200',
        'https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?w=1200',
        'https://images.pexels.com/photos/296242/pexels-photo-296242.jpeg?w=1200',
        'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?w=1200',
      ],
      finalCta: ['https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?w=1200'],
    },
  },
  photographer: {
    activityLabelsByLanguage: { en: 'Photographer', es: 'Fotografo' },
    templateId: 'photographer-experience',
    allowedImageKeywords: ['fuerteventura beach photography session', 'canary islands portrait session', 'family photoshoot fuerteventura'],
    prohibitedImageKeywords: ['buggy', 'quad', 'catamaran', 'sailing', 'dolphin'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the photographer', 'The light of Fuerteventura', 'Session highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre el fotografo', 'La luz de Fuerteventura', 'Momentos de la sesion', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next photo session', es: 'Reserva tu proxima sesion de fotos' },
    localTipsTopics: {
      en: ['golden hour', 'beach locations', 'natural portraits'],
      es: ['hora dorada', 'playas para fotos', 'retratos naturales'],
    },
    copyTone: 'visual, emotional and polished, focused on portraits, light and keepsake memories',
    previewTitle: { en: 'Photography Experience', es: 'Sesión Fotográfica' },
    previewSubtitle: {
      en: 'Portraits in the Fuerteventura light',
      es: 'Retratos con la luz de Fuerteventura',
    },
    previewImage: '/template-covers/aurora-editorial.jpg',
    previewAlt: {
      en: 'Photography session on a Fuerteventura beach',
      es: 'Sesion fotografica en una playa de Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/aurora-editorial.jpg'),
  },
  'buggy-adventure': {
    activityLabelsByLanguage: { en: 'Buggy Adventure', es: 'Aventura en Buggy' },
    templateId: 'buggy-adventure-experience',
    allowedImageKeywords: ['fuerteventura buggy adventure', 'fuerteventura off road buggy', 'volcanic road buggy fuerteventura'],
    prohibitedImageKeywords: ['sailing', 'catamaran', 'dolphin', 'surf', 'boat', 'marina', 'barco', 'delfin'],
    pagePlan: {
      en: ['Cover: company + Buggy Adventure in Fuerteventura', 'Welcome: tourist adventure', 'About the company', 'The volcanic/off-road side of Fuerteventura', 'Route or adventure highlights', 'Customer photo story', 'Why guests love the experience, based on reviews', 'Final CTA page'],
      es: ['Portada: empresa + Aventura en Buggy en Fuerteventura', 'Bienvenida: la aventura del viajero', 'Sobre la empresa', 'El lado volcanico y todoterreno de Fuerteventura', 'Ruta o momentos destacados de la aventura', 'Historia con fotos del cliente', 'Por que los clientes recomiendan la experiencia, segun resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next buggy adventure', es: 'Reserva tu proxima aventura en buggy' },
    localTipsTopics: {
      en: ['volcanic tracks', 'dusty roads', 'adventure route'],
      es: ['pistas volcanicas', 'caminos de tierra', 'ruta de aventura'],
    },
    copyTone: 'active, grounded and adventurous, focused on buggies, volcanic roads and off-road landscape',
    previewTitle: { en: 'Buggy Adventure', es: 'Aventura en Buggy' },
    previewSubtitle: {
      en: 'Volcanic roads, dunes and off-road thrills',
      es: 'Pistas volcanicas, dunas y aventura todoterreno',
    },
    previewImage: '/template-covers/buggy-adventure.jpg',
    previewAlt: {
      en: 'Buggy adventure on volcanic roads in Fuerteventura',
      es: 'Aventura en buggy por las pistas volcanicas de Fuerteventura',
    },
    demoAssets: {
      cover: ['https://images.unsplash.com/photo-1631902082973-72d82e5e076e?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
      contents: ['https://images.unsplash.com/photo-1646612336424-7d19c214c7de?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
      welcome: ['https://images.unsplash.com/photo-1596827414857-1ab11c6f323b?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
      company: ['https://images.unsplash.com/photo-1629280557063-3c470c1954d1?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
      localHighlights: ['https://images.unsplash.com/photo-1583384991243-e52c264d35d4?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
      story: ['https://images.unsplash.com/photo-1624062999803-976e1adc8ea2?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
      gallery: [
        'https://images.unsplash.com/photo-1631902082973-72d82e5e076e?auto=format&fit=crop&fm=jpg&q=80&w=1400',
        'https://images.unsplash.com/photo-1646612336424-7d19c214c7de?auto=format&fit=crop&fm=jpg&q=80&w=1400',
        'https://images.unsplash.com/photo-1596827414857-1ab11c6f323b?auto=format&fit=crop&fm=jpg&q=80&w=1400',
        'https://images.unsplash.com/photo-1629280557063-3c470c1954d1?auto=format&fit=crop&fm=jpg&q=80&w=1400',
        'https://images.unsplash.com/photo-1624062999803-976e1adc8ea2?auto=format&fit=crop&fm=jpg&q=80&w=1400',
      ],
      finalCta: ['https://images.unsplash.com/photo-1646612336424-7d19c214c7de?auto=format&fit=crop&fm=jpg&q=80&w=1400'],
    },
  },
  restaurant: {
    activityLabelsByLanguage: { en: 'Restaurant', es: 'Restaurante' },
    templateId: 'aurora-editorial',
    allowedImageKeywords: ['fuerteventura restaurant local food', 'canary islands restaurant', 'fuerteventura dining'],
    prohibitedImageKeywords: ['buggy', 'quad', 'catamaran', 'sailing', 'dolphin'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the restaurant', 'Local flavors', 'Menu highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre el restaurante', 'Sabores locales', 'Platos destacados', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Reserve your next table', es: 'Reserva tu proxima mesa' },
    localTipsTopics: {
      en: ['local dishes', 'table moments', 'island produce'],
      es: ['platos locales', 'momentos en la mesa', 'producto de la isla'],
    },
    copyTone: 'sensory and welcoming, focused on food, service and local flavor',
    previewTitle: { en: 'Fuerteventura Flavours', es: 'Sabores de Fuerteventura' },
    previewSubtitle: {
      en: 'Local food and dining atmosphere',
      es: 'Gastronomia local y ambiente de restaurante',
    },
    previewImage: '/template-covers/aurora-editorial.jpg',
    previewAlt: {
      en: 'Restaurant dining experience in Fuerteventura',
      es: 'Experiencia gastronomica en Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/aurora-editorial.jpg'),
  },
  hotel: {
    activityLabelsByLanguage: { en: 'Hotel', es: 'Hotel' },
    templateId: 'holiday-rental-memory',
    allowedImageKeywords: ['fuerteventura hotel pool', 'fuerteventura hotel stay', 'canary islands hotel'],
    prohibitedImageKeywords: ['buggy', 'quad', 'catamaran', 'sailing', 'dolphin'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the hotel', 'A stay on the island', 'Guest highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre el hotel', 'Una estancia en la isla', 'Momentos de la estancia', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next stay', es: 'Reserva tu proxima estancia' },
    localTipsTopics: {
      en: ['arrival', 'comfort', 'nearby island highlights'],
      es: ['llegada', 'comodidad', 'lugares cercanos'],
    },
    copyTone: 'calm and premium, focused on comfort, service and island stays',
    previewTitle: { en: 'Your Premium Stay', es: 'Tu Estancia Premium' },
    previewSubtitle: {
      en: 'Comfort, hospitality and island moments',
      es: 'Comodidad, hospitalidad y momentos en la isla',
    },
    previewImage: '/template-covers/holiday-rental.jpg',
    previewAlt: {
      en: 'Premium hotel stay in Fuerteventura',
      es: 'Estancia en hotel en Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/holiday-rental.jpg'),
  },
  other: {
    activityLabelsByLanguage: { en: 'Fuerteventura Experience', es: 'Experiencia en Fuerteventura' },
    templateId: 'aurora-editorial',
    allowedImageKeywords: ['fuerteventura landscape', 'fuerteventura village', 'fuerteventura island'],
    prohibitedImageKeywords: ['buggy', 'quad', 'catamaran', 'sailing', 'dolphin', 'surf'],
    pagePlan: {
      en: ['Cover', 'Welcome', 'About the company', 'The island context', 'Experience highlights', 'Customer photo story', 'Review themes', 'Final CTA page'],
      es: ['Portada', 'Bienvenida', 'Sobre la empresa', 'Contexto de la isla', 'Momentos de la experiencia', 'Historia con fotos del cliente', 'Temas de resenas', 'Pagina final de reserva'],
    },
    ctaLabels: { en: 'Book your next experience', es: 'Reserva tu proxima experiencia' },
    localTipsTopics: {
      en: ['island setting', 'guest experience', 'local context'],
      es: ['entorno de la isla', 'experiencia del cliente', 'contexto local'],
    },
    copyTone: 'specific, warm and practical, focused on the company and the island experience',
    previewTitle: { en: 'Your Fuerteventura Experience', es: 'Tu Experiencia en Fuerteventura' },
    previewSubtitle: {
      en: 'A premium digital magazine of your experience',
      es: 'Una revista digital premium de tu experiencia',
    },
    previewImage: '/template-covers/atlas-nocturne.jpg',
    previewAlt: {
      en: 'Fuerteventura island landscape',
      es: 'Paisaje de la isla de Fuerteventura',
    },
    demoAssets: demoAssetsFor('/template-covers/atlas-nocturne.jpg'),
  },
};

function normalizeText(value: unknown): string {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function resolveFromText(value: unknown): ResolvedActivityType | null {
  const text = normalizeText(value);
  if (!text || text === 'other') return null;
  if (ACTIVITY_TYPES.includes(text.replace(/\s+/g, '-') as ResolvedActivityType)) {
    return text.replace(/\s+/g, '-') as ResolvedActivityType;
  }
  if (/(surf|surfing|surf school|surf camp|escuela de surf)/.test(text)) return 'surf-camp';
  if (/(villa|apartment|holiday rental|vacation rental|airbnb|lodging|guest house|accommodation|stay|alquiler|apartamento|casa rural)/.test(text)) return 'villa-rental';
  if (/(buggy|quad|atv|off road|offroad|4x4 adventure|todoterreno)/.test(text)) return 'buggy-adventure';
  if (/(boat|barco|sail|sailing|catamaran|yacht|marine|marina|dolphin|delfin|cruise|crucero)/.test(text)) return 'boat-tour';
  if (/(tour guide|guide|guia|guided route|guided tour|travel agency|tour agency|ruta guiada)/.test(text)) return 'tour-guide';
  if (/(photo|foto|photographer|fotografo|photoshoot|portrait|retrato)/.test(text)) return 'photographer';
  if (/(restaurant|restaurante|food|comida|dining|bar|cafe|cafe)/.test(text)) return 'restaurant';
  if (/(hotel|resort)/.test(text)) return 'hotel';
  return null;
}

export function isResolvedActivityType(value: unknown): value is ResolvedActivityType {
  return ACTIVITY_TYPES.includes(value as ResolvedActivityType);
}

export function resolveActivityType(source?: ActivitySource | null): ResolvedActivityType {
  const ai = resolveFromText(source?.aiDetectedActivityType);
  if (ai) return ai;

  const explicit = resolveFromText(source?.activityType);
  if (explicit) return explicit;

  const category = resolveFromText([
    source?.businessType,
  ].filter(Boolean).join(' '));
  if (category) return category;

  const enriched = resolveFromText([
    source?.googlePrimaryType,
    source?.googleTypes?.join(' '),
    source?.serpApiType,
    source?.serpApiTypes?.join(' '),
    source?.googlePlaceName,
    source?.reviews?.map((review) => review.text).filter(Boolean).join(' '),
  ].filter(Boolean).join(' '));
  if (enriched) return enriched;

  return 'other';
}

export function getActivityLabel(activityType: unknown, language?: string | null): string {
  const resolved = resolveFromText(activityType) || (isResolvedActivityType(activityType) ? activityType : 'other');
  return ACTIVITY_PROFILES[resolved].activityLabelsByLanguage[language === 'es' ? 'es' : 'en'];
}

export function resolveActivityProfile(source?: ActivitySource | null, language?: string | null): ActivityProfile {
  const activityType = resolveActivityType(source);
  const profile = ACTIVITY_PROFILES[activityType];
  const lang = language === 'es' ? 'es' : 'en';
  return {
    activityType,
    activityLabel: profile.activityLabelsByLanguage[lang],
    ...profile,
  };
}
