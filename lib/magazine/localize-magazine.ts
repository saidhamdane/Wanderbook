export type MagazineLabelKey =
  | 'brand'
  | 'family'
  | 'travelEdition'
  | 'islandEdition'
  | 'inThisIssue'
  | 'contents'
  | 'introduction'
  | 'discoveringTheIsland'
  | 'featureStory'
  | 'photoGallery'
  | 'theStory'
  | 'untilWeReturn'
  | 'gallery'
  | 'feature'
  | 'createdWith'
  | 'createdWithWanderbookCanarias'
  | 'thankYouForTravellingWith'
  | 'bookYourNextBoatExperience'
  | 'whatsapp'
  | 'website'
  | 'yourMagazineStyle'
  | 'openCoast'
  | 'slowDays'
  | 'familyLight'
  | 'whereDunesMeetAtlantic'
  | 'daysWellSpent'
  | 'chapter'
  | 'welcome'
  | 'theEditors'
  | 'everyJourneyWrites'
  | 'untilWeTravelAgain'
  | 'aNoteFromTheRoad'
  | 'createdWithBusiness';

const LABELS: Record<string, Record<MagazineLabelKey, string>> = {
  en: {
    brand: 'Wanderbook',
    family: 'Family',
    travelEdition: 'Travel Edition',
    islandEdition: 'Island Edition',
    inThisIssue: 'In This Issue',
    contents: 'Contents',
    introduction: 'Introduction',
    discoveringTheIsland: 'Discovering the Island',
    featureStory: 'Feature Story',
    photoGallery: 'Photo Gallery',
    theStory: 'The Story',
    untilWeReturn: 'Until We Return',
    gallery: 'Gallery',
    feature: 'Feature',
    createdWith: 'Created with',
    createdWithWanderbookCanarias: 'Created with Wanderbook Canarias',
    thankYouForTravellingWith: 'Thank you for travelling with',
    bookYourNextBoatExperience: 'Book your next boat experience',
    whatsapp: 'WhatsApp',
    website: 'Website',
    yourMagazineStyle: 'Your magazine style',
    openCoast: 'Open coast',
    slowDays: 'Slow days',
    familyLight: 'Family light',
    whereDunesMeetAtlantic: 'Where the dunes meet the Atlantic',
    daysWellSpent: 'Days well spent',
    chapter: 'Chapter',
    welcome: 'Welcome',
    theEditors: 'The Editors',
    everyJourneyWrites: 'Every journey writes its own story.',
    untilWeTravelAgain: 'Until We Travel Again',
    aNoteFromTheRoad: 'A note from the road',
    createdWithBusiness: 'Created with',
  },
  es: {
    brand: 'Wanderbook',
    family: 'Familia',
    travelEdition: 'Edicion de viaje',
    islandEdition: 'Edicion isla',
    inThisIssue: 'En esta edicion',
    contents: 'Contenido',
    introduction: 'Introduccion',
    discoveringTheIsland: 'Descubriendo la isla',
    featureStory: 'Historia destacada',
    photoGallery: 'Galeria de fotos',
    theStory: 'La historia',
    untilWeReturn: 'Hasta el proximo viaje',
    gallery: 'Galeria',
    feature: 'Historia destacada',
    createdWith: 'Creado con',
    createdWithWanderbookCanarias: 'Creado con Wanderbook Canarias',
    thankYouForTravellingWith: 'Gracias por viajar con',
    bookYourNextBoatExperience: 'Reserva tu proxima experiencia',
    whatsapp: 'WhatsApp',
    website: 'Web',
    yourMagazineStyle: 'Tu estilo de revista',
    openCoast: 'Costa abierta',
    slowDays: 'Dias tranquilos',
    familyLight: 'Luz familiar',
    whereDunesMeetAtlantic: 'Donde las dunas encuentran el Atlantico',
    daysWellSpent: 'Dias bien vividos',
    chapter: 'Capitulo',
    welcome: 'Bienvenida',
    theEditors: 'Los editores',
    everyJourneyWrites: 'Cada viaje escribe su propia historia.',
    untilWeTravelAgain: 'Hasta el proximo viaje',
    aNoteFromTheRoad: 'Una nota del camino',
    createdWithBusiness: 'Creado con',
  },
  fr: {
    brand: 'Wanderbook',
    family: 'Famille',
    travelEdition: 'Edition voyage',
    islandEdition: 'Edition ile',
    inThisIssue: 'Dans cette edition',
    contents: 'Sommaire',
    introduction: 'Introduction',
    discoveringTheIsland: "Decouvrir l'ile",
    featureStory: 'Grand recit',
    photoGallery: 'Galerie photo',
    theStory: "L'histoire",
    untilWeReturn: "Jusqu'au retour",
    gallery: 'Galerie',
    feature: 'Grand recit',
    createdWith: 'Cree avec',
    createdWithWanderbookCanarias: 'Cree avec Wanderbook Canarias',
    thankYouForTravellingWith: "Merci d'avoir voyage avec",
    bookYourNextBoatExperience: 'Reservez votre prochaine experience',
    whatsapp: 'WhatsApp',
    website: 'Site web',
    yourMagazineStyle: 'Votre style de magazine',
    openCoast: 'Cote ouverte',
    slowDays: 'Jours lents',
    familyLight: 'Lumiere de famille',
    whereDunesMeetAtlantic: "La ou les dunes rencontrent l'Atlantique",
    daysWellSpent: 'Jours bien vecus',
    chapter: 'Chapitre',
    welcome: 'Bienvenue',
    theEditors: 'La redaction',
    everyJourneyWrites: 'Chaque voyage ecrit sa propre histoire.',
    untilWeTravelAgain: "Jusqu'au prochain voyage",
    aNoteFromTheRoad: 'Une note de route',
    createdWithBusiness: 'Cree avec',
  },
  de: {
    brand: 'Wanderbook',
    family: 'Familie',
    travelEdition: 'Reiseausgabe',
    islandEdition: 'Inselausgabe',
    inThisIssue: 'In dieser Ausgabe',
    contents: 'Inhalt',
    introduction: 'Einfuhrung',
    discoveringTheIsland: 'Die Insel entdecken',
    featureStory: 'Titelgeschichte',
    photoGallery: 'Fotogalerie',
    theStory: 'Die Geschichte',
    untilWeReturn: 'Bis zur nachsten Reise',
    gallery: 'Galerie',
    feature: 'Titelgeschichte',
    createdWith: 'Erstellt mit',
    createdWithWanderbookCanarias: 'Erstellt mit Wanderbook Canarias',
    thankYouForTravellingWith: 'Danke fur die Reise mit',
    bookYourNextBoatExperience: 'Buchen Sie Ihr nachstes Erlebnis',
    whatsapp: 'WhatsApp',
    website: 'Website',
    yourMagazineStyle: 'Ihr Magazinstil',
    openCoast: 'Offene Kuste',
    slowDays: 'Ruhige Tage',
    familyLight: 'Familienlicht',
    whereDunesMeetAtlantic: 'Wo die Dunen den Atlantik treffen',
    daysWellSpent: 'Gut verbrachte Tage',
    chapter: 'Kapitel',
    welcome: 'Willkommen',
    theEditors: 'Die Redaktion',
    everyJourneyWrites: 'Jede Reise schreibt ihre eigene Geschichte.',
    untilWeTravelAgain: 'Bis zur nachsten Reise',
    aNoteFromTheRoad: 'Eine Notiz von unterwegs',
    createdWithBusiness: 'Erstellt mit',
  },
  it: {
    brand: 'Wanderbook',
    family: 'Famiglia',
    travelEdition: 'Edizione viaggio',
    islandEdition: 'Edizione isola',
    inThisIssue: 'In questa edizione',
    contents: 'Contenuti',
    introduction: 'Introduzione',
    discoveringTheIsland: "Scoprire l'isola",
    featureStory: 'Storia principale',
    photoGallery: 'Galleria foto',
    theStory: 'Il racconto',
    untilWeReturn: 'Fino al prossimo viaggio',
    gallery: 'Galleria',
    feature: 'Storia principale',
    createdWith: 'Creato con',
    createdWithWanderbookCanarias: 'Creato con Wanderbook Canarias',
    thankYouForTravellingWith: 'Grazie per aver viaggiato con',
    bookYourNextBoatExperience: 'Prenota la prossima esperienza',
    whatsapp: 'WhatsApp',
    website: 'Sito web',
    yourMagazineStyle: 'Il tuo stile rivista',
    openCoast: 'Costa aperta',
    slowDays: 'Giorni lenti',
    familyLight: 'Luce familiare',
    whereDunesMeetAtlantic: "Dove le dune incontrano l'Atlantico",
    daysWellSpent: 'Giorni ben vissuti',
    chapter: 'Capitolo',
    welcome: 'Benvenuto',
    theEditors: 'La redazione',
    everyJourneyWrites: 'Ogni viaggio scrive la sua storia.',
    untilWeTravelAgain: 'Fino al prossimo viaggio',
    aNoteFromTheRoad: 'Una nota di viaggio',
    createdWithBusiness: 'Creato con',
  },
};

function normalizeMagazineLanguage(language: string | undefined): string {
  return language && LABELS[language] ? language : 'en';
}

export function magazineLabel(language: string | undefined, key: MagazineLabelKey): string {
  const lang = normalizeMagazineLanguage(language);
  return LABELS[lang]?.[key] || LABELS.en[key];
}

export function localizedContentsLabels(language: string | undefined): string[] {
  return [
    magazineLabel(language, 'introduction'),
    magazineLabel(language, 'discoveringTheIsland'),
    magazineLabel(language, 'featureStory'),
    magazineLabel(language, 'photoGallery'),
    magazineLabel(language, 'theStory'),
    magazineLabel(language, 'untilWeReturn'),
  ];
}

export function localizedCreatedWith(language: string | undefined, businessName?: string): string {
  const label = magazineLabel(language, 'createdWith');
  return businessName ? `${label} ${businessName}` : label;
}
