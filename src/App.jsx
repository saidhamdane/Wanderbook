import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'wanderbook.state.v2';

const DESTINATIONS = [
  {
    id: 'fuerteventura',
    name: 'Fuerteventura',
    description: 'Endless golden dunes, turquoise lagoons and family-friendly beaches.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    population: '120,000',
    language: 'Spanish',
    currency: 'EUR (€)',
    bestTime: 'All year'
  },
  {
    id: 'las-palmas',
    name: 'Las Palmas',
    description: 'A lively capital with colonial old town and Las Canteras beach.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    population: '380,000',
    language: 'Spanish',
    currency: 'EUR (€)',
    bestTime: 'Mar – Nov'
  },
  {
    id: 'tenerife',
    name: 'Tenerife',
    description: 'Home of Teide volcano, pine forests and lively coastal villages.',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    population: '950,000',
    language: 'Spanish',
    currency: 'EUR (€)',
    bestTime: 'All year'
  },
  {
    id: 'lanzarote',
    name: 'Lanzarote',
    description: 'Lunar volcanic landscapes, vineyards and white-washed villages.',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    population: '156,000',
    language: 'Spanish',
    currency: 'EUR (€)',
    bestTime: 'Apr – Oct'
  }
];

const DESTINATION_MEDIA = {
  'fuerteventura': {
    city: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
    landmark: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=80',
    food: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=1200&q=80'
  },
  'las-palmas': {
    city: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    landmark: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&q=80',
    food: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80'
  },
  'tenerife': {
    city: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    landmark: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
  },
  'lanzarote': {
    city: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    landmark: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80'
  }
};

const TEMPLATES = [
  {
    id: 'luxuryTraveler',
    name: 'Luxury Traveler',
    description: 'Elegant cream, navy and gold. Editorial serif feel for premium family memories.',
    colors: {
      bg: '#FDF6E9',
      page: '#FFFFFF',
      primary: '#0B2545',
      accent: '#C9913A',
      accentLight: '#E8B86D',
      text: '#1a2638',
      muted: '#54607a',
      coverText: '#FFFFFF'
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      accent: "'Playfair Display', serif"
    },
    coverLayout: 'overlay-bottom',
    coverGradient: 'linear-gradient(180deg, rgba(11,37,69,0.55) 0%, rgba(11,37,69,0.15) 35%, rgba(11,37,69,0.85) 100%)',
    imageRadius: 12,
    sectionLabel: 'CHAPTER'
  },
  {
    id: 'blueEditorial',
    name: 'Blue Editorial',
    description: 'Bold blue magazine with large image-led cover and editorial columns.',
    colors: {
      bg: '#EAF2FA',
      page: '#FFFFFF',
      primary: '#0E4D8C',
      accent: '#1E6BA8',
      accentLight: '#6BA9D8',
      text: '#0A2540',
      muted: '#456080',
      coverText: '#FFFFFF'
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
      accent: "'Inter', sans-serif"
    },
    coverLayout: 'split',
    coverGradient: 'linear-gradient(180deg, rgba(14,77,140,0.25) 0%, rgba(14,77,140,0.85) 100%)',
    imageRadius: 4,
    sectionLabel: 'EDITORIAL'
  },
  {
    id: 'minimalBrochure',
    name: 'Minimal Brochure',
    description: 'Clean white editorial pages with thin lines and quiet typography.',
    colors: {
      bg: '#F5F5F2',
      page: '#FFFFFF',
      primary: '#111111',
      accent: '#111111',
      accentLight: '#999999',
      text: '#1A1A1A',
      muted: '#6A6A6A',
      coverText: '#111111'
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
      accent: "'Inter', sans-serif"
    },
    coverLayout: 'minimal',
    coverGradient: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)',
    imageRadius: 0,
    sectionLabel: 'NO.'
  },
  {
    id: 'photoGrid',
    name: 'Photo Grid Magazine',
    description: 'Photo-first layouts with bold quad grids and minimal text overlays.',
    colors: {
      bg: '#1A1A1A',
      page: '#FFFFFF',
      primary: '#000000',
      accent: '#C9913A',
      accentLight: '#E8B86D',
      text: '#111111',
      muted: '#666666',
      coverText: '#FFFFFF'
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      accent: "'Montserrat', sans-serif"
    },
    coverLayout: 'photo-grid',
    coverGradient: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.8) 100%)',
    imageRadius: 4,
    sectionLabel: 'FRAME'
  },
  {
    id: 'darkAdventure',
    name: 'Dark Adventure',
    description: 'Cinematic dark navy with high-contrast type and warm sunset accents.',
    colors: {
      bg: '#0A0E1A',
      page: '#11151F',
      primary: '#F5F5F5',
      accent: '#E0985F',
      accentLight: '#F2B888',
      text: '#F2F2F2',
      muted: '#9AA3B5',
      coverText: '#FFFFFF'
    },
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Montserrat', sans-serif",
      accent: "'Montserrat', sans-serif"
    },
    coverLayout: 'cinematic',
    coverGradient: 'linear-gradient(180deg, rgba(10,14,26,0.35) 0%, rgba(10,14,26,0.92) 100%)',
    imageRadius: 6,
    sectionLabel: 'ACT'
  },
  {
    id: 'familyMemory',
    name: 'Family Memories',
    description: 'Warm scrapbook style with handwritten accents and soft pastel pages.',
    colors: {
      bg: '#FBEFE0',
      page: '#FFFAF2',
      primary: '#7A3D1F',
      accent: '#C9743A',
      accentLight: '#E8B388',
      text: '#3A2515',
      muted: '#7A6B58',
      coverText: '#3A2515'
    },
    fonts: {
      display: "'Caveat', cursive",
      body: "'Montserrat', sans-serif",
      accent: "'Caveat', cursive"
    },
    coverLayout: 'polaroid',
    coverGradient: 'linear-gradient(180deg, rgba(58,37,21,0.0) 0%, rgba(58,37,21,0.25) 100%)',
    imageRadius: 14,
    sectionLabel: 'MEMORY'
  }
];

const GENERATION_STEPS = [
  'Analysing your destination',
  'Writing the welcome letter',
  'Crafting your family story',
  'Choosing photo placements',
  'Writing food and culture',
  'Adding journey highlights',
  'Composing your magazine'
];

function buildFallback(destinationName, familyName) {
  const family = familyName && familyName.trim().length > 0 ? familyName : 'The Family';
  return {
    coverTitle: 'My Trip',
    subtitle: 'A Family Holiday in ' + destinationName,
    welcomeTitle: 'Welcome to ' + destinationName,
    welcomeText:
      'The ' + family + ' set foot on ' + destinationName + ' and were greeted by a soft Atlantic breeze, the scent of salt and sun-warmed lava stone. Eternal spring wrapped around us as our holiday began.\n\n' +
      'From volcanic peaks to endless golden beaches, the Canary Islands offered the perfect playground for our family. Every road bend revealed a new postcard — a hidden cove, a colourful village, a sky on fire at sunset.',
    storyTitle: 'Our ' + destinationName + ' Story',
    storyText:
      'Golden days in ' + destinationName + ' were stitched together by laughter, salty hair and the sound of waves. The children chased rainbows of fish in shallow lagoons while we sipped barraquito coffee in tiny plazas. Each evening the sky over the Atlantic burned orange, and the ' + family + ' grew a little closer.',
    quote: 'Where the ocean meets the volcano, our family found its own little corner of paradise.',
    highlights: [
      { title: 'Sunset over the Atlantic', text: 'A golden hour from our terrace that made everyone stop and watch.' },
      { title: 'Volcano Hike', text: 'A breath-taking walk on warm lava trails under endless sky.' },
      { title: 'Beach Picnic', text: 'Sandy toes, fresh papas arrugadas and shared smiles all afternoon.' }
    ],
    scenicTitle: 'Landscapes of ' + destinationName,
    scenicText: 'The wild beauty of ' + destinationName + ' — volcanic cliffs, hidden coves and skies that change colour every minute.',
    foodTitle: 'Canarian Flavours',
    foodText:
      'We fell in love with papas arrugadas con mojo, fresh grilled vieja, almogrote and bienmesabe. Simple, generous food made with island sunshine and shared at long tables under jacaranda trees.',
    tips: [
      { title: 'Pack Light Layers', text: 'Sea breezes can be cool even in summer — keep a light cardigan handy.' },
      { title: 'Slow Mornings', text: 'Let the kids set the pace. The islands reward slow travellers.' },
      { title: 'Try Local Markets', text: 'Saturday markets are the heart of Canarian village life.' }
    ],
    aiMagicBefore: 'Before — a quiet family ready for adventure.',
    aiMagicAfter: 'After — hearts full of ocean, volcano and Canarian sunshine.',
    backCoverQuote: 'And just like that, the Canary Islands wrote a new chapter in our family book.'
  };
}

async function callApi(payload) {
  try {
    const res = await fetch('/api/generate-magazine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('bad status ' + res.status);
    const data = await res.json();
    return Object.assign({}, buildFallback(payload.destination, payload.familyName), data);
  } catch (e) {
    return buildFallback(payload.destination, payload.familyName);
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 760 : true);
  useEffect(() => {
    function handle() { setIsMobile(window.innerWidth < 760); }
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return isMobile;
}

function loadFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function saveToStorage(data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* quota exceeded; ignore */ }
}

function clearStorage() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

function getPhoto(photos, i) {
  if (!photos || photos.length === 0) return '';
  return photos[i % photos.length];
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function EditableText({ value, onChange, editMode, as, style, multiline }) {
  const Tag = as || 'div';
  const ref = useRef(null);

  useEffect(() => {
    if (editMode && ref.current && ref.current.innerText !== (value || '')) {
      ref.current.innerText = value || '';
    }
  }, [editMode]);

  if (!editMode) {
    const display = multiline ? { whiteSpace: 'pre-wrap' } : null;
    return <Tag style={Object.assign({}, style, display)}>{value}</Tag>;
  }

  const editStyle = Object.assign(
    { whiteSpace: 'pre-wrap', minHeight: '1em' },
    style
  );

  return (
    <Tag
      ref={ref}
      className="wb-edit-target"
      style={editStyle}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.currentTarget.innerText)}
    >
      {value}
    </Tag>
  );
}

function EditablePhoto({ src, onReplace, editMode, style, children }) {
  const inputRef = useRef(null);

  function handleClick() {
    if (!editMode) return;
    inputRef.current && inputRef.current.click();
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const data = await readImageFile(file);
    onReplace(data);
    e.target.value = '';
  }

  const baseStyle = Object.assign(
    {
      backgroundImage: src ? 'url(' + src + ')' : 'none',
      backgroundColor: src ? 'transparent' : '#e7e2d6',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    },
    style
  );

  return (
    <div
      style={baseStyle}
      onClick={handleClick}
      role={editMode ? 'button' : undefined}
    >
      {children}
      {editMode && (
        <div className="wb-photo-replace">REPLACE PHOTO</div>
      )}
      {editMode && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}

function Header({ onReset, screen, editMode, setEditMode }) {
  return (
    <div className="wb-no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 60,
      background: '#0B2545',
      color: '#fff',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '3px solid #C9913A',
      boxShadow: '0 2px 10px rgba(0,0,0,0.18)'
    }}>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(16px, 4.4vw, 22px)', lineHeight: 1.1 }}>
          Wanderbook Family
        </div>
        <div style={{ fontSize: 'clamp(8px, 2.4vw, 10px)', letterSpacing: 2, color: '#E8B86D', marginTop: 2 }}>
          PERSONAL AI TRAVEL MAGAZINE
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {screen === 'magazine' && (
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              background: editMode ? '#C9913A' : 'transparent',
              color: '#fff',
              border: '1.5px solid ' + (editMode ? '#C9913A' : '#E8B86D'),
              padding: '6px 10px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1
            }}
          >
            {editMode ? 'Editing' : 'Edit'}
          </button>
        )}
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            color: '#fff',
            border: '1.5px solid #E8B86D',
            padding: '6px 10px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  const labels = ['Destination', 'Template', 'Photos', 'Magazine'];
  return (
    <div className="wb-no-print" style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 6,
      padding: '10px 8px 0',
      maxWidth: 720,
      margin: '0 auto'
    }}>
      {labels.map((l, i) => (
        <div key={l} style={{
          flex: 1,
          textAlign: 'center'
        }}>
          <div style={{
            height: 4,
            borderRadius: 2,
            background: i <= step ? '#C9913A' : '#e3dcc9'
          }} />
          <div style={{
            fontSize: 9,
            letterSpacing: 1.5,
            marginTop: 4,
            color: i <= step ? '#0B2545' : '#a3a18d',
            fontWeight: 700
          }}>
            {l.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenDestination({ state, setState, onNext }) {
  return (
    <div className="wb-fade" style={{ padding: '14px 16px 40px', maxWidth: 880, margin: '0 auto' }}>
      <Stepper step={0} />
      <div style={{ textAlign: 'center', margin: '14px 0 16px' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9913A', fontWeight: 700 }}>STEP 1 OF 4</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", margin: '6px 0 4px', fontSize: 'clamp(24px, 6vw, 34px)' }}>
          Choose your Canary Island
        </h1>
        <p style={{ margin: 0, color: '#54607a', fontSize: 13 }}>
          Four islands, one unforgettable family magazine.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12
      }}>
        {DESTINATIONS.map((d) => {
          const selected = state.destination && state.destination.id === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setState({ ...state, destination: d })}
              style={{
                border: selected ? '3px solid #C9913A' : '3px solid transparent',
                borderRadius: 18,
                overflow: 'hidden',
                padding: 0,
                background: '#fff',
                textAlign: 'left',
                boxShadow: selected ? '0 10px 28px rgba(201,145,58,0.35)' : '0 4px 14px rgba(11,37,69,0.08)',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{
                height: 130,
                backgroundImage: 'url(' + d.image + ')',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: '#0B2545' }}>
                  {d.name}
                </div>
                <div style={{ fontSize: 12, color: '#5a6678', marginTop: 4, lineHeight: 1.4 }}>
                  {d.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: 18,
        background: '#fff',
        borderRadius: 18,
        padding: 16,
        boxShadow: '0 6px 18px rgba(11,37,69,0.08)'
      }}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0B2545', marginBottom: 6, letterSpacing: 1.5 }}>
              FAMILY NAME
            </label>
            <input
              type="text"
              value={state.familyName}
              onChange={(e) => setState({ ...state, familyName: e.target.value })}
              placeholder="The Hamdane Family"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #d7dde6',
                borderRadius: 12,
                fontSize: 15,
                outline: 'none'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0B2545', marginBottom: 6, letterSpacing: 1.5 }}>
              TRAVEL DATES
            </label>
            <input
              type="text"
              value={state.travelDates}
              onChange={(e) => setState({ ...state, travelDates: e.target.value })}
              placeholder="June 12 – June 22, 2026"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #d7dde6',
                borderRadius: 12,
                fontSize: 15,
                outline: 'none'
              }}
            />
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={!state.destination || !state.familyName.trim() || !state.travelDates.trim()}
          style={{
            marginTop: 16,
            width: '100%',
            background: (!state.destination || !state.familyName.trim() || !state.travelDates.trim()) ? '#c8cfdb' : 'linear-gradient(135deg, #C9913A, #E8B86D)',
            color: '#fff',
            border: 'none',
            padding: '14px 18px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          Choose Template →
        </button>
      </div>
    </div>
  );
}

function TemplatePreviewCard({ template, destination, selected, onSelect }) {
  const isMobile = useIsMobile();
  const c = template.colors;
  const photo = (destination && destination.image) || 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&q=80';
  const layout = template.coverLayout;
  const previewHeight = isMobile ? 190 : 220;

  function renderMini() {
    if (layout === 'split') {
      return (
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{
            flex: '0 0 55%',
            backgroundImage: 'url(' + photo + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          <div style={{
            flex: 1,
            background: c.page,
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: c.accent, fontWeight: 700 }}>ISSUE 01</div>
              <div style={{ width: 22, height: 2, background: c.accent, marginTop: 6 }} />
            </div>
            <div>
              <div style={{
                fontFamily: template.fonts.display,
                fontWeight: 800,
                fontSize: 22,
                color: c.primary,
                lineHeight: 0.9
              }}>Travel</div>
              <div style={{
                fontFamily: template.fonts.display,
                fontStyle: 'italic',
                fontSize: 11,
                color: c.muted,
                marginTop: 4
              }}>Editorial</div>
            </div>
          </div>
        </div>
      );
    }

    if (layout === 'minimal') {
      return (
        <div style={{
          background: c.page,
          height: '100%',
          padding: '12px 12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 9,
            letterSpacing: 2,
            color: c.muted,
            fontWeight: 700
          }}>
            <span>NO. 01</span>
            <span>WANDERBOOK</span>
          </div>
          <div style={{ height: 1, background: '#dadada', marginTop: 6 }} />
          <div style={{
            fontFamily: template.fonts.display,
            fontWeight: 700,
            fontSize: 24,
            color: c.primary,
            marginTop: 8,
            lineHeight: 1
          }}>Traveller</div>
          <div style={{
            marginTop: 8,
            flex: 1,
            backgroundImage: 'url(' + photo + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 60
          }} />
          <div style={{
            marginTop: 6,
            fontSize: 9,
            letterSpacing: 2,
            color: c.muted
          }}>ISLAND ISSUE</div>
        </div>
      );
    }

    if (layout === 'photo-grid') {
      return (
        <div style={{ height: '100%', position: 'relative', background: '#111' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 3,
            height: '100%'
          }}>
            <div style={{
              backgroundImage: 'url(' + photo + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'left top'
            }} />
            <div style={{
              backgroundImage: 'url(' + photo + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'right top',
              filter: 'hue-rotate(15deg) brightness(0.85)'
            }} />
            <div style={{
              backgroundImage: 'url(' + photo + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'left bottom',
              filter: 'brightness(0.65) contrast(1.1)'
            }} />
            <div style={{
              backgroundImage: 'url(' + photo + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'right bottom',
              filter: 'sepia(0.4) brightness(0.95)'
            }} />
          </div>
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 10,
            color: '#fff',
            fontFamily: template.fonts.display,
            fontWeight: 800,
            fontSize: 16,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }}>FRAMES</div>
        </div>
      );
    }

    if (layout === 'cinematic') {
      return (
        <div style={{ height: '100%', position: 'relative', background: c.bg }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(' + photo + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.55) saturate(0.85)'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,14,26,0.15) 0%, rgba(10,14,26,0.9) 100%)'
          }} />
          <div style={{
            position: 'absolute',
            top: 12,
            left: 14,
            fontSize: 9,
            letterSpacing: 2.5,
            color: c.accentLight,
            fontWeight: 700
          }}>ACT 01</div>
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            color: '#fff'
          }}>
            <div style={{
              fontFamily: template.fonts.display,
              fontWeight: 800,
              fontSize: 22,
              lineHeight: 0.9,
              letterSpacing: -0.5
            }}>Wild</div>
            <div style={{ width: 26, height: 2, background: c.accent, margin: '6px 0' }} />
            <div style={{
              fontSize: 9,
              letterSpacing: 2,
              color: c.accentLight,
              fontStyle: 'italic'
            }}>ADVENTURE</div>
          </div>
        </div>
      );
    }

    if (layout === 'polaroid') {
      return (
        <div style={{
          height: '100%',
          background: c.bg,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%) rotate(-4deg)',
            width: '68%',
            background: '#fff',
            padding: 6,
            paddingBottom: 18,
            boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
          }}>
            <div style={{
              height: 80,
              backgroundImage: 'url(' + photo + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </div>
          <div style={{
            position: 'absolute',
            bottom: 10,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: template.fonts.display,
            fontWeight: 700,
            fontSize: 24,
            color: c.primary,
            transform: 'rotate(-2deg)'
          }}>Our Trip</div>
        </div>
      );
    }

    // overlay-bottom (luxuryTraveler default)
    return (
      <div style={{
        height: '100%',
        position: 'relative',
        backgroundImage: 'url(' + photo + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(11,37,69,0.35) 0%, rgba(11,37,69,0.05) 35%, rgba(11,37,69,0.85) 100%)'
        }} />
        <div style={{
          position: 'absolute',
          top: 12,
          left: 14,
          right: 14,
          display: 'flex',
          justifyContent: 'space-between',
          color: c.accentLight,
          fontSize: 9,
          letterSpacing: 2,
          fontWeight: 700
        }}>
          <span>VOL. 01</span>
          <span>MGZ</span>
        </div>
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          color: '#fff'
        }}>
          <div style={{
            fontFamily: template.fonts.display,
            fontWeight: 800,
            fontSize: 22,
            lineHeight: 0.95
          }}>My Trip</div>
          <div style={{
            fontSize: 10,
            letterSpacing: 1.5,
            color: c.accentLight,
            marginTop: 4,
            fontStyle: 'italic'
          }}>Travel</div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(template)}
      style={{
        textAlign: 'left',
        padding: 14,
        background: '#fff',
        border: selected ? '3px solid #C9913A' : '3px solid transparent',
        borderRadius: 26,
        boxShadow: selected ? '0 12px 28px rgba(201,145,58,0.35)' : '0 4px 14px rgba(11,37,69,0.08)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 430,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 0
      }}
    >
      <div style={{
        width: '100%',
        height: previewHeight,
        maxHeight: 220,
        overflow: 'hidden',
        borderRadius: 20,
        position: 'relative',
        background: c.bg
      }}>
        {renderMini()}
      </div>
      <div style={{ padding: '0 2px 2px' }}>
        <div style={{
          fontSize: 9,
          letterSpacing: 2.5,
          color: '#C9913A',
          fontWeight: 700
        }}>MAGAZINE TEMPLATE</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 18,
          color: '#0B2545',
          marginTop: 3,
          lineHeight: 1.2
        }}>{template.name}</div>
        <div style={{
          fontSize: 12,
          color: '#5a6678',
          marginTop: 4,
          lineHeight: 1.45
        }}>{template.description}</div>
        <div style={{
          marginTop: 12,
          display: 'inline-block',
          padding: '8px 16px',
          borderRadius: 999,
          background: selected ? '#C9913A' : '#0B2545',
          color: '#fff',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.5
        }}>
          {selected ? 'SELECTED ✓' : 'SELECT TEMPLATE'}
        </div>
      </div>
    </button>
  );
}

function ScreenTemplate({ state, setState, onNext, onBack }) {
  const isMobile = useIsMobile();
  return (
    <div className="wb-fade" style={{ padding: '14px 16px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <Stepper step={1} />
      <div style={{ textAlign: 'center', margin: '14px 0 16px' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9913A', fontWeight: 700 }}>STEP 2 OF 4</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", margin: '6px 0 4px', fontSize: 'clamp(24px, 6vw, 34px)' }}>
          Choose your magazine template
        </h1>
        <p style={{ margin: 0, color: '#54607a', fontSize: 13 }}>
          Six original layouts inspired by premium travel magazines.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: isMobile ? 18 : 18,
        justifyItems: 'center'
      }}>
        {TEMPLATES.map((t) => (
          <TemplatePreviewCard
            key={t.id}
            template={t}
            destination={state.destination}
            selected={state.templateId === t.id}
            onSelect={(tpl) => setState({ ...state, templateId: tpl.id })}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <button
          onClick={onBack}
          style={{
            background: '#fff',
            color: '#0B2545',
            border: '1.5px solid #d7dde6',
            padding: '14px 18px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700
          }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!state.templateId}
          style={{
            flex: 1,
            background: state.templateId ? 'linear-gradient(135deg, #C9913A, #E8B86D)' : '#c8cfdb',
            color: '#fff',
            border: 'none',
            padding: '14px 18px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          Upload Photos →
        </button>
      </div>
    </div>
  );
}

function ScreenUpload({ state, setState, onNext, onBack }) {
  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    const remaining = 20 - state.photos.length;
    const limited = files.slice(0, remaining);
    const datas = await Promise.all(limited.map((f) => readImageFile(f)));
    setState((prev) => ({ ...prev, photos: [...prev.photos, ...datas] }));
    e.target.value = '';
  }

  function removePhoto(i) {
    setState((prev) => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }));
  }

  const enough = state.photos.length >= 5;

  return (
    <div className="wb-fade" style={{ padding: '14px 16px 40px', maxWidth: 880, margin: '0 auto' }}>
      <Stepper step={2} />
      <div style={{ textAlign: 'center', margin: '14px 0 16px' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9913A', fontWeight: 700 }}>STEP 3 OF 4</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", margin: '6px 0 4px', fontSize: 'clamp(24px, 6vw, 34px)' }}>
          Upload your family photos
        </h1>
        <p style={{ margin: 0, color: '#54607a', fontSize: 13 }}>
          Add 5–20 photos. Your magazine will feature them.
        </p>
      </div>

      <label style={{
        display: 'block',
        background: '#fff',
        border: '2px dashed #E8B86D',
        borderRadius: 18,
        padding: 22,
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(11,37,69,0.06)'
      }}>
        <div style={{ fontSize: 36 }}>📸</div>
        <div style={{ fontWeight: 700, marginTop: 4, color: '#0B2545' }}>Tap to upload photos</div>
        <div style={{ fontSize: 12, color: '#7a849a', marginTop: 4 }}>
          {state.photos.length} / 20 selected — minimum 5
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          style={{ display: 'none' }}
        />
      </label>

      {state.photos.length > 0 && (
        <div style={{
          marginTop: 14,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: 10
        }}>
          {state.photos.map((src, i) => (
            <div key={i} style={{
              position: 'relative',
              paddingTop: '100%',
              borderRadius: 12,
              overflow: 'hidden',
              backgroundImage: 'url(' + src + ')',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 3px 10px rgba(0,0,0,0.12)'
            }}>
              <button
                onClick={() => removePhoto(i)}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(0,0,0,0.65)',
                  color: '#fff',
                  fontSize: 14
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: '#fff',
            color: '#0B2545',
            border: '1.5px solid #d7dde6',
            padding: '14px 18px',
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 700
          }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!enough}
          style={{
            flex: 1,
            background: enough ? 'linear-gradient(135deg, #C9913A, #E8B86D)' : '#c8cfdb',
            color: '#fff',
            border: 'none',
            padding: '14px 18px',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          Generate Magazine →
        </button>
      </div>
    </div>
  );
}

function ScreenGenerating({ state, onDone }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex += 1;
      if (cancelled) return;
      if (stepIndex >= GENERATION_STEPS.length) clearInterval(interval);
      else setStep(stepIndex);
    }, 800);

    let pct = 0;
    const progInterval = setInterval(() => {
      pct += 2;
      if (cancelled) return;
      if (pct >= 95) { pct = 95; clearInterval(progInterval); }
      setProgress(pct);
    }, 120);

    callApi({
      destination: state.destination.name,
      familyName: state.familyName,
      travelDate: state.travelDates,
      templateId: state.templateId,
      photoCount: state.photos.length
    }).then((content) => {
      if (cancelled) return;
      setProgress(100);
      setTimeout(() => { if (!cancelled) onDone(content); }, 400);
    });

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="wb-fade" style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      textAlign: 'center'
    }}>
      <div className="wb-book" style={{ fontSize: 80 }}>📖</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", margin: '18px 0 6px', fontSize: 'clamp(22px, 5vw, 30px)' }}>
        Writing your family magazine…
      </h2>
      <p style={{ margin: 0, color: '#54607a', fontSize: 14 }}>
        {state.destination.name} · {state.familyName}
      </p>

      <div style={{ width: '100%', maxWidth: 360, marginTop: 22 }}>
        <div style={{ height: 10, background: '#eadfca', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{
            width: progress + '%',
            height: '100%',
            background: 'linear-gradient(90deg, #C9913A, #E8B86D)',
            transition: 'width 0.25s ease'
          }} />
        </div>
        <div style={{ fontSize: 12, color: '#7a849a', marginTop: 6, letterSpacing: 1 }}>{progress}%</div>
      </div>

      <div style={{ marginTop: 18, width: '100%', maxWidth: 360, textAlign: 'left' }}>
        {GENERATION_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '7px 0',
              opacity: done || active ? 1 : 0.45
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: done ? '#27AE60' : (active ? '#C9913A' : '#d7dde6'),
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700
              }}>{done ? '✓' : i + 1}</div>
              <div style={{ fontSize: 13, color: '#0B2545', fontWeight: active ? 600 : 400 }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PageWrapper({ children, bg, template, fullBleed }) {
  const isMobile = useIsMobile();
  return (
    <div className="wb-page" style={{
      position: 'relative',
      width: '100%',
      minHeight: isMobile ? 560 : 720,
      background: bg || (template && template.colors.page) || '#fff',
      borderRadius: 24,
      overflow: 'hidden',
      boxShadow: '0 18px 50px rgba(11,37,69,0.25)',
      color: template ? template.colors.text : '#0B2545',
      fontFamily: template ? template.fonts.body : "'Montserrat', sans-serif"
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ template, children }) {
  return (
    <div style={{
      fontSize: 10,
      letterSpacing: 3,
      color: template.colors.accent,
      fontWeight: 700,
      fontFamily: template.fonts.body
    }}>
      {children}
    </div>
  );
}

function CoverPage({ state, template, content, editMode, ctx }) {
  const photo = getPhoto(state.photos, 0);
  const c = template.colors;
  const layout = template.coverLayout;

  if (layout === 'split') {
    return (
      <PageWrapper template={template} bg={c.page}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'inherit' }}>
          <EditablePhoto
            src={photo}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(0, d)}
            style={{ height: 280, width: '100%' }}
          />
          <div style={{ padding: '18px 18px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: 2, color: c.accent, fontWeight: 700 }}>
              <span>{state.travelDates}</span>
              <span>ISSUE 01</span>
            </div>
            <EditableText
              as="h1"
              editMode={editMode}
              value={content.coverTitle}
              onChange={(v) => ctx.updateContent('coverTitle', v)}
              style={{
                margin: 0,
                fontFamily: template.fonts.display,
                fontWeight: 800,
                fontSize: 'clamp(40px, 11vw, 64px)',
                lineHeight: 0.9,
                color: c.primary,
                letterSpacing: -1
              }}
            />
            <div style={{ height: 3, width: 60, background: c.accent }} />
            <EditableText
              editMode={editMode}
              value={content.subtitle}
              onChange={(v) => ctx.updateContent('subtitle', v)}
              style={{
                fontFamily: template.fonts.display,
                fontStyle: 'italic',
                fontSize: 'clamp(14px, 4vw, 18px)',
                color: c.muted
              }}
            />
            <div style={{ marginTop: 'auto', fontSize: 11, color: c.muted, letterSpacing: 1.5 }}>
              {state.destination.name.toUpperCase()} · BY {state.familyName.toUpperCase()}
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (layout === 'minimal') {
    return (
      <PageWrapper template={template} bg={c.page}>
        <div style={{ padding: '24px 22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: 3, color: c.muted, fontWeight: 700 }}>
            <span>WANDERBOOK · NO. 01</span>
            <span>{state.travelDates}</span>
          </div>
          <div style={{ height: 1, background: '#dadada' }} />
          <EditableText
            as="h1"
            editMode={editMode}
            value={content.coverTitle}
            onChange={(v) => ctx.updateContent('coverTitle', v)}
            style={{
              margin: 0,
              fontFamily: template.fonts.display,
              fontWeight: 700,
              fontSize: 'clamp(44px, 12vw, 70px)',
              lineHeight: 0.95,
              color: c.primary
            }}
          />
          <EditableText
            editMode={editMode}
            value={content.subtitle}
            onChange={(v) => ctx.updateContent('subtitle', v)}
            style={{
              fontStyle: 'italic',
              fontFamily: template.fonts.display,
              fontSize: 'clamp(14px, 4vw, 18px)',
              color: c.muted
            }}
          />
          <EditablePhoto
            src={photo}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(0, d)}
            style={{ height: 260, width: '100%' }}
          />
          <div style={{ height: 1, background: '#dadada' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: 2, color: c.muted }}>
            <span>{state.destination.name.toUpperCase()}</span>
            <span>BY {state.familyName.toUpperCase()}</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (layout === 'photo-grid') {
    return (
      <PageWrapper template={template} bg="#000">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 3,
          height: 360
        }}>
          {[0, 1, 2, 3].map((i) => (
            <EditablePhoto
              key={i}
              src={getPhoto(state.photos, i)}
              editMode={editMode}
              onReplace={(d) => ctx.replacePhoto(i, d)}
              style={{ width: '100%', height: '100%' }}
            />
          ))}
        </div>
        <div style={{ padding: '16px 18px 20px', color: '#fff', background: '#000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: 3, color: c.accentLight, fontWeight: 700 }}>
            <span>FRAMES · 01</span>
            <span>{state.travelDates}</span>
          </div>
          <EditableText
            as="h1"
            editMode={editMode}
            value={content.coverTitle}
            onChange={(v) => ctx.updateContent('coverTitle', v)}
            style={{
              margin: '6px 0 4px',
              fontFamily: template.fonts.display,
              fontWeight: 800,
              fontSize: 'clamp(34px, 9vw, 50px)',
              lineHeight: 0.95
            }}
          />
          <EditableText
            editMode={editMode}
            value={content.subtitle}
            onChange={(v) => ctx.updateContent('subtitle', v)}
            style={{ fontSize: 12, color: c.accentLight, letterSpacing: 1, fontStyle: 'italic' }}
          />
          <div style={{ marginTop: 8, fontSize: 10, letterSpacing: 2, color: '#bbb' }}>
            {state.destination.name.toUpperCase()} · {state.familyName.toUpperCase()}
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (layout === 'cinematic') {
    return (
      <PageWrapper template={template} bg="#000">
        <EditablePhoto
          src={photo}
          editMode={editMode}
          onReplace={(d) => ctx.replacePhoto(0, d)}
          style={{ position: 'absolute', inset: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: template.coverGradient, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 18, left: 18, right: 18, display: 'flex', justifyContent: 'space-between', color: c.accentLight, fontSize: 10, letterSpacing: 2.5, fontWeight: 700 }}>
          <span>ACT 01</span>
          <span>{state.travelDates}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: '#fff' }}>
          <EditableText
            as="h1"
            editMode={editMode}
            value={content.coverTitle}
            onChange={(v) => ctx.updateContent('coverTitle', v)}
            style={{
              margin: 0,
              fontFamily: template.fonts.display,
              fontWeight: 800,
              fontSize: 'clamp(46px, 13vw, 72px)',
              lineHeight: 0.9,
              letterSpacing: -1
            }}
          />
          <div style={{ height: 2, width: 50, background: c.accent, margin: '10px 0' }} />
          <EditableText
            editMode={editMode}
            value={content.subtitle}
            onChange={(v) => ctx.updateContent('subtitle', v)}
            style={{
              fontStyle: 'italic',
              fontFamily: template.fonts.display,
              fontSize: 'clamp(13px, 3.6vw, 16px)',
              color: c.accentLight
            }}
          />
          <div style={{ marginTop: 12, fontSize: 11, letterSpacing: 2, color: '#bbb' }}>
            {state.destination.name.toUpperCase()} · {state.familyName.toUpperCase()}
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (layout === 'polaroid') {
    return (
      <PageWrapper template={template} bg={c.bg}>
        <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: c.accent, fontWeight: 700, letterSpacing: 2 }}>
            <span>MEMORY · 01</span>
            <span>{state.travelDates}</span>
          </div>
          <div style={{
            background: '#fff',
            padding: 10,
            paddingBottom: 30,
            transform: 'rotate(-3deg)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
            margin: '4px 8px 8px'
          }}>
            <EditablePhoto
              src={photo}
              editMode={editMode}
              onReplace={(d) => ctx.replacePhoto(0, d)}
              style={{ width: '100%', height: 220 }}
            />
          </div>
          <EditableText
            as="h1"
            editMode={editMode}
            value={content.coverTitle}
            onChange={(v) => ctx.updateContent('coverTitle', v)}
            style={{
              margin: 0,
              fontFamily: template.fonts.display,
              fontWeight: 700,
              fontSize: 'clamp(46px, 13vw, 70px)',
              lineHeight: 1,
              color: c.primary,
              textAlign: 'center',
              transform: 'rotate(-1deg)'
            }}
          />
          <EditableText
            editMode={editMode}
            value={content.subtitle}
            onChange={(v) => ctx.updateContent('subtitle', v)}
            style={{
              fontSize: 16,
              color: c.muted,
              textAlign: 'center',
              fontFamily: template.fonts.display
            }}
          />
          <div style={{ textAlign: 'center', fontSize: 11, color: c.muted, letterSpacing: 1.5 }}>
            {state.destination.name} · {state.familyName}
          </div>
        </div>
      </PageWrapper>
    );
  }

  // overlay-bottom (luxury default)
  return (
    <PageWrapper template={template}>
      <EditablePhoto
        src={photo}
        editMode={editMode}
        onReplace={(d) => ctx.replacePhoto(0, d)}
        style={{ position: 'absolute', inset: 0 }}
      />
      <div style={{ position: 'absolute', inset: 0, background: template.coverGradient, pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', top: 16, left: 18, right: 18,
        display: 'flex', justifyContent: 'space-between', color: '#fff',
        fontSize: 11, letterSpacing: 2, fontWeight: 600
      }}>
        <span>{state.travelDates}</span>
        <span>VOL. 01</span>
      </div>
      <div style={{ position: 'absolute', top: '20%', left: 20, right: 20, color: c.coverText }}>
        <EditableText
          editMode={editMode}
          value={content.coverTitle}
          onChange={(v) => ctx.updateContent('coverTitle', v)}
          style={{
            fontFamily: template.fonts.display,
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 6.5vw, 36px)',
            lineHeight: 1.05,
            fontWeight: 500
          }}
        />
        <div style={{
          fontFamily: template.fonts.display,
          fontWeight: 800,
          fontSize: 'clamp(48px, 14vw, 82px)',
          lineHeight: 0.95,
          marginTop: 4
        }}>Travel</div>
        <div style={{
          display: 'inline-block', marginTop: 10, padding: '4px 10px',
          background: c.accent, color: c.primary, fontSize: 10, fontWeight: 800,
          letterSpacing: 3, borderRadius: 4
        }}>MGZ</div>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, color: '#fff' }}>
        <div style={{ fontFamily: template.fonts.display, fontWeight: 700, fontSize: 'clamp(22px, 5.6vw, 30px)', lineHeight: 1.1 }}>
          {state.destination.name}
        </div>
        <EditableText
          editMode={editMode}
          value={content.subtitle}
          onChange={(v) => ctx.updateContent('subtitle', v)}
          style={{
            fontSize: 'clamp(11px, 3vw, 13px)', marginTop: 4,
            color: c.accentLight, letterSpacing: 1, fontStyle: 'italic'
          }}
        />
        <div style={{ fontSize: 11, marginTop: 8, opacity: 0.9 }}>By {state.familyName}</div>
        <div style={{
          display: 'inline-block', marginTop: 10, padding: '4px 10px',
          background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)',
          color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 3, borderRadius: 4
        }}>✨ AI ENHANCED</div>
      </div>
    </PageWrapper>
  );
}

function InfoCell({ label, value, c }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: c.accent, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: c.primary, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function WelcomePage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  const d = state.destination;
  return (
    <PageWrapper template={template} bg={c.page}>
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel template={template}>{template.sectionLabel} ONE</SectionLabel>
        <EditableText
          as="h2"
          editMode={editMode}
          value={content.welcomeTitle}
          onChange={(v) => ctx.updateContent('welcomeTitle', v)}
          style={{
            margin: 0,
            fontFamily: template.fonts.display,
            fontSize: 'clamp(22px, 6vw, 30px)',
            lineHeight: 1.15,
            color: c.primary,
            fontWeight: 700
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <EditablePhoto
            src={getPhoto(state.photos, 1)}
            editMode={editMode}
            onReplace={(d2) => ctx.replacePhoto(1, d2)}
            style={{ paddingTop: '70%', borderRadius: template.imageRadius }}
          />
          <EditablePhoto
            src={getPhoto(state.photos, 2)}
            editMode={editMode}
            onReplace={(d2) => ctx.replacePhoto(2, d2)}
            style={{ paddingTop: '70%', borderRadius: template.imageRadius }}
          />
        </div>
        <EditableText
          editMode={editMode}
          multiline
          value={content.welcomeText}
          onChange={(v) => ctx.updateContent('welcomeText', v)}
          style={{
            fontSize: 'clamp(11px, 3.1vw, 13px)',
            lineHeight: 1.5,
            color: c.text,
            margin: 0
          }}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          background: c.page === '#FFFFFF' ? '#fafaf5' : 'rgba(255,255,255,0.08)',
          padding: 10,
          borderRadius: 10,
          border: '1px solid ' + (c.accentLight + '55')
        }}>
          <InfoCell c={c} label="POPULATION" value={d.population} />
          <InfoCell c={c} label="LANGUAGE" value={d.language} />
          <InfoCell c={c} label="CURRENCY" value={d.currency} />
          <InfoCell c={c} label="BEST TIME" value={d.bestTime} />
        </div>
      </div>
    </PageWrapper>
  );
}

function StoryPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  return (
    <PageWrapper template={template} bg={c.page}>
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel template={template}>OUR STORY</SectionLabel>
        <EditableText
          as="h2"
          editMode={editMode}
          value={content.storyTitle}
          onChange={(v) => ctx.updateContent('storyTitle', v)}
          style={{
            margin: 0,
            fontFamily: template.fonts.display,
            fontSize: 'clamp(20px, 5.5vw, 26px)',
            lineHeight: 1.15,
            color: c.primary,
            fontWeight: 700
          }}
        />
        <EditablePhoto
          src={getPhoto(state.photos, 3)}
          editMode={editMode}
          onReplace={(d) => ctx.replacePhoto(3, d)}
          style={{ height: 140, borderRadius: template.imageRadius }}
        />
        <div style={{ fontSize: 'clamp(11px, 3.1vw, 13px)', lineHeight: 1.5, color: c.text, overflow: 'hidden' }}>
          <span style={{
            float: 'left',
            fontFamily: template.fonts.display,
            fontSize: 'clamp(42px, 11vw, 54px)',
            lineHeight: 0.85,
            color: c.accent,
            fontWeight: 800,
            marginRight: 8,
            marginTop: 2
          }}>G</span>
          <EditableText
            editMode={editMode}
            multiline
            value={content.storyText}
            onChange={(v) => ctx.updateContent('storyText', v)}
            style={{ display: 'inline', color: c.text }}
          />
        </div>
        <div style={{ clear: 'both' }} />
        <EditableText
          editMode={editMode}
          value={content.quote}
          onChange={(v) => ctx.updateContent('quote', v)}
          style={{
            background: c.page === '#FFFFFF' ? '#FDF6E9' : 'rgba(255,255,255,0.06)',
            borderLeft: '4px solid ' + c.accent,
            padding: '8px 12px',
            borderRadius: 6,
            fontStyle: 'italic',
            fontFamily: template.fonts.display,
            fontSize: 'clamp(11px, 3vw, 13px)',
            color: c.primary,
            lineHeight: 1.35
          }}
        />
      </div>
    </PageWrapper>
  );
}

function QuotePage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  return (
    <PageWrapper template={template} bg={c.accent}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 80% 20%, ' + c.accentLight + '44, transparent 60%)'
      }} />
      <EditablePhoto
        src={getPhoto(state.photos, 4)}
        editMode={editMode}
        onReplace={(d) => ctx.replacePhoto(4, d)}
        style={{
          position: 'absolute', top: 18, right: 18,
          width: 110, height: 110, borderRadius: 14,
          border: '3px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
        }}
      />
      <div style={{
        position: 'absolute', top: 22, left: 20,
        color: c.accentLight, fontSize: 10, letterSpacing: 3, fontWeight: 700
      }}>WORDS TO REMEMBER</div>

      <div style={{
        position: 'absolute', left: 22, right: 22,
        top: '50%', transform: 'translateY(-40%)',
        color: '#fff'
      }}>
        <EditableText
          editMode={editMode}
          value={'“' + (content.quote || '') + '”'}
          onChange={(v) => ctx.updateContent('quote', v.replace(/^[“"]|[”"]$/g, ''))}
          style={{
            fontFamily: template.fonts.display,
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 'clamp(20px, 6vw, 30px)',
            lineHeight: 1.2,
            color: '#fff'
          }}
        />
        <div style={{ marginTop: 14, fontSize: 11, letterSpacing: 2, color: c.accentLight, fontWeight: 600 }}>
          — {state.familyName.toUpperCase()}, {state.destination.name.toUpperCase()}
        </div>
      </div>
    </PageWrapper>
  );
}

function HighlightsPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  const main = (content.highlights && content.highlights[0]) || { title: '', text: '' };
  const mini = (content.highlights && content.highlights.slice(1, 4)) || [];

  function updateHighlight(i, key, v) {
    const next = (content.highlights || []).slice();
    next[i] = Object.assign({}, next[i] || { title: '', text: '' }, { [key]: v });
    ctx.updateContent('highlights', next);
  }

  return (
    <PageWrapper template={template} bg={c.page}>
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel template={template}>HIGHLIGHTS</SectionLabel>
        <h2 style={{
          margin: 0,
          fontFamily: template.fonts.display,
          fontSize: 'clamp(19px, 5.2vw, 24px)',
          lineHeight: 1.15,
          color: c.primary,
          fontWeight: 700
        }}>Best Moments of the Journey</h2>

        <div style={{ position: 'relative' }}>
          <EditablePhoto
            src={getPhoto(state.photos, 5)}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(5, d)}
            style={{ height: 150, borderRadius: template.imageRadius }}
          />
          <div style={{
            position: 'absolute', left: 10, right: 10, bottom: 10,
            background: 'rgba(11,37,69,0.85)', color: '#fff',
            padding: '8px 10px', borderRadius: 8, pointerEvents: editMode ? 'none' : 'auto'
          }}>
            <EditableText
              editMode={editMode}
              value={main.title}
              onChange={(v) => updateHighlight(0, 'title', v)}
              style={{ fontWeight: 700, fontSize: 12, fontFamily: template.fonts.display, color: '#fff', pointerEvents: 'auto' }}
            />
            <EditableText
              editMode={editMode}
              value={main.text}
              onChange={(v) => updateHighlight(0, 'text', v)}
              style={{ fontSize: 10.5, marginTop: 2, lineHeight: 1.35, opacity: 0.95, color: '#fff', pointerEvents: 'auto' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[0, 1, 2].map((idx) => {
            const h = mini[idx] || { title: '', text: '' };
            return (
              <div key={idx} style={{
                background: c.page === '#FFFFFF' ? '#FDF6E9' : 'rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: 8,
                border: '1px solid ' + (c.accentLight + '55')
              }}>
                <EditableText
                  editMode={editMode}
                  value={h.title}
                  onChange={(v) => updateHighlight(idx + 1, 'title', v)}
                  style={{
                    fontSize: 10.5, fontWeight: 700, color: c.primary,
                    fontFamily: template.fonts.display, lineHeight: 1.2
                  }}
                />
                <EditableText
                  editMode={editMode}
                  value={h.text}
                  onChange={(v) => updateHighlight(idx + 1, 'text', v)}
                  style={{ fontSize: 9.5, color: c.muted, marginTop: 3, lineHeight: 1.35 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </PageWrapper>
  );
}

function ScenicPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  const dest = state.destination;
  const media = DESTINATION_MEDIA[dest.id];
  return (
    <PageWrapper template={template} bg={c.page}>
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel template={template}>SCENIC</SectionLabel>
        <EditableText
          as="h2"
          editMode={editMode}
          value={content.scenicTitle}
          onChange={(v) => ctx.updateContent('scenicTitle', v)}
          style={{
            margin: 0,
            fontFamily: template.fonts.display,
            fontSize: 'clamp(19px, 5.2vw, 24px)',
            lineHeight: 1.15,
            color: c.primary,
            fontWeight: 700
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div style={{
            paddingTop: '85%',
            backgroundImage: 'url(' + media.landmark + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: template.imageRadius
          }} />
          <EditablePhoto
            src={getPhoto(state.photos, 6)}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(6, d)}
            style={{ paddingTop: '85%', borderRadius: template.imageRadius }}
          />
          <EditablePhoto
            src={getPhoto(state.photos, 7)}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(7, d)}
            style={{ paddingTop: '85%', borderRadius: template.imageRadius }}
          />
          <div style={{
            paddingTop: '85%',
            backgroundImage: 'url(' + media.city + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: template.imageRadius
          }} />
        </div>
        <EditableText
          editMode={editMode}
          value={content.scenicText}
          onChange={(v) => ctx.updateContent('scenicText', v)}
          style={{
            fontSize: 'clamp(11px, 3vw, 12.5px)',
            lineHeight: 1.45,
            color: c.text,
            fontStyle: 'italic'
          }}
        />
      </div>
    </PageWrapper>
  );
}

function FoodPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  const dest = state.destination;
  const media = DESTINATION_MEDIA[dest.id];
  return (
    <PageWrapper template={template} bg={c.page === '#FFFFFF' ? '#FDF6E9' : c.page}>
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel template={template}>CULINARY DELIGHTS</SectionLabel>
        <EditableText
          as="h2"
          editMode={editMode}
          value={content.foodTitle}
          onChange={(v) => ctx.updateContent('foodTitle', v)}
          style={{
            margin: 0,
            fontFamily: template.fonts.display,
            fontSize: 'clamp(19px, 5.2vw, 24px)',
            lineHeight: 1.15,
            color: c.primary,
            fontWeight: 700
          }}
        />
        <div style={{
          height: 150,
          backgroundImage: 'url(' + media.food + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: template.imageRadius
        }} />
        <EditableText
          editMode={editMode}
          multiline
          value={content.foodText}
          onChange={(v) => ctx.updateContent('foodText', v)}
          style={{
            fontSize: 'clamp(11px, 3.1vw, 13px)',
            lineHeight: 1.5,
            color: c.text,
            margin: 0
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <EditablePhoto
            src={getPhoto(state.photos, 8)}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(8, d)}
            style={{ paddingTop: '70%', borderRadius: template.imageRadius }}
          />
          <EditablePhoto
            src={getPhoto(state.photos, 9)}
            editMode={editMode}
            onReplace={(d) => ctx.replacePhoto(9, d)}
            style={{ paddingTop: '70%', borderRadius: template.imageRadius }}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

function FamilyNotesPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  function updateTip(i, key, v) {
    const next = (content.tips || []).slice();
    next[i] = Object.assign({}, next[i] || { title: '', text: '' }, { [key]: v });
    ctx.updateContent('tips', next);
  }
  return (
    <PageWrapper template={template} bg={c.page}>
      <div style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SectionLabel template={template}>FAMILY NOTES</SectionLabel>
        <h2 style={{
          margin: 0,
          fontFamily: template.fonts.display,
          fontSize: 'clamp(19px, 5.2vw, 24px)',
          lineHeight: 1.15,
          color: c.primary,
          fontWeight: 700
        }}>Tips From Our Trip</h2>

        <div style={{ display: 'grid', gap: 8 }}>
          {[0, 1, 2].map((idx) => {
            const t = (content.tips && content.tips[idx]) || { title: '', text: '' };
            return (
              <div key={idx} style={{
                background: c.page === '#FFFFFF' ? '#FDF6E9' : 'rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: '10px 12px',
                border: '1px solid ' + (c.accentLight + '55'),
                display: 'flex',
                gap: 10
              }}>
                <div style={{
                  flex: '0 0 28px',
                  height: 28,
                  borderRadius: 8,
                  background: c.accent,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13
                }}>{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <EditableText
                    editMode={editMode}
                    value={t.title}
                    onChange={(v) => updateTip(idx, 'title', v)}
                    style={{
                      fontFamily: template.fonts.display,
                      fontWeight: 700,
                      fontSize: 13,
                      color: c.primary,
                      lineHeight: 1.2
                    }}
                  />
                  <EditableText
                    editMode={editMode}
                    value={t.text}
                    onChange={(v) => updateTip(idx, 'text', v)}
                    style={{ fontSize: 11, color: c.muted, marginTop: 3, lineHeight: 1.4 }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <EditableText
          editMode={editMode}
          value={content.backCoverQuote}
          onChange={(v) => ctx.updateContent('backCoverQuote', v)}
          style={{
            background: c.primary,
            color: '#fff',
            padding: '12px 14px',
            borderRadius: 12,
            fontStyle: 'italic',
            fontFamily: template.fonts.display,
            fontSize: 'clamp(11.5px, 3.1vw, 13px)',
            lineHeight: 1.35
          }}
        />
      </div>
    </PageWrapper>
  );
}

function AIMagicPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  const dest = state.destination;
  const media = DESTINATION_MEDIA[dest.id];
  return (
    <PageWrapper template={template} bg="#000">
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(' + media.landmark + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(11,37,69,0.4) 0%, rgba(11,37,69,0.85) 100%)'
      }} />
      <div style={{ position: 'absolute', top: 18, left: 18, color: c.accentLight, fontSize: 10, letterSpacing: 3, fontWeight: 700 }}>
        ✨ AI MAGIC
      </div>
      <EditablePhoto
        src={getPhoto(state.photos, 10)}
        editMode={editMode}
        onReplace={(d) => ctx.replacePhoto(10, d)}
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '72%',
          maxWidth: 220,
          aspectRatio: '1 / 1',
          borderRadius: 20,
          border: '4px solid rgba(255,255,255,0.85)',
          boxShadow: '0 18px 40px rgba(0,0,0,0.4)'
        }}
      />
      <div style={{
        position: 'absolute', bottom: 20, left: 20, right: 20,
        color: '#fff', textAlign: 'center'
      }}>
        <EditableText
          editMode={editMode}
          value={content.aiMagicBefore}
          onChange={(v) => ctx.updateContent('aiMagicBefore', v)}
          style={{ fontSize: 11, letterSpacing: 2, color: c.accentLight, fontWeight: 600 }}
        />
        <EditableText
          editMode={editMode}
          value={content.aiMagicAfter}
          onChange={(v) => ctx.updateContent('aiMagicAfter', v)}
          style={{
            marginTop: 8,
            fontFamily: template.fonts.display,
            fontStyle: 'italic',
            fontSize: 'clamp(14px, 4vw, 18px)',
            lineHeight: 1.3,
            color: '#fff'
          }}
        />
      </div>
    </PageWrapper>
  );
}

function BackCoverPage({ state, template, content, editMode, ctx }) {
  const c = template.colors;
  return (
    <PageWrapper template={template} bg={c.primary}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, ' + c.primary + ' 0%, ' + c.accent + ' 100%)'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 20% 80%, ' + c.accent + '44, transparent 60%)'
      }} />
      <div style={{ position: 'absolute', top: 22, left: 20, right: 20, color: '#fff', textAlign: 'center' }}>
        <div style={{ fontFamily: template.fonts.display, fontWeight: 800, fontSize: 'clamp(28px, 7vw, 36px)', letterSpacing: 1 }}>
          Wanderbook
        </div>
        <div style={{ width: 60, height: 3, background: c.accentLight, margin: '10px auto 0' }} />
      </div>
      <div style={{
        position: 'absolute', top: '40%', left: 20, right: 20,
        transform: 'translateY(-50%)', color: '#fff', textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: c.accentLight, fontWeight: 700 }}>DESTINATION</div>
        <div style={{ fontFamily: template.fonts.display, fontWeight: 700, fontSize: 'clamp(22px, 5.5vw, 26px)', marginTop: 4 }}>
          {state.destination.name}
        </div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: c.accentLight, fontWeight: 700, marginTop: 16 }}>FAMILY</div>
        <div style={{ fontFamily: template.fonts.display, fontWeight: 600, fontSize: 'clamp(16px, 4.5vw, 20px)', marginTop: 4 }}>
          {state.familyName}
        </div>
        <div style={{ fontSize: 11, letterSpacing: 3, color: c.accentLight, fontWeight: 700, marginTop: 16 }}>TRAVEL DATES</div>
        <div style={{ fontFamily: template.fonts.display, fontSize: 'clamp(13px, 3.6vw, 15px)', marginTop: 4 }}>
          {state.travelDates}
        </div>
        <EditableText
          editMode={editMode}
          value={content.backCoverQuote}
          onChange={(v) => ctx.updateContent('backCoverQuote', v)}
          style={{
            marginTop: 16,
            fontStyle: 'italic',
            fontSize: 'clamp(11px, 3vw, 13px)',
            color: c.accentLight,
            lineHeight: 1.4,
            fontFamily: template.fonts.display
          }}
        />
      </div>
      <div style={{ position: 'absolute', bottom: 22, left: 20, right: 20, color: '#fff', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 10 }}>
          {[3,1,2,1,3,1,1,2,3,1,2,1,3,2,1,2,1,3,1,2].map((w, i) => (
            <div key={i} style={{ width: w, height: 28, background: '#fff', opacity: 0.9 }} />
          ))}
        </div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: c.accentLight, fontWeight: 700 }}>
          PERSONAL FAMILY EDITION · ONE OF ONE
        </div>
      </div>
    </PageWrapper>
  );
}

function ScreenMagazine({ state, setState, onReset, editMode }) {
  const [page, setPage] = useState(0);
  const isMobile = useIsMobile();
  const template = TEMPLATES.find((t) => t.id === state.templateId) || TEMPLATES[0];
  const content = state.content;

  const ctx = {
    updateContent: (key, value) => {
      setState((prev) => ({ ...prev, content: Object.assign({}, prev.content, { [key]: value }) }));
    },
    replacePhoto: (i, data) => {
      setState((prev) => {
        const next = prev.photos.slice();
        while (next.length <= i) next.push(data);
        next[i] = data;
        return Object.assign({}, prev, { photos: next });
      });
    }
  };

  const pages = [
    <CoverPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <WelcomePage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <StoryPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <QuotePage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <HighlightsPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <ScenicPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <FoodPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <FamilyNotesPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <AIMagicPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />,
    <BackCoverPage state={state} template={template} content={content} editMode={editMode} ctx={ctx} />
  ];

  function go(d) { setPage((p) => Math.max(0, Math.min(pages.length - 1, p + d))); }
  function handlePrint() { window.print(); }

  const pageWidth = isMobile ? 'calc(100vw - 32px)' : '520px';
  const pageMaxWidth = isMobile ? 430 : 520;
  const arrowSize = isMobile ? 38 : 42;

  return (
    <div className="wb-fade" style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(180deg, ' + template.colors.bg + ' 0%, ' + template.colors.bg + ' 100%)',
      paddingBottom: 30
    }}>
      <div className="wb-no-print" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        padding: isMobile ? '10px 10px 6px' : '14px 14px 10px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrint}
          style={{
            background: '#0B2545',
            color: '#fff',
            border: 'none',
            padding: isMobile ? '8px 12px' : '10px 16px',
            borderRadius: 999,
            fontSize: isMobile ? 11 : 12,
            fontWeight: 700,
            letterSpacing: 0.5
          }}
        >
          ⬇ {isMobile ? 'Print PDF' : 'Download / Print PDF'}
        </button>
        <button
          onClick={onReset}
          style={{
            background: '#fff',
            color: '#0B2545',
            border: '1.5px solid #C9913A',
            padding: isMobile ? '8px 12px' : '10px 16px',
            borderRadius: 999,
            fontSize: isMobile ? 11 : 12,
            fontWeight: 700,
            letterSpacing: 0.5
          }}
        >
          New Magazine
        </button>
      </div>

      {editMode && (
        <div className="wb-no-print" style={{
          maxWidth: 460,
          margin: '0 auto 6px',
          padding: '6px 12px',
          background: 'rgba(201,145,58,0.15)',
          border: '1px solid rgba(201,145,58,0.4)',
          borderRadius: 10,
          fontSize: 11,
          color: '#0B2545',
          textAlign: 'center'
        }}>
          ✏️ Edit mode — tap any text to edit, tap any photo to replace.
        </div>
      )}

      <div className="wb-page-stage wb-no-print-extras" style={{
        position: 'relative',
        margin: '6px auto 0',
        width: pageWidth,
        maxWidth: pageMaxWidth
      }}>
        {pages[page]}

        <button
          aria-label="Previous page"
          className="wb-arrow wb-no-print"
          onClick={() => go(-1)}
          disabled={page === 0}
          style={{
            position: 'absolute',
            left: -14,
            top: '50%',
            transform: 'translateY(-50%)',
            width: arrowSize,
            height: arrowSize,
            borderRadius: '50%',
            background: page === 0 ? 'rgba(11,37,69,0.25)' : '#0B2545',
            color: '#fff',
            border: '2px solid #fff',
            fontSize: 18,
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 10,
            cursor: page === 0 ? 'default' : 'pointer'
          }}
        >‹</button>
        <button
          aria-label="Next page"
          className="wb-arrow wb-no-print"
          onClick={() => go(1)}
          disabled={page === pages.length - 1}
          style={{
            position: 'absolute',
            right: -14,
            top: '50%',
            transform: 'translateY(-50%)',
            width: arrowSize,
            height: arrowSize,
            borderRadius: '50%',
            background: page === pages.length - 1 ? 'rgba(11,37,69,0.25)' : '#0B2545',
            color: '#fff',
            border: '2px solid #fff',
            fontSize: 18,
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 10,
            cursor: page === pages.length - 1 ? 'default' : 'pointer'
          }}
        >›</button>
      </div>

      <div className="wb-no-print" style={{
        textAlign: 'center',
        marginTop: 14,
        fontSize: 11,
        color: template.colors.muted,
        letterSpacing: 1.5
      }}>
        TEMPLATE · {template.name.toUpperCase()}
      </div>

      <div className="wb-print-only" style={{ display: 'none' }}>
        {pages.map((p, i) => (
          <div key={i} style={{ pageBreakAfter: 'always' }}>{p}</div>
        ))}
      </div>
    </div>
  );
}

const EMPTY_STATE = {
  destination: null,
  templateId: null,
  familyName: '',
  travelDates: '',
  photos: [],
  content: null
};

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState('destination');
  const [state, setState] = useState(EMPTY_STATE);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.state) {
      setState(saved.state);
      if (saved.screen) setScreen(saved.screen);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({ screen, state });
  }, [state, screen, hydrated]);

  function reset() {
    if (!window.confirm('Start a brand new magazine? Current edits will be lost.')) return;
    clearStorage();
    setState(EMPTY_STATE);
    setEditMode(false);
    setScreen('destination');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDF6E9' }}>
      <Header onReset={reset} screen={screen} editMode={editMode} setEditMode={setEditMode} />

      {screen === 'destination' && (
        <ScreenDestination
          state={state}
          setState={setState}
          onNext={() => setScreen('template')}
        />
      )}
      {screen === 'template' && (
        <ScreenTemplate
          state={state}
          setState={setState}
          onNext={() => setScreen('upload')}
          onBack={() => setScreen('destination')}
        />
      )}
      {screen === 'upload' && (
        <ScreenUpload
          state={state}
          setState={setState}
          onNext={() => setScreen('generating')}
          onBack={() => setScreen('template')}
        />
      )}
      {screen === 'generating' && state.destination && state.templateId && (
        <ScreenGenerating
          state={state}
          onDone={(c) => {
            setState((prev) => Object.assign({}, prev, { content: c }));
            setScreen('magazine');
          }}
        />
      )}
      {screen === 'magazine' && state.content && (
        <ScreenMagazine
          state={state}
          setState={setState}
          onReset={reset}
          editMode={editMode}
        />
      )}
    </div>
  );
}
