export const CANARY_DESTINATIONS = [
  'Tenerife',
  'Fuerteventura',
  'Lanzarote',
  'Gran Canaria',
  'La Palma',
  'La Gomera',
  'El Hierro',
] as const;

export type CanaryDestination = (typeof CANARY_DESTINATIONS)[number];

export function isCanaryDestination(dest: string): boolean {
  return CANARY_DESTINATIONS.includes(dest as CanaryDestination);
}

export function getCanaryPexelsQueries(destination: string): string[] {
  const map: Record<string, string[]> = {
    Tenerife: [
      'Tenerife Teide',
      'Tenerife black sand beach',
      'Tenerife Anaga',
      'Tenerife Los Gigantes',
      'Canary Islands family travel',
    ],
    Fuerteventura: [
      'Fuerteventura dunes',
      'Corralejo dunes',
      'Cofete beach',
      'Fuerteventura surf',
      'Canary Islands beach family',
    ],
    Lanzarote: [
      'Lanzarote volcano',
      'Timanfaya',
      'Lanzarote black lava',
      'Lanzarote white village',
      'Lanzarote vineyard',
    ],
    'Gran Canaria': [
      'Gran Canaria dunes',
      'Maspalomas',
      'Gran Canaria mountains',
      'Las Palmas old town',
      'Gran Canaria beach',
    ],
    'La Palma': [
      'La Palma Canary Islands',
      'La Palma volcano',
      'La Palma forest',
      'La Palma stars',
    ],
    'La Gomera': [
      'La Gomera Garajonay',
      'La Gomera forest',
      'La Gomera hiking',
    ],
    'El Hierro': [
      'El Hierro Canary Islands',
      'El Hierro natural pool',
      'El Hierro diving',
      'El Hierro volcanic coast',
    ],
  };
  return (
    map[destination] || [
      `${destination} Canary Islands`,
      'Canary Islands travel family',
    ]
  );
}

const ISLAND_FALLBACKS: Record<string, Record<string, string>> = {
  Tenerife: {
    'cover-kicker': 'An Atlantic island story',
    'cover-line-1': 'Teide · Black beaches · Anaga',
    'cover-line-2': 'Sunsets · Family memories · Atlantic light',
    'intro-title': 'Where the volcano meets the sea',
    'intro-body':
      'Tenerife does not reveal itself all at once. You arrive expecting beaches and find instead an island of volcanic peaks, ancient laurel forests, and coastlines that change colour every hour. The Teide watches over everything. The Atlantic light is unlike anywhere else. By the end of the first evening you stop comparing it to other places and simply let it be what it is.',
    'feature-title': 'The island that keeps surprising you',
    'feature-body':
      'From the black-sand cove at Playa Jardín to the wind-carved ridges above Anaga, Tenerife rewards slow travel. The morning we drove through the laurisilva forest above Santa Cruz, the mist was still in the trees. Children ran ahead. Nobody checked the time. These are the days a family remembers long after the suntan fades.',
    'feature-stat-1': 'Teide at 3,715 m',
    'feature-stat-2': 'Anaga biosphere',
    'feature-stat-3': 'Atlantic sunsets',
    'story-title': 'Slow days on the black-sand shore',
    'story-lead': 'The coast of Tenerife at its most honest',
    'story-body':
      'We found a beach with no name on the map — just a path through the rock and a small cove where the sand was dark and the water impossibly clear. The kids called it their beach for the rest of the trip. We ate sandwiches in the shade and stayed until the afternoon wind came in from the sea. On the drive back nobody spoke, which is a kind of happiness.',
    'quote-text':
      'Tenerife gives you the Atlantic, the volcano, and the kind of long afternoon that you will try, and fail, to explain to people who were not there.',
  },
  Fuerteventura: {
    'cover-kicker': 'Where the dunes meet the Atlantic',
    'cover-line-1': 'Corralejo · Cofete · Golden beaches',
    'cover-line-2': 'Wind · Surf · Slow island days',
    'intro-title': 'The island that runs on wind and light',
    'intro-body':
      'Fuerteventura is the oldest of the Canary Islands and the most minimal — miles of golden dunes, a sea that never quite settles, and a sky that goes on forever. It does not try to entertain you. It invites you to slow down, lie on a beach that stretches further than you can walk, and let the trade wind blow everything unnecessary away.',
    'feature-title': 'Dunes, surf and the long shore',
    'feature-body':
      'At Corralejo the dunes are a protected park and they feel like another continent entirely. Children disappear over ridges and reappear somewhere unexpected. The water is cold and clean. In the evenings, Cofete is an hour across the island on a dirt road — a wild beach facing the open Atlantic with nothing behind it but the mountain.',
    'feature-stat-1': 'Corralejo dunes park',
    'feature-stat-2': 'Cofete wild beach',
    'feature-stat-3': 'Trade-wind surfing',
    'story-title': 'A family week on the longest beach',
    'story-lead': 'Fuerteventura at its most quietly generous',
    'story-body':
      'We woke each morning to the same blue rectangle of sea and the same wind bending the palm. By Tuesday we had a routine: coffee before anyone was dressed, the walk to the water, the argument about sunscreen. In the evenings we ate at a table on the street and watched the light go from gold to pink to the kind of purple you only see over the Atlantic.',
    'quote-text':
      'On Fuerteventura the wind takes the noise of ordinary life and carries it out to sea. What is left is the beach, the sky, and the people you came with.',
  },
  Lanzarote: {
    'cover-kicker': 'Volcanic light and white villages',
    'cover-line-1': 'Timanfaya · Black lava · Vineyards',
    'cover-line-2': 'César Manrique · Atlantic culture',
    'intro-title': 'An island shaped by fire and art',
    'intro-body':
      'Lanzarote is unlike any other place: a landscape of black lava fields interrupted by whitewashed villages and vineyards growing in volcanic craters. The fire mountains of Timanfaya still radiate heat just below the surface. César Manrique turned the island\'s volcanic character into art, leaving buildings that feel grown from the rock rather than placed on it.',
    'feature-title': 'Timanfaya and the fire mountains',
    'feature-body':
      'The Timanfaya national park is one of the most extraordinary places in Europe — a lunar landscape still warm from eruptions two centuries ago. Geysers shoot steam from the rock. Afterwards, the drive past vineyards in their volcanic craters, each vine sheltered by a handmade stone wall, offers a more peaceful version of the same fierce geology.',
    'feature-stat-1': 'Timanfaya fire park',
    'feature-stat-2': 'Volcanic vineyards',
    'feature-stat-3': 'Manrique legacy',
    'story-title': 'White walls and black roads',
    'story-lead': 'Lanzarote between the volcano and the sea',
    'story-body':
      'The village of Teguise is white and blue and very quiet in the afternoon. We sat in the square for an hour with cold drinks and warm shoulders, letting the children choose the next photograph. Later on the road back through the lava fields the light was doing something extraordinary to the black rock and we stopped the car to look for longer than was strictly necessary.',
    'quote-text':
      'In Lanzarote the black lava and the white village are the same thing seen from different angles. Both are what happens when the earth decides to be beautiful on its own terms.',
  },
  'Gran Canaria': {
    'cover-kicker': 'A continent in miniature',
    'cover-line-1': 'Maspalomas · Mountains · Old towns',
    'cover-line-2': 'Family roads · Beaches · Atlantic life',
    'intro-title': 'Eight landscapes on one island',
    'intro-body':
      'Gran Canaria is the most varied of the Canary Islands — a mountain road that takes you from beach to pine forest to cloud in an hour. The dunes at Maspalomas are a small Sahara at the edge of the Atlantic. Las Palmas has a cathedral, a market, and a beach at the end of the street. The interior is green and quiet and almost completely free of tourists.',
    'feature-title': 'From the dunes to the mountains',
    'feature-body':
      'The road into the interior climbs steadily until the sea is far below. The village of Tejeda sits in the ancient caldera with almond trees on every slope. In February they flower white and the whole valley smells sweet. Maspalomas, two hours south, is wide and flat and golden, with a lighthouse at the edge of the sand and the Saharan wind blowing through everything.',
    'feature-stat-1': 'Maspalomas dunes',
    'feature-stat-2': 'Tejeda mountains',
    'feature-stat-3': 'Las Palmas old town',
    'story-title': 'Road trip through the Atlantic heart',
    'story-lead': 'Gran Canaria: one day, eight landscapes',
    'story-body':
      'We rented a small car and drove all day from the dunes to the mountain and back along the coast. The children kept a score of how many times we stopped and lost count at eleven. The best stop was a mirador above the clouds where you could see both coasts of the island at once. We ate churros from a van and nobody complained about anything for the rest of the afternoon.',
    'quote-text':
      'Gran Canaria is small enough to cross in a day and large enough to hold a dozen different ideas about what an island should be.',
  },
  'La Palma': {
    'cover-kicker': 'Green mountains, dark skies',
    'cover-line-1': 'Forests · Volcanoes · Stars',
    'cover-line-2': 'Quiet villages · Island escape',
    'intro-title': 'The island under the stars',
    'intro-body':
      'La Palma is the greenest and most steeply mountainous of the Canary Islands — a caldera so large it has its own microclimate, forests of laurisilva draped in cloud, and the cleanest dark skies in Europe. The volcano of Cumbre Vieja last erupted in 2021. Villages on the west coast still have the feel of a place that has not quite caught up with the rest of the world, which is entirely the point.',
    'feature-title': 'The caldera and the cloud forest',
    'feature-body':
      'The road into the Caldera de Taburiente winds through pine forest and arrives at viewpoints where the cliffs drop a thousand metres to a green valley below. In the evenings the Roque de los Muchachos observatory opens to the public and the sky is remarkable. Children who have never been interested in astronomy ask questions for an hour. The dark and the silence do something to you.',
    'feature-stat-1': 'Caldera biosphere',
    'feature-stat-2': 'Stargazing reserve',
    'feature-stat-3': 'Cumbre Vieja lava',
    'story-title': 'Slow days in the green mountains',
    'story-lead': 'La Palma at its quietest and best',
    'story-body':
      'We came for the observatory and stayed for the forests. The laurisilva above Barlovento is so thick with moss and mist that you lose track of the altitude. In the afternoon we drove to a black-sand beach and watched the waves come in from the Atlantic for longer than we could explain. Some islands put things back into you.',
    'quote-text':
      'La Palma is what the other Canary Islands might have been before someone found them. It is worth finding for exactly that reason.',
  },
  'La Gomera': {
    'cover-kicker': 'Mist, forest and silence',
    'cover-line-1': 'Garajonay · Viewpoints · Hiking',
    'cover-line-2': 'Ancient forests · Island escape',
    'intro-title': 'Into the last laurel forest',
    'intro-body':
      'La Gomera is the small island you can see from Tenerife on a clear day and it takes twenty-five minutes by fast ferry to enter a completely different world. Garajonay national park is a laurisilva forest that has survived since the Tertiary period — mossy, misty, and green in a way that feels prehistoric. The viewpoints above the cloud are among the most dramatic in the Canaries.',
    'feature-title': 'Garajonay: the forest above the cloud',
    'feature-body':
      'Above the cloud Garajonay is all shade and dripping moss and the sound of birds you cannot see. The trail to Alto de Garajonay takes two hours and the views across to Tenerife, El Hierro and La Palma are extraordinary. The children found a stream and spent an hour building a dam. The silence is not the absence of sound so much as the presence of something older than noise.',
    'feature-stat-1': 'Garajonay UNESCO park',
    'feature-stat-2': 'Cloud forest trails',
    'feature-stat-3': 'Atlantic viewpoints',
    'story-title': 'A week above the clouds',
    'story-lead': 'La Gomera: the island that takes its time',
    'story-body':
      'We hired a car on the first day and found a viewpoint the guidebook had not mentioned — a ledge above the cloud with a stone bench and a view of five islands. We ate our lunch there and watched the cloud move below us like a slow white sea. On the ferry back the children asked when we could go again. The question is still open.',
    'quote-text':
      'La Gomera keeps its forest green and its silence clean and waits for you to notice. It is very patient. The island has been here for twelve million years.',
  },
  'El Hierro': {
    'cover-kicker': 'Wild coast, volcanic pools',
    'cover-line-1': 'Natural pools · Diving · Volcanoes',
    'cover-line-2': 'Remote · Peaceful · Atlantic wilderness',
    'intro-title': 'The end of the known world',
    'intro-body':
      'El Hierro was the westernmost point of the known world until Columbus sailed past it. It is still the most remote and least visited of the Canary Islands, and it rewards the commitment. The natural pools on the coast are extraordinary. The underwater reserve around the island is one of the best diving spots in Europe. You come here to be somewhere very far from ordinary.',
    'feature-title': 'The natural pools of the west coast',
    'feature-body':
      'The natural pools at La Maceta and Punta de la Restinga are formed where volcanic rock meets the sea and they are among the most beautiful places to swim in the Canaries. The water is clear and green and very cold on a calm day. Children approach them with the careful reverence they reserve for things that feel properly wild. The diving offshore is exceptional.',
    'feature-stat-1': 'Natural coast pools',
    'feature-stat-2': 'Marine reserve diving',
    'feature-stat-3': 'Volcanic landscapes',
    'story-title': 'Arriving at the edge of the Atlantic',
    'story-lead': 'El Hierro, the island no ferry changes',
    'story-body':
      'The ferry from Tenerife takes two and a half hours and by the time you arrive El Hierro already feels like a different kind of place. We drove slowly around the island in three days and saw almost nobody. The natural pools were empty on a Tuesday morning and the children swam for two hours. On the last evening we sat at a restaurant on a cliff above the sea and the wind was enormous and it was very good.',
    'quote-text':
      'El Hierro is the island at the edge of the map. When you get there, the wild coast and volcanic pools make ordinary travel feel very far away.',
  },
};

export function getCanaryFallbackCopy(destination: string): Record<string, string> {
  return ISLAND_FALLBACKS[destination] ?? {};
}

const BAD_IMAGE_KEYWORDS = [
  'london', 'paris', 'big ben', 'eiffel', 'eiffel tower', 'egypt',
  'camel', 'camels', 'desert camels', 'bali', 'bali temple', 'temple',
  'santorini', 'new york', 'dubai', 'dubai skyline', 'skyline',
  'screenshot', 'ui screenshot', 'poster', 'business', 'office', 'chart',
  'meme',
];

export function isLikelyBadImage(...values: Array<string | undefined>): boolean {
  const lower = values.filter(Boolean).join(' ').toLowerCase();
  return BAD_IMAGE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function hasWrongCanaryCopy(text: string): boolean {
  return isLikelyBadImage(text) || /\b(ai generated|lorem ipsum|photo placeholder|tripmag ai)\b/i.test(text);
}
