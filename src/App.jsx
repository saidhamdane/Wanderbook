import React, { useState, useEffect } from 'react';

const COLORS = {
  navy: '#0B2545',
  blue: '#1E6BA8',
  gold: '#C9913A',
  goldLight: '#E8B86D',
  cream: '#FDF6E9',
  white: '#FFFFFF',
  green: '#27AE60'
};

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
  },
  'canary-islands': {
    city: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
    landmark: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&q=80',
    food: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=80'
  }
};

const GENERATION_STEPS = [
  'Analysing destination',
  'Writing welcome letter',
  'Crafting story',
  'Placing photos',
  'Writing food & culture',
  'Adding highlights',
  'Composing magazine'
];

function buildFallback(destinationName, familyName) {
  const family = familyName && familyName.trim().length > 0 ? familyName : 'The Family';
  return {
    welcomeTitle: 'Welcome to ' + destinationName,
    welcomeParagraph1: 'The ' + family + ' set foot on ' + destinationName + ' and were greeted by a soft Atlantic breeze, the scent of salt and sun-warmed lava stone. Eternal spring wrapped around us as our holiday began.',
    welcomeParagraph2: 'From volcanic peaks to endless golden beaches, the Canary Islands offered the perfect playground for our family. Every road bend revealed a new postcard — a hidden cove, a colourful village, a sky on fire at sunset.',
    storyTitle: 'Our ' + destinationName + ' Story',
    storyText: 'Our days in ' + destinationName + ' were stitched together by laughter, salty hair and the sound of waves. The children chased rainbows of fish in shallow lagoons while we sipped barraquito coffee in tiny plazas. Each evening the sky over the Atlantic burned orange, and the ' + family + ' grew a little closer.',
    storyQuote: '“The best souvenirs are not things — they are the moments we lived together on these islands.”',
    quoteText: 'Where the ocean meets the volcano, our family found its own little corner of paradise.',
    quoteAttribution: '— ' + family + ', ' + destinationName,
    highlightsTitle: 'Best Moments of the Journey',
    highlightMain: { title: 'Sunset over the Atlantic', text: 'A golden hour from our terrace that made everyone stop talking and just watch.' },
    highlightMini: [
      { title: 'Volcano Hike', text: 'A breath-taking walk on warm lava trails.' },
      { title: 'Beach Picnic', text: 'Sandy toes, fresh papas arrugadas and shared smiles.' },
      { title: 'Old Town Walk', text: 'Cobbled streets, balconies and the chime of church bells.' }
    ],
    scenicCaption: 'The wild beauty of ' + destinationName + ' — volcanic cliffs, hidden coves and skies that change colour every minute.',
    foodTitle: 'Canarian Flavours',
    foodText: 'We fell in love with papas arrugadas con mojo, fresh grilled vieja, almogrote and bienmesabe. Simple, generous food made with island sunshine and shared at long tables.',
    familyTips: [
      { title: 'Pack Light Layers', text: 'Sea breezes can be cool even in summer — keep a light cardigan handy.' },
      { title: 'Slow Mornings', text: 'Let the kids set the pace. The islands reward slow travellers.' },
      { title: 'Try Local Markets', text: 'Saturday markets are the heart of Canarian village life.' }
    ],
    familyClosing: 'And just like that, the Canary Islands wrote a new chapter in our family book.',
    aiBeforeText: 'Before — a quiet family ready for adventure.',
    aiAfterText: 'After — hearts full of ocean, volcano and Canarian sunshine.'
  };
}

async function callClaude(destinationName, familyName, travelDates) {
  const prompt = 'Write a short magazine article for a family travel magazine. Destination: ' + destinationName + '. Family: ' + familyName + '. Dates: ' + travelDates + '. Keep paragraphs short and warm.';
  try {
    const res = await fetch('http://localhost:8787/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt, destination: destinationName, family: familyName, dates: travelDates })
    });
    if (!res.ok) throw new Error('bad response');
    const data = await res.json();
    if (data && data.content) {
      return Object.assign({}, buildFallback(destinationName, familyName), data.content);
    }
    return buildFallback(destinationName, familyName);
  } catch (e) {
    return buildFallback(destinationName, familyName);
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 760 : true);
  useEffect(() => {
    function handle() {
      setIsMobile(window.innerWidth < 760);
    }
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return isMobile;
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600&display=swap');
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; padding: 0; background: ${COLORS.cream}; font-family: 'Montserrat', system-ui, sans-serif; color: ${COLORS.navy}; }
      body { overflow-x: hidden; }
      button { font-family: inherit; cursor: pointer; }
      input { font-family: inherit; }
      .wb-fade { animation: wbFade 0.5s ease both; }
      @keyframes wbFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes wbBookBounce { 0%, 100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-12px) rotate(6deg); } }
      .wb-book { animation: wbBookBounce 1.4s ease-in-out infinite; display: inline-block; }
      @keyframes wbSpin { to { transform: rotate(360deg); } }
      .wb-arrow:hover { background: ${COLORS.gold} !important; color: #fff !important; }
      @media print {
        .wb-no-print { display: none !important; }
        .wb-page { box-shadow: none !important; page-break-after: always; }
      }
      @media (max-width: 760px) {
        .wb-desktop-only { display: none !important; }
      }
      @media (min-width: 761px) {
        .wb-mobile-only { display: none !important; }
      }
    `}</style>
  );
}

function Header({ onReset, screen }) {
  return (
    <div className="wb-no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: COLORS.navy,
      color: COLORS.white,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '3px solid ' + COLORS.gold,
      boxShadow: '0 2px 10px rgba(0,0,0,0.18)'
    }}>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(16px, 4.4vw, 22px)', lineHeight: 1.1 }}>
          Wanderbook Family
        </div>
        <div style={{ fontSize: 'clamp(8px, 2.4vw, 10px)', letterSpacing: 2, color: COLORS.goldLight, marginTop: 2 }}>
          PERSONAL AI TRAVEL MAGAZINE
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          background: 'transparent',
          color: COLORS.white,
          border: '1.5px solid ' + COLORS.goldLight,
          padding: '8px 14px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1
        }}
      >
        Reset
      </button>
    </div>
  );
}

function DestinationCard({ dest, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(dest)}
      style={{
        border: selected ? '3px solid ' + COLORS.gold : '3px solid transparent',
        borderRadius: 18,
        overflow: 'hidden',
        padding: 0,
        background: COLORS.white,
        textAlign: 'left',
        boxShadow: selected ? '0 10px 28px rgba(201,145,58,0.35)' : '0 4px 14px rgba(11,37,69,0.08)',
        transition: 'all 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <div style={{
        height: 130,
        backgroundImage: 'url(' + dest.image + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: COLORS.navy }}>
          {dest.name}
        </div>
        <div style={{ fontSize: 12, color: '#5a6678', marginTop: 4, lineHeight: 1.4 }}>
          {dest.description}
        </div>
      </div>
    </button>
  );
}

function ScreenDestination({ state, setState, onNext }) {
  return (
    <div className="wb-fade" style={{ padding: '20px 16px 40px', maxWidth: 880, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>STEP 1 OF 3</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", margin: '6px 0 6px', fontSize: 'clamp(24px, 6vw, 34px)' }}>
          Choose your Canary Island
        </h1>
        <p style={{ margin: 0, color: '#54607a', fontSize: 14 }}>
          Five island stories, one unforgettable family magazine.
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14
      }}>
        {DESTINATIONS.map((d) => (
          <DestinationCard
            key={d.id}
            dest={d}
            selected={state.destination && state.destination.id === d.id}
            onSelect={(dest) => setState({ ...state, destination: dest })}
          />
        ))}
      </div>

      <div style={{
        marginTop: 22,
        background: COLORS.white,
        borderRadius: 18,
        padding: 18,
        boxShadow: '0 6px 18px rgba(11,37,69,0.08)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: COLORS.navy, marginBottom: 6, letterSpacing: 1 }}>
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
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: COLORS.navy, marginBottom: 6, letterSpacing: 1 }}>
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
            marginTop: 18,
            width: '100%',
            background: (!state.destination || !state.familyName.trim() || !state.travelDates.trim()) ? '#c8cfdb' : 'linear-gradient(135deg, ' + COLORS.gold + ', ' + COLORS.goldLight + ')',
            color: COLORS.white,
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
  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    const remaining = 20 - state.photos.length;
    const limited = files.slice(0, remaining);
    limited.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setState((prev) => ({ ...prev, photos: [...prev.photos, ev.target.result] }));
      };
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  }

  function removePhoto(i) {
    setState((prev) => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }));
  }

  const enough = state.photos.length >= 5;

  return (
    <div className="wb-fade" style={{ padding: '20px 16px 40px', maxWidth: 880, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>STEP 2 OF 3</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", margin: '6px 0 6px', fontSize: 'clamp(24px, 6vw, 34px)' }}>
          Upload your family photos
        </h1>
        <p style={{ margin: 0, color: '#54607a', fontSize: 14 }}>
          Add 5–20 photos. Your magazine will feature them.
        </p>
      </div>

      <label style={{
        display: 'block',
        background: COLORS.white,
        border: '2px dashed ' + COLORS.goldLight,
        borderRadius: 18,
        padding: 24,
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(11,37,69,0.06)'
      }}>
        <div style={{ fontSize: 36 }}>📸</div>
        <div style={{ fontWeight: 700, marginTop: 6, color: COLORS.navy }}>Tap to upload photos</div>
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
          marginTop: 16,
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
                  fontSize: 14,
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <button
          onClick={onBack}
          style={{
            flex: '0 0 auto',
            background: COLORS.white,
            color: COLORS.navy,
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
            background: enough ? 'linear-gradient(135deg, ' + COLORS.gold + ', ' + COLORS.goldLight + ')' : '#c8cfdb',
            color: COLORS.white,
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
      if (stepIndex >= GENERATION_STEPS.length) {
        clearInterval(interval);
      } else {
        setStep(stepIndex);
      }
    }, 700);

    let pct = 0;
    const progInterval = setInterval(() => {
      pct += 2;
      if (cancelled) return;
      if (pct >= 100) {
        pct = 100;
        clearInterval(progInterval);
      }
      setProgress(pct);
    }, 100);

    callClaude(state.destination.name, state.familyName, state.travelDates).then((content) => {
      const wait = setInterval(() => {
        if (cancelled) { clearInterval(wait); return; }
        if (pct >= 100) {
          clearInterval(wait);
          onDone(content);
        }
      }, 120);
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
        Composing your magazine
      </h2>
      <p style={{ margin: 0, color: '#54607a', fontSize: 14 }}>
        {state.destination.name} · {state.familyName}
      </p>

      <div style={{ width: '100%', maxWidth: 360, marginTop: 24 }}>
        <div style={{
          height: 10,
          background: '#eadfca',
          borderRadius: 999,
          overflow: 'hidden'
        }}>
          <div style={{
            width: progress + '%',
            height: '100%',
            background: 'linear-gradient(90deg, ' + COLORS.gold + ', ' + COLORS.goldLight + ')',
            transition: 'width 0.2s ease'
          }} />
        </div>
        <div style={{ fontSize: 12, color: '#7a849a', marginTop: 8, letterSpacing: 1 }}>
          {progress}%
        </div>
      </div>

      <div style={{ marginTop: 22, width: '100%', maxWidth: 360, textAlign: 'left' }}>
        {GENERATION_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 0',
              opacity: done || active ? 1 : 0.45
            }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: done ? COLORS.green : (active ? COLORS.gold : '#d7dde6'),
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 14, color: COLORS.navy, fontWeight: active ? 600 : 400 }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getPhoto(photos, i) {
  if (!photos || photos.length === 0) return '';
  return photos[i % photos.length];
}

function PageWrapper({ children, bg }) {
  return (
    <div className="wb-page" style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: bg || COLORS.white,
      borderRadius: 26,
      overflow: 'hidden',
      boxShadow: '0 18px 50px rgba(11,37,69,0.25)'
    }}>
      {children}
    </div>
  );
}

function CoverPage({ state }) {
  const photo = getPhoto(state.photos, 0);
  return (
    <PageWrapper>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(' + photo + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(11,37,69,0.55) 0%, rgba(11,37,69,0.15) 35%, rgba(11,37,69,0.8) 100%)'
      }} />
      <div style={{
        position: 'absolute',
        top: 16,
        left: 18,
        right: 18,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#fff',
        fontSize: 11,
        letterSpacing: 2,
        fontWeight: 600
      }}>
        <div>{state.travelDates}</div>
        <div>VOL. 01</div>
      </div>

      <div style={{
        position: 'absolute',
        top: '20%',
        left: 18,
        right: 18,
        color: '#fff'
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(20px, 6.5vw, 34px)',
          lineHeight: 1.1,
          fontWeight: 400
        }}>My Trip</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800,
          fontSize: 'clamp(44px, 13vw, 78px)',
          lineHeight: 0.95,
          marginTop: 2
        }}>Travel</div>
        <div style={{
          display: 'inline-block',
          marginTop: 10,
          padding: '4px 10px',
          background: COLORS.gold,
          color: COLORS.navy,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 3,
          borderRadius: 4
        }}>MGZ</div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        color: '#fff'
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 'clamp(20px, 5.5vw, 28px)',
          lineHeight: 1.15
        }}>
          {state.destination.name}
        </div>
        <div style={{
          fontSize: 'clamp(11px, 3vw, 13px)',
          marginTop: 4,
          color: COLORS.goldLight,
          letterSpacing: 1
        }}>
          Prepare for a Memorable Holiday
        </div>
        <div style={{ fontSize: 11, marginTop: 8, opacity: 0.9 }}>
          By {state.familyName}
        </div>
        <div style={{
          display: 'inline-block',
          marginTop: 10,
          padding: '4px 10px',
          background: 'rgba(255,255,255,0.18)',
          border: '1px solid rgba(255,255,255,0.4)',
          color: '#fff',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 3,
          borderRadius: 4,
          backdropFilter: 'blur(4px)'
        }}>✨ AI ENHANCED</div>
      </div>
    </PageWrapper>
  );
}

function WelcomePage({ state, content }) {
  const dest = state.destination;
  return (
    <PageWrapper bg={COLORS.cream}>
      <div style={{ padding: '20px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>CHAPTER ONE</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(22px, 6vw, 30px)',
          margin: '4px 0 10px',
          lineHeight: 1.15,
          color: COLORS.navy
        }}>
          {content.welcomeTitle}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div style={{
            paddingTop: '70%',
            backgroundImage: 'url(' + getPhoto(state.photos, 1) + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 10
          }} />
          <div style={{
            paddingTop: '70%',
            backgroundImage: 'url(' + getPhoto(state.photos, 2) + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 10
          }} />
        </div>

        <p style={{ fontSize: 'clamp(11px, 3.1vw, 13px)', lineHeight: 1.45, margin: '4px 0', color: '#2c3a52' }}>
          {content.welcomeParagraph1}
        </p>
        <p style={{ fontSize: 'clamp(11px, 3.1vw, 13px)', lineHeight: 1.45, margin: '4px 0 8px', color: '#2c3a52' }}>
          {content.welcomeParagraph2}
        </p>

        <div style={{
          marginTop: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          background: COLORS.white,
          padding: 10,
          borderRadius: 12,
          border: '1px solid #ecdfc4'
        }}>
          <InfoCell label="POPULATION" value={dest.population} />
          <InfoCell label="LANGUAGE" value={dest.language} />
          <InfoCell label="CURRENCY" value={dest.currency} />
          <InfoCell label="BEST TIME" value={dest.bestTime} />
        </div>
      </div>
    </PageWrapper>
  );
}

function InfoCell({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: 2, color: COLORS.gold, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.navy, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function StoryPage({ state, content }) {
  return (
    <PageWrapper bg={COLORS.white}>
      <div style={{ padding: '20px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>OUR STORY</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(20px, 5.5vw, 26px)',
          margin: '4px 0 10px',
          lineHeight: 1.2,
          color: COLORS.navy
        }}>{content.storyTitle}</h2>

        <div style={{
          height: 150,
          backgroundImage: 'url(' + getPhoto(state.photos, 3) + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
          marginBottom: 10
        }} />

        <div style={{ position: 'relative', fontSize: 'clamp(11px, 3.1vw, 13px)', lineHeight: 1.45, color: '#2c3a52' }}>
          <span style={{
            float: 'left',
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(46px, 12vw, 58px)',
            lineHeight: 0.85,
            color: COLORS.gold,
            fontWeight: 800,
            marginRight: 8,
            marginTop: 2
          }}>G</span>
          {content.storyText}
        </div>

        <div style={{
          marginTop: 'auto',
          background: COLORS.cream,
          borderLeft: '4px solid ' + COLORS.gold,
          padding: '8px 12px',
          borderRadius: 6,
          fontStyle: 'italic',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(11px, 3vw, 13px)',
          color: COLORS.navy,
          lineHeight: 1.35
        }}>
          {content.storyQuote}
        </div>
      </div>
    </PageWrapper>
  );
}

function QuotePage({ state, content }) {
  return (
    <PageWrapper bg={COLORS.blue}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 20%, rgba(232,184,109,0.2), transparent 60%)'
      }} />
      <div style={{
        position: 'absolute',
        top: 18,
        right: 18,
        width: 110,
        height: 110,
        borderRadius: 14,
        backgroundImage: 'url(' + getPhoto(state.photos, 4) + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '3px solid rgba(255,255,255,0.9)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.25)'
      }} />
      <div style={{
        position: 'absolute',
        top: 18,
        left: 18,
        color: COLORS.goldLight,
        fontSize: 10,
        letterSpacing: 3,
        fontWeight: 700
      }}>WORDS TO REMEMBER</div>

      <div style={{
        position: 'absolute',
        left: 22,
        right: 22,
        top: '42%',
        transform: 'translateY(-50%)',
        color: '#fff'
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 'clamp(20px, 6.2vw, 30px)',
          lineHeight: 1.2
        }}>
          “{content.quoteText}”
        </div>
        <div style={{
          marginTop: 14,
          fontSize: 11,
          letterSpacing: 2,
          color: COLORS.goldLight,
          fontWeight: 600
        }}>
          {content.quoteAttribution}
        </div>
      </div>
    </PageWrapper>
  );
}

function HighlightsPage({ state, content }) {
  return (
    <PageWrapper bg={COLORS.white}>
      <div style={{ padding: '20px 16px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>HIGHLIGHTS</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(19px, 5.2vw, 24px)',
          margin: '4px 0 10px',
          lineHeight: 1.15,
          color: COLORS.navy
        }}>{content.highlightsTitle}</h2>

        <div style={{
          height: 150,
          backgroundImage: 'url(' + getPhoto(state.photos, 5) + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
          position: 'relative',
          marginBottom: 10
        }}>
          <div style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            background: 'rgba(11,37,69,0.85)',
            color: '#fff',
            padding: '8px 10px',
            borderRadius: 8
          }}>
            <div style={{ fontWeight: 700, fontSize: 12, fontFamily: "'Playfair Display', serif" }}>
              {content.highlightMain.title}
            </div>
            <div style={{ fontSize: 10.5, marginTop: 2, lineHeight: 1.35, opacity: 0.92 }}>
              {content.highlightMain.text}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {content.highlightMini.map((h, i) => (
            <div key={i} style={{
              background: COLORS.cream,
              borderRadius: 10,
              padding: 8,
              border: '1px solid #ecdfc4'
            }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.navy, fontFamily: "'Playfair Display', serif", lineHeight: 1.2 }}>
                {h.title}
              </div>
              <div style={{ fontSize: 9.5, color: '#54607a', marginTop: 3, lineHeight: 1.35 }}>
                {h.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

function ScenicPage({ state, content }) {
  const dest = state.destination;
  const media = DESTINATION_MEDIA[dest.id] || DESTINATION_MEDIA['canary-islands'];
  return (
    <PageWrapper bg={COLORS.white}>
      <div style={{ padding: '20px 16px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>SCENIC</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(19px, 5.2vw, 24px)',
          margin: '4px 0 10px',
          lineHeight: 1.15,
          color: COLORS.navy
        }}>Landscapes of {dest.name}</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 6,
          flex: 1
        }}>
          <div style={{ backgroundImage: 'url(' + media.landmark + ')', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 10 }} />
          <div style={{ backgroundImage: 'url(' + getPhoto(state.photos, 6) + ')', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 10 }} />
          <div style={{ backgroundImage: 'url(' + getPhoto(state.photos, 7) + ')', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 10 }} />
          <div style={{ backgroundImage: 'url(' + media.city + ')', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 10 }} />
        </div>

        <div style={{
          marginTop: 10,
          fontSize: 'clamp(11px, 3vw, 12.5px)',
          lineHeight: 1.45,
          color: '#2c3a52',
          fontStyle: 'italic'
        }}>
          {content.scenicCaption}
        </div>
      </div>
    </PageWrapper>
  );
}

function FoodPage({ state, content }) {
  const dest = state.destination;
  const media = DESTINATION_MEDIA[dest.id] || DESTINATION_MEDIA['canary-islands'];
  return (
    <PageWrapper bg={COLORS.cream}>
      <div style={{ padding: '20px 16px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>CULINARY DELIGHTS</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(19px, 5.2vw, 24px)',
          margin: '4px 0 10px',
          lineHeight: 1.15,
          color: COLORS.navy
        }}>{content.foodTitle}</h2>

        <div style={{
          height: 150,
          backgroundImage: 'url(' + media.food + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 12,
          marginBottom: 10
        }} />

        <p style={{ fontSize: 'clamp(11px, 3.1vw, 13px)', lineHeight: 1.45, margin: '4px 0 10px', color: '#2c3a52' }}>
          {content.foodText}
        </p>

        <div style={{
          marginTop: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8
        }}>
          <div style={{
            paddingTop: '70%',
            backgroundImage: 'url(' + getPhoto(state.photos, 8) + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 10
          }} />
          <div style={{
            paddingTop: '70%',
            backgroundImage: 'url(' + getPhoto(state.photos, 9) + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 10
          }} />
        </div>
      </div>
    </PageWrapper>
  );
}

function FamilyNotesPage({ content }) {
  return (
    <PageWrapper bg={COLORS.white}>
      <div style={{ padding: '20px 16px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: COLORS.gold, fontWeight: 700 }}>FAMILY NOTES</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(19px, 5.2vw, 24px)',
          margin: '4px 0 12px',
          lineHeight: 1.15,
          color: COLORS.navy
        }}>Tips From Our Trip</h2>

        <div style={{ display: 'grid', gap: 8 }}>
          {content.familyTips.map((t, i) => (
            <div key={i} style={{
              background: COLORS.cream,
              borderRadius: 12,
              padding: '10px 12px',
              border: '1px solid #ecdfc4',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start'
            }}>
              <div style={{
                flex: '0 0 28px',
                height: 28,
                borderRadius: 8,
                background: COLORS.gold,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 13
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: COLORS.navy, lineHeight: 1.2 }}>
                  {t.title}
                </div>
                <div style={{ fontSize: 11, color: '#54607a', marginTop: 3, lineHeight: 1.4 }}>
                  {t.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 'auto',
          background: COLORS.navy,
          color: '#fff',
          padding: '12px 14px',
          borderRadius: 12,
          fontStyle: 'italic',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(11.5px, 3.1vw, 13px)',
          lineHeight: 1.35
        }}>
          “{content.familyClosing}”
        </div>
      </div>
    </PageWrapper>
  );
}

function AIMagicPage({ state, content }) {
  const dest = state.destination;
  const media = DESTINATION_MEDIA[dest.id] || DESTINATION_MEDIA['canary-islands'];
  return (
    <PageWrapper>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(' + media.landmark + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(11,37,69,0.4) 0%, rgba(11,37,69,0.75) 100%)'
      }} />

      <div style={{ position: 'absolute', top: 18, left: 18, color: COLORS.goldLight, fontSize: 10, letterSpacing: 3, fontWeight: 700 }}>
        ✨ AI MAGIC
      </div>

      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        maxWidth: 220,
        aspectRatio: '1 / 1',
        borderRadius: 20,
        backgroundImage: 'url(' + getPhoto(state.photos, 10) + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '4px solid rgba(255,255,255,0.85)',
        boxShadow: '0 18px 40px rgba(0,0,0,0.4)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: 18,
        left: 18,
        right: 18,
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: COLORS.goldLight, fontWeight: 600 }}>
          {content.aiBeforeText}
        </div>
        <div style={{
          marginTop: 6,
          fontFamily: "'Playfair Display', serif",
          fontStyle: 'italic',
          fontSize: 'clamp(14px, 4vw, 18px)',
          lineHeight: 1.3
        }}>
          → {content.aiAfterText}
        </div>
      </div>
    </PageWrapper>
  );
}

function BackCoverPage({ state }) {
  return (
    <PageWrapper>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(160deg, ' + COLORS.navy + ' 0%, ' + COLORS.blue + ' 100%)'
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 20% 80%, rgba(201,145,58,0.25), transparent 60%)'
      }} />

      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800,
          fontSize: 'clamp(28px, 7vw, 36px)',
          letterSpacing: 1
        }}>Wanderbook</div>
        <div style={{
          width: 60,
          height: 3,
          background: COLORS.gold,
          margin: '10px auto 0'
        }} />
      </div>

      <div style={{
        position: 'absolute',
        top: '40%',
        left: 20,
        right: 20,
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.goldLight, fontWeight: 700 }}>DESTINATION</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 'clamp(22px, 5.5vw, 26px)',
          marginTop: 4
        }}>{state.destination.name}</div>

        <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.goldLight, fontWeight: 700, marginTop: 18 }}>FAMILY</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 600,
          fontSize: 'clamp(16px, 4.5vw, 20px)',
          marginTop: 4
        }}>{state.familyName}</div>

        <div style={{ fontSize: 11, letterSpacing: 3, color: COLORS.goldLight, fontWeight: 700, marginTop: 18 }}>TRAVEL DATES</div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(13px, 3.6vw, 15px)',
          marginTop: 4
        }}>{state.travelDates}</div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 22,
        left: 20,
        right: 20,
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          marginBottom: 10
        }}>
          {[3,1,2,1,3,1,1,2,3,1,2,1,3,2,1,2,1,3,1,2].map((w, i) => (
            <div key={i} style={{
              width: w,
              height: 28,
              background: '#fff',
              opacity: 0.9
            }} />
          ))}
        </div>
        <div style={{
          fontSize: 9,
          letterSpacing: 3,
          color: COLORS.goldLight,
          fontWeight: 700
        }}>
          PERSONAL FAMILY EDITION · ONE OF ONE
        </div>
      </div>
    </PageWrapper>
  );
}

function ScreenMagazine({ state, content, onReset }) {
  const [page, setPage] = useState(0);
  const isMobile = useIsMobile();

  const pages = [
    <CoverPage state={state} />,
    <WelcomePage state={state} content={content} />,
    <StoryPage state={state} content={content} />,
    <QuotePage state={state} content={content} />,
    <HighlightsPage state={state} content={content} />,
    <ScenicPage state={state} content={content} />,
    <FoodPage state={state} content={content} />,
    <FamilyNotesPage content={content} />,
    <AIMagicPage state={state} content={content} />,
    <BackCoverPage state={state} />
  ];

  const total = pages.length;

  function go(d) {
    setPage((p) => Math.max(0, Math.min(total - 1, p + d)));
  }

  function handlePrint() {
    window.print();
  }

  const pageWidth = isMobile ? 'calc(100vw - 34px)' : '520px';
  const pageHeight = isMobile ? 620 : 720;
  const pageMaxWidth = isMobile ? 430 : 520;

  return (
    <div className="wb-fade" style={{
      minHeight: 'calc(100vh - 70px)',
      background: 'linear-gradient(180deg, ' + COLORS.cream + ' 0%, #f4e7cd 100%)',
      paddingBottom: 30
    }}>
      <div className="wb-no-print" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        padding: '14px 14px 10px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrint}
          style={{
            background: COLORS.navy,
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          ⬇ Download / Print PDF
        </button>
        <button
          onClick={onReset}
          style={{
            background: COLORS.white,
            color: COLORS.navy,
            border: '1.5px solid ' + COLORS.gold,
            padding: '10px 16px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1
          }}
        >
          New Magazine
        </button>
      </div>

      <div style={{
        position: 'relative',
        margin: '8px auto 0',
        width: pageWidth,
        maxWidth: pageMaxWidth,
        height: pageHeight
      }}>
        {pages[page]}

        <button
          aria-label="Previous page"
          className="wb-arrow wb-no-print"
          onClick={() => go(-1)}
          disabled={page === 0}
          style={{
            position: 'absolute',
            left: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: page === 0 ? 'rgba(11,37,69,0.25)' : COLORS.navy,
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
          disabled={page === total - 1}
          style={{
            position: 'absolute',
            right: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: page === total - 1 ? 'rgba(11,37,69,0.25)' : COLORS.navy,
            color: '#fff',
            border: '2px solid #fff',
            fontSize: 18,
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 10,
            cursor: page === total - 1 ? 'default' : 'pointer'
          }}
        >›</button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('destination');
  const [state, setState] = useState({
    destination: null,
    familyName: '',
    travelDates: '',
    photos: []
  });
  const [content, setContent] = useState(null);

  function reset() {
    setState({ destination: null, familyName: '', travelDates: '', photos: [] });
    setContent(null);
    setScreen('destination');
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.cream }}>
      <GlobalStyles />
      <Header onReset={reset} screen={screen} />
      {screen === 'destination' && (
        <ScreenDestination
          state={state}
          setState={setState}
          onNext={() => setScreen('upload')}
        />
      )}
      {screen === 'upload' && (
        <ScreenUpload
          state={state}
          setState={setState}
          onNext={() => setScreen('generating')}
          onBack={() => setScreen('destination')}
        />
      )}
      {screen === 'generating' && (
        <ScreenGenerating
          state={state}
          onDone={(c) => { setContent(c); setScreen('magazine'); }}
        />
      )}
      {screen === 'magazine' && content && (
        <ScreenMagazine state={state} content={content} onReset={reset} />
      )}
    </div>
  );
}
