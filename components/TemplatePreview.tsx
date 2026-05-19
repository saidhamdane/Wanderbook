'use client';

import React from 'react';

type TemplateId = 'wander-together' | 'blue-bold' | 'explore-editorial' | 'travel-minimal';

type Props = {
  templateId: string;
  size?: 'sm' | 'md' | 'lg';
};

const SCALES: Record<NonNullable<Props['size']>, number> = {
  sm: 0.22,
  md: 0.28,
  lg: 0.38
};

const W = 643;
const H = 907;

export function TemplatePreview({ templateId, size = 'md' }: Props) {
  const scale = SCALES[size];
  const containerW = Math.round(W * scale);
  const containerH = Math.round(H * scale);

  return (
    <div
      style={{
        width: containerW + 'px',
        height: containerH + 'px',
        overflow: 'hidden',
        borderRadius: '3px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
        flexShrink: 0,
        backgroundColor: '#000'
      }}
    >
      <div
        style={{
          width: W + 'px',
          height: H + 'px',
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left'
        }}
      >
        {renderCover(templateId as TemplateId)}
      </div>
    </div>
  );
}

function renderCover(id: TemplateId) {
  switch (id) {
    case 'wander-together':
      return <WanderTogetherCover />;
    case 'blue-bold':
      return <BlueBoldCover />;
    case 'explore-editorial':
      return <ExploreEditorialCover />;
    case 'travel-minimal':
      return <TravelMinimalCover />;
    default:
      return <WanderTogetherCover />;
  }
}

function WanderTogetherCover() {
  return (
    <div
      style={{
        width: W + 'px',
        height: H + 'px',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(160deg, #1a3a5c 0%, #2d6a8f 25%, #1B2A4A 55%, #0d1f33 100%)',
        fontFamily: "'Playfair Display', serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background:
            'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(201,168,76,0.25) 0%, rgba(201,168,76,0.0) 70%)',
          filter: 'blur(20px)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 32,
          left: 28,
          color: 'white',
          fontFamily: "'Montserrat', sans-serif",
          lineHeight: 1.6
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>FAMILY ADVENTURES</div>
        <div style={{ opacity: 0.75, fontSize: 10 }}>Made for memories that last.</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 32,
          right: 28,
          color: 'white',
          fontFamily: "'Montserrat', sans-serif",
          lineHeight: 1.6,
          textAlign: 'right'
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>7 EPIC EXPERIENCES</div>
        <div style={{ opacity: 0.75, fontSize: 10 }}>You can&apos;t miss these.</div>
      </div>

      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            color: 'white',
            letterSpacing: 8,
            lineHeight: 1
          }}
        >
          WANDER
        </div>
        <div
          style={{
            fontSize: 58,
            fontStyle: 'italic',
            color: '#C9A84C',
            marginTop: -8,
            lineHeight: 1
          }}
        >
          Together
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'white',
            letterSpacing: 6,
            marginTop: 14,
            fontFamily: "'Montserrat', sans-serif",
            opacity: 0.9
          }}
        >
          TRAVEL MAGAZINE
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            letterSpacing: -1
          }}
        >
          TENERIFE
        </div>
        <div
          style={{
            fontSize: 38,
            fontStyle: 'italic',
            color: '#C9A84C',
            marginTop: 6,
            lineHeight: 1
          }}
        >
          Canary Islands
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: 4,
            marginTop: 12,
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          BEACHES · CULTURE · ADVENTURE
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#8B7355',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: "'Montserrat', sans-serif"
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>20</div>
        <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>25</div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 32,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-end'
        }}
      >
        {[3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 3].map((h, i) => (
          <div
            key={i}
            style={{
              width: 2,
              height: h * 7,
              backgroundColor: 'white',
              opacity: 0.85
            }}
          />
        ))}
      </div>
    </div>
  );
}

function BlueBoldCover() {
  return (
    <div
      style={{
        width: W + 'px',
        height: H + 'px',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(155deg, #1a6bb5 0%, #0047AB 35%, #003080 65%, #001650 100%)',
        fontFamily: "'Oswald', sans-serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          backgroundColor: '#FF3333'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 36,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px 0 24px',
          fontFamily: "'Oswald', sans-serif"
        }}
      >
        <span style={{ color: 'white', fontSize: 11, letterSpacing: 2 }}>ISSUE 01 · 2025</span>
        <span style={{ color: 'white', fontSize: 11, letterSpacing: 1 }}>WANDERBOOK.COM</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 60,
          fontSize: 200,
          fontWeight: 900,
          color: 'white',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          letterSpacing: -6,
          lineHeight: 0.85,
          textShadow: '4px 0 0 rgba(255,51,51,0.25)'
        }}
      >
        TRAVEL
      </div>

      <div style={{ position: 'absolute', right: 36, top: 110, textAlign: 'right' }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
            letterSpacing: -2
          }}
        >
          25+
        </div>
        <div
          style={{
            fontSize: 15,
            color: 'white',
            letterSpacing: 3,
            marginTop: 2,
            fontWeight: 600
          }}
        >
          HIDDEN PLACES
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 36,
          top: 230,
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end'
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#FF3333'
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 28,
          bottom: 200,
          color: '#aad4ff',
          fontSize: 14,
          letterSpacing: 3,
          fontWeight: 600
        }}
      >
        SUMMER 2025
      </div>

      <div style={{ position: 'absolute', left: 28, bottom: 70, right: 36 }}>
        <div
          style={{
            fontSize: 30,
            color: 'white',
            lineHeight: 1.15,
            fontWeight: 500
          }}
        >
          Explore Mountains,
          <br />
          Cities &amp; Beyond
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.65)',
            marginTop: 10,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: 2
          }}
        >
          BY JAMES SMITH
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 36,
          bottom: 32,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-end'
        }}
      >
        {[2, 4, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2, 3].map((h, i) => (
          <div key={i} style={{ width: 2, height: h * 6, backgroundColor: 'white', opacity: 0.8 }} />
        ))}
      </div>
    </div>
  );
}

function ExploreEditorialCover() {
  return (
    <div
      style={{
        width: W + 'px',
        height: H + 'px',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, #6BA3BE 0%, #D4A853 22%, #C4622D 44%, #8B3A1A 66%, #3D1A0A 86%, #1a0a05 100%)',
        fontFamily: "'Cormorant Garamond', Georgia, serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '32%',
          background:
            'linear-gradient(180deg, rgba(120,170,210,0.65) 0%, transparent 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 65%, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.55) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 280,
          height: 60,
          background:
            'radial-gradient(ellipse at center, rgba(60,30,15,0.85) 0%, transparent 70%)',
          filter: 'blur(8px)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 22,
          left: 24,
          color: 'rgba(255,255,255,0.75)',
          fontSize: 10,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: 2
        }}
      >
        VOLUME 05 NO.04 · DECEMBER 2025
      </div>

      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-end'
        }}
      >
        {[4, 2, 3, 1, 4, 2, 3, 1, 4, 2, 3, 4, 2, 1, 3].map((h, i) => (
          <div
            key={i}
            style={{ width: 1.5, height: h * 5, backgroundColor: 'rgba(255,255,255,0.7)' }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', top: 70, left: 28 }}>
        <div
          style={{
            fontSize: 110,
            fontWeight: 400,
            color: 'white',
            letterSpacing: -2,
            lineHeight: 0.9
          }}
        >
          explore
        </div>
        <div
          style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 5,
            marginTop: 6,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          MAGAZINE
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 240,
          left: 28,
          color: 'rgba(255,255,255,0.8)',
          fontSize: 11,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: 2,
          lineHeight: 2
        }}
      >
        <div>01 · OTASERAT</div>
        <div>02 · REPROUPTEUS</div>
        <div>03 · DENCILATIOUS</div>
      </div>

      <div style={{ position: 'absolute', bottom: 150, left: 28 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          5
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'white',
            letterSpacing: 3,
            fontFamily: "'Inter', sans-serif",
            marginTop: 4
          }}
        >
          BEST TRIPS FOR 2029
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 44, left: 28, right: 28 }}>
        <div
          style={{
            fontSize: 30,
            color: 'white',
            lineHeight: 1.25,
            fontStyle: 'italic',
            fontWeight: 500
          }}
        >
          Exploring the{' '}
          <span style={{ fontStyle: 'normal', fontWeight: 600 }}>Worlds</span> of Seven
          Continents
        </div>
      </div>
    </div>
  );
}

function TravelMinimalCover() {
  return (
    <div
      style={{
        width: W + 'px',
        height: H + 'px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        fontFamily: "'DM Sans', Inter, sans-serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '58%',
          background:
            'linear-gradient(180deg, #a8d8f0 0%, #5BA3D9 25%, #3a7ab5 50%, #1a4a7a 75%, #0a2040 100%)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90,
            height: 240,
            background: 'linear-gradient(to top, #050a18 0%, #1a3a5c 100%)',
            clipPath:
              'polygon(40% 100%, 35% 60%, 22% 40%, 28% 22%, 38% 10%, 50% 4%, 62% 10%, 72% 22%, 78% 40%, 65% 60%, 60% 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 220,
            height: 22,
            background:
              'radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, transparent 70%)'
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '44%',
          backgroundColor: 'white'
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: '#0A0A0A',
            lineHeight: 0.9,
            letterSpacing: -4,
            padding: '32px 28px 0'
          }}
        >
          TRAVEL
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 28px 0',
            color: '#0A0A0A'
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 300 }}>Magazine</span>
          <div style={{ flex: 1, height: 1.5, backgroundColor: '#0A0A0A' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            padding: '18px 28px 0',
            gap: 10
          }}
        >
          {[
            ['This Week', 'Top Place', 'Travel smart'],
            ['80+', 'Place', 'Discover more'],
            ['#7 Trending', 'Vacation', 'Best picks'],
            ['*12 Tips For', 'Traveling', 'Expert advice']
          ].map(([title, sub, body], i) => (
            <div key={i}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0A0A0A', lineHeight: 1.2 }}>
                {title}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A' }}>{sub}</div>
              <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 28, color: 'white' }}>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.9, letterSpacing: -2 }}>20</div>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.9, letterSpacing: -2 }}>25</div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 32,
          right: 28,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-end'
        }}
      >
        {[5, 2, 4, 1, 3, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3].map((h, i) => (
          <div
            key={i}
            style={{ width: 2, height: h * 5, backgroundColor: 'rgba(255,255,255,0.85)' }}
          />
        ))}
      </div>
    </div>
  );
}
