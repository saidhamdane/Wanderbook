'use client';

import React from 'react';
import { getTemplateById } from '@/lib/magazine/template-registry';

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

  let template;
  try {
    template = getTemplateById(templateId);
  } catch {
    template = undefined;
  }
  const isCanva = template?.source === 'canva';

  return (
    <div
      style={{
        width: containerW + 'px',
        height: containerH + 'px',
        overflow: 'hidden',
        borderRadius: '3px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
        flexShrink: 0,
        backgroundColor: template?.palette.primary ?? '#000',
        position: 'relative'
      }}
    >
      {isCanva && template?.previewImage ? (
        <CanvaCoverImage
          src={template.previewImage}
          fallback={template.palette.primary}
          label={template.name}
        />
      ) : (
        <div
          style={{
            width: W + 'px',
            height: H + 'px',
            transform: 'scale(' + scale + ')',
            transformOrigin: 'top left',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {renderCover(templateId as TemplateId)}
        </div>
      )}
    </div>
  );
}

function CanvaCoverImage({
  src,
  fallback,
  label
}: {
  src: string;
  fallback: string;
  label: string;
}) {
  const [missing, setMissing] = React.useState(false);
  if (missing) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: fallback,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          textAlign: 'center',
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '11px',
          letterSpacing: '2px',
          lineHeight: 1.4,
          textTransform: 'uppercase'
        }}
      >
        {label}
        <br />
        <span style={{ opacity: 0.7, fontSize: '9px', marginTop: '4px' }}>PNG pending</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label + ' cover'}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
      onError={() => setMissing(true)}
    />
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
        width: 643,
        height: 907,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1B2A4A',
        fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 30%, #2d6a8f 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, #1a4a6b 0%, transparent 50%), linear-gradient(160deg, #1e3a5f 0%, #0d2137 40%, #1B2A4A 70%, #0a1525 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: 0,
          right: 0,
          height: 320,
          background: 'linear-gradient(180deg, transparent 0%, #0d2137 100%)'
        }}
      />

      <svg
        style={{ position: 'absolute', bottom: 160, left: 0, right: 0, width: '100%', height: 260 }}
        viewBox="0 0 643 260"
        preserveAspectRatio="none"
      >
        <polygon
          points="0,260 0,180 80,80 160,140 240,40 320,100 400,20 480,90 560,50 643,110 643,260"
          fill="#0a1a2e"
          opacity="0.7"
        />
        <polygon
          points="0,260 0,220 60,160 120,200 200,120 280,170 360,90 440,150 520,100 600,140 643,120 643,260"
          fill="#071018"
          opacity="0.8"
        />
      </svg>

      <svg
        style={{
          position: 'absolute',
          bottom: 150,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 180,
          height: 160
        }}
        viewBox="0 0 180 160"
      >
        <ellipse cx="60" cy="30" rx="14" ry="14" fill="#0a1525" />
        <rect x="48" y="44" width="24" height="60" rx="4" fill="#0a1525" />
        <rect x="36" y="48" width="14" height="44" rx="4" fill="#0a1525" />
        <rect x="72" y="48" width="14" height="44" rx="4" fill="#0a1525" />
        <rect x="50" y="104" width="12" height="40" rx="3" fill="#0a1525" />
        <rect x="62" y="104" width="12" height="40" rx="3" fill="#0a1525" />
        <ellipse cx="120" cy="32" rx="13" ry="13" fill="#0d1f33" />
        <rect x="108" y="45" width="24" height="58" rx="4" fill="#0d1f33" />
        <rect x="96" y="49" width="13" height="42" rx="4" fill="#0d1f33" />
        <rect x="132" y="49" width="13" height="42" rx="4" fill="#0d1f33" />
        <rect x="110" y="103" width="11" height="38" rx="3" fill="#0d1f33" />
        <rect x="122" y="103" width="11" height="38" rx="3" fill="#0d1f33" />
        <ellipse cx="90" cy="52" rx="10" ry="10" fill="#0c1a2e" />
        <rect x="81" y="62" width="18" height="45" rx="3" fill="#0c1a2e" />
        <rect x="83" y="107" width="9" height="32" rx="3" fill="#0c1a2e" />
        <rect x="93" y="107" width="9" height="32" rx="3" fill="#0c1a2e" />
      </svg>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 400,
          background:
            'linear-gradient(to top, rgba(5,10,20,0.95) 0%, rgba(10,20,40,0.7) 40%, transparent 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to bottom, rgba(5,10,20,0.6) 0%, transparent 100%)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 28,
          color: 'white',
          fontFamily: "'Montserrat', system-ui, sans-serif"
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: 'uppercase'
          }}
        >
          Family Adventures
        </div>
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>Made for memories that last.</div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: 28,
          color: 'white',
          fontFamily: "'Montserrat', system-ui, sans-serif",
          textAlign: 'right'
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: 'uppercase'
          }}
        >
          7 Epic Experiences
        </div>
        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
          You can&apos;t miss these.
        </div>
      </div>

      <div style={{ position: 'absolute', top: 100, left: 0, right: 0, textAlign: 'center' }}>
        <div
          style={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 400,
            height: 180,
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)'
          }}
        />
        <div
          style={{
            position: 'relative',
            fontSize: 98,
            fontWeight: 700,
            color: 'white',
            letterSpacing: 10,
            lineHeight: 1,
            textShadow: '0 4px 30px rgba(0,0,0,0.5)'
          }}
        >
          WANDER
        </div>
        <div
          style={{
            position: 'relative',
            fontSize: 62,
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#C9A84C',
            marginTop: -6,
            textShadow: '0 2px 20px rgba(201,168,76,0.3)'
          }}
        >
          Together
        </div>
        <div
          style={{
            position: 'relative',
            fontSize: 11,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: 7,
            marginTop: 10,
            fontFamily: "'Montserrat', system-ui, sans-serif",
            textTransform: 'uppercase'
          }}
        >
          Travel Magazine
        </div>
        <div
          style={{
            position: 'relative',
            width: 80,
            height: 1.5,
            backgroundColor: '#C9A84C',
            margin: '14px auto 0',
            opacity: 0.7
          }}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
            letterSpacing: 4,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}
        >
          TENERIFE
        </div>
        <div style={{ fontSize: 36, fontStyle: 'italic', color: '#C9A84C', marginTop: 4 }}>
          Canary Islands
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 5,
            marginTop: 10,
            fontFamily: "'Montserrat', system-ui, sans-serif"
          }}
        >
          BEACHES · CULTURE · ADVENTURE · THE PERFECT FAMILY ESCAPE
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 28,
          width: 66,
          height: 66,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #8B7355, #6B5335)',
          border: '2px solid rgba(201,168,76,0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: "'Montserrat', system-ui, sans-serif",
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>20</div>
        <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>25</div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 34,
          right: 28,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 3
        }}
      >
        <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
          {[5, 2, 4, 1, 3, 2, 5, 1, 4, 2, 3, 1, 5, 2, 3, 4, 1, 3, 2, 5].map((h, i) => (
            <div
              key={i}
              style={{ width: 2, height: h * 5, backgroundColor: 'rgba(255,255,255,0.75)' }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 8,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: "'Montserrat', system-ui, sans-serif",
            letterSpacing: 1
          }}
        >
          WANDERBOOK
        </div>
      </div>
    </div>
  );
}

function BlueBoldCover() {
  return (
    <div
      style={{
        width: 643,
        height: 907,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0047AB',
        fontFamily: "'Oswald', Impact, 'Arial Narrow', Arial, sans-serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 60% 40%, #1a6bb5 0%, transparent 50%), radial-gradient(ellipse at 30% 60%, #0035a0 0%, transparent 40%), linear-gradient(155deg, #1565C0 0%, #0047AB 30%, #002d8c 60%, #001560 100%)'
        }}
      />

      <svg
        style={{ position: 'absolute', right: 40, top: 80, width: 260, height: 500 }}
        viewBox="0 0 260 500"
      >
        <ellipse cx="130" cy="60" rx="28" ry="28" fill="rgba(255,255,255,0.08)" />
        <rect x="102" y="88" width="56" height="120" rx="8" fill="rgba(255,255,255,0.06)" />
        <rect x="140" y="90" width="44" height="80" rx="10" fill="rgba(255,255,255,0.05)" />
        <rect
          x="70"
          y="95"
          width="36"
          height="90"
          rx="8"
          fill="rgba(255,255,255,0.06)"
          transform="rotate(-15 88 95)"
        />
        <rect
          x="158"
          y="92"
          width="36"
          height="85"
          rx="8"
          fill="rgba(255,255,255,0.05)"
          transform="rotate(10 176 92)"
        />
        <rect
          x="104"
          y="205"
          width="26"
          height="130"
          rx="8"
          fill="rgba(255,255,255,0.07)"
          transform="rotate(5 117 205)"
        />
        <rect
          x="134"
          y="205"
          width="26"
          height="130"
          rx="8"
          fill="rgba(255,255,255,0.06)"
          transform="rotate(-5 147 205)"
        />
        <rect
          x="68"
          y="160"
          width="4"
          height="200"
          rx="2"
          fill="rgba(255,255,255,0.15)"
          transform="rotate(-8 70 160)"
        />
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 12,
          backgroundColor: '#FF3333'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 12,
          right: 0,
          height: 40,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 11,
            letterSpacing: 2,
            fontFamily: "'Inter', system-ui, sans-serif"
          }}
        >
          ISSUE 01 · 2025
        </span>
        <span
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 11,
            letterSpacing: 1,
            fontFamily: "'Inter', system-ui, sans-serif"
          }}
        >
          WWW.WANDERBOOK.COM
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 16,
          top: 50,
          fontSize: 172,
          fontWeight: 900,
          color: 'white',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          letterSpacing: -6,
          lineHeight: 1,
          opacity: 0.95,
          textShadow: '6px 0 0 rgba(255,50,50,0.25), -2px 0 0 rgba(0,0,200,0.3)'
        }}
      >
        TRAVEL
      </div>

      <div style={{ position: 'absolute', right: 36, top: 70, textAlign: 'right' }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: 'white',
            lineHeight: 1,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          25+
        </div>
        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: '#FF3333',
            marginLeft: 'auto',
            marginTop: 4
          }}
        />
        <div
          style={{
            fontSize: 14,
            color: 'white',
            letterSpacing: 3,
            marginTop: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
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
          top: 220,
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '6px 14px',
          borderRadius: 2
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 3,
            fontFamily: "'Inter', system-ui, sans-serif"
          }}
        >
          SUMMER 2025
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 12,
          right: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
          padding: '60px 28px 32px'
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 400, color: 'white', lineHeight: 1.4, marginBottom: 12 }}>
          Explore Mountains,
          <br />
          Cities &amp; Beyond
        </div>
        <div style={{ width: 60, height: 3, backgroundColor: '#FF3333', marginBottom: 12 }} />
        <div
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 1,
            fontFamily: "'Inter', system-ui, sans-serif"
          }}
        >
          By James Smith
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 20
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#FF3333',
                  opacity: i === 1 ? 1 : 0.5
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
            {[4, 2, 5, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 2, 4].map((h, i) => (
              <div
                key={i}
                style={{ width: 2, height: h * 5, backgroundColor: 'rgba(255,255,255,0.6)' }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExploreEditorialCover() {
  return (
    <div
      style={{
        width: 643,
        height: 907,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, #87CEEB 0%, #6BA8D4 8%, #E8C170 18%, #D4853A 32%, #C4622D 44%, #8B3A1A 58%, #5C2010 72%, #3D1408 85%, #1a0804 100%)'
        }}
      />

      <svg
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 480 }}
        viewBox="0 0 643 480"
        preserveAspectRatio="none"
      >
        <polygon
          points="200,480 190,300 220,200 260,120 300,60 320,40 340,55 370,100 400,180 420,280 430,480"
          fill="#2C1208"
          opacity="0.9"
        />
        <polygon
          points="0,480 0,340 40,280 80,220 120,260 140,300 160,340 180,380 200,480"
          fill="#1a0804"
          opacity="0.85"
        />
        <polygon
          points="430,480 420,340 450,260 490,200 530,240 570,200 610,230 643,260 643,480"
          fill="#2a1008"
          opacity="0.9"
        />
        <rect x="0" y="420" width="643" height="60" fill="#0d0402" />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '55%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 100%)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 10,
            fontFamily: "'Inter', system-ui, sans-serif",
            letterSpacing: 1.5
          }}
        >
          VOLUME 05 NO.04 | DECEMBER 2025
        </span>
        <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
          {[4, 2, 3, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 2, 4, 1].map((h, i) => (
            <div
              key={i}
              style={{ width: 1.5, height: h * 5, backgroundColor: 'rgba(255,255,255,0.6)' }}
            />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 52, left: 24 }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 400,
            color: 'white',
            letterSpacing: -1,
            lineHeight: 0.95,
            textShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}
        >
          explore
        </div>
        <div
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: 5,
            marginTop: 6,
            fontFamily: "'Inter', system-ui, sans-serif",
            textTransform: 'uppercase'
          }}
        >
          Magazine
        </div>
        <div style={{ width: 50, height: 1.5, backgroundColor: '#D4A853', marginTop: 8 }} />
      </div>

      <div style={{ position: 'absolute', top: 220, left: 24 }}>
        {['Otaserat', 'Reproupteus', 'Dencilatious'].map((item, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}
          >
            <div style={{ width: 18, height: 1, backgroundColor: '#D4A853' }} />
            <span
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: 12,
                fontFamily: "'Inter', system-ui, sans-serif"
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 130, left: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: 'white',
              lineHeight: 1,
              fontFamily: "'Inter', system-ui, sans-serif"
            }}
          >
            5
          </span>
          <div>
            <div
              style={{
                fontSize: 11,
                color: '#D4A853',
                letterSpacing: 2,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700
              }}
            >
              BEST TRIPS
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#D4A853',
                letterSpacing: 2,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 700
              }}
            >
              FOR 2025
            </div>
          </div>
        </div>
        <div
          style={{
            width: 100,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.25)',
            marginTop: 10
          }}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 24, right: 28 }}>
        <div
          style={{
            fontSize: 30,
            color: 'white',
            lineHeight: 1.35,
            fontStyle: 'italic',
            textShadow: '0 2px 16px rgba(0,0,0,0.6)'
          }}
        >
          Exploring the{' '}
          <span style={{ fontStyle: 'normal', fontWeight: 700, color: 'white' }}>Worlds</span> of
          Seven Continents
        </div>
      </div>
    </div>
  );
}

function TravelMinimalCover() {
  return (
    <div
      style={{
        width: 643,
        height: 907,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        fontFamily: "'DM Sans', Arial, Helvetica, sans-serif"
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
            'radial-gradient(ellipse at 50% 0%, #a8d8f0 0%, transparent 50%), linear-gradient(180deg, #b8e0f7 0%, #6eb5e8 15%, #4a95d0 30%, #2e70b0 50%, #1a4e88 70%, #0d2f5a 85%, #071828 100%)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '15%',
            width: 80,
            height: 25,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.25)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '20%',
            width: 120,
            height: 30,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.2)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 30,
            right: '20%',
            width: 100,
            height: 22,
            borderRadius: 50,
            backgroundColor: 'rgba(255,255,255,0.15)'
          }}
        />

        <svg
          style={{ position: 'absolute', bottom: 80, left: 0, width: '100%', height: 200 }}
          viewBox="0 0 643 200"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,200 0,160 60,80 120,130 180,50 240,100 300,20 360,80 420,40 480,90 540,60 600,100 643,80 643,200"
            fill="#1a4e88"
            opacity="0.5"
          />
          <polygon
            points="0,200 0,180 40,140 100,160 160,100 220,140 280,80 340,120 400,60 460,110 520,70 580,120 643,100 643,200"
            fill="#0d2f5a"
            opacity="0.7"
          />
        </svg>

        <svg
          style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 60,
            height: 150
          }}
          viewBox="0 0 60 150"
        >
          <circle cx="30" cy="18" r="12" fill="#071828" />
          <rect x="20" y="30" width="20" height="55" rx="4" fill="#071828" />
          <rect x="34" y="28" width="20" height="40" rx="6" fill="#071828" />
          <rect
            x="14"
            y="35"
            width="10"
            height="40"
            rx="4"
            fill="#071828"
            transform="rotate(-15 19 35)"
          />
          <rect
            x="40"
            y="33"
            width="10"
            height="38"
            rx="4"
            fill="#071828"
            transform="rotate(10 45 33)"
          />
          <rect
            x="20"
            y="85"
            width="10"
            height="50"
            rx="4"
            fill="#071828"
            transform="rotate(5 25 85)"
          />
          <rect
            x="32"
            y="85"
            width="10"
            height="50"
            rx="4"
            fill="#071828"
            transform="rotate(-5 37 85)"
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 65,
            background:
              'linear-gradient(to top, #040e1a 0%, #071828 60%, transparent 100%)'
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
          backgroundColor: 'white',
          paddingTop: 28,
          paddingLeft: 28,
          paddingRight: 28
        }}
      >
        <div
          style={{
            fontSize: 112,
            fontWeight: 800,
            color: '#0A0A0A',
            lineHeight: 0.88,
            letterSpacing: -5,
            marginBottom: 6
          }}
        >
          TRAVEL
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <span
            style={{
              fontSize: 27,
              fontWeight: 300,
              color: '#0A0A0A',
              letterSpacing: -0.5
            }}
          >
            Magazine
          </span>
          <div style={{ flex: 1, height: 1.5, backgroundColor: '#0A0A0A' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            rowGap: 10,
            columnGap: 20
          }}
        >
          {[
            { num: 'This Week', label: 'Top Place', body: 'Destinations worth every mile' },
            { num: '80+', label: 'Place', body: 'Verified by our travel editors' },
            { num: '#7 Trending', label: 'Vacation', body: 'Summer must-visit picks' },
            { num: '*12 Tips For', label: 'Traveling', body: 'Expert guide for 2025' }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#0A0A0A', lineHeight: 1.2 }}>
                {stat.num}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#0A0A0A' }}>{stat.label}</div>
              <div style={{ fontSize: 9, color: '#999', marginTop: 2, lineHeight: 1.4 }}>
                {stat.body}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 24, color: 'white' }}>
        <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 0.88, letterSpacing: -3 }}>20</div>
        <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 0.88, letterSpacing: -3 }}>25</div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 24,
          display: 'flex',
          gap: 1.5,
          alignItems: 'flex-end'
        }}
      >
        {[5, 2, 4, 1, 5, 2, 3, 1, 4, 2, 5, 1, 3, 2, 5, 1, 4, 2, 3].map((h, i) => (
          <div
            key={i}
            style={{ width: 2, height: h * 5, backgroundColor: 'rgba(255,255,255,0.8)' }}
          />
        ))}
      </div>
    </div>
  );
}
