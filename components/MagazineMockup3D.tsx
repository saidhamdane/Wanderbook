'use client';

type TemplateLike = {
  id: string;
  name: string;
  badge?: string;
  palette: { primary: string; accent: string; background: string; text: string };
  fonts: { heading: string; subheading: string; body: string };
};

type Props = {
  template: TemplateLike;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const RESTING_ROTATION: Record<string, string> = {
  'red-bold':          'rotateY(-25deg) rotateX(5deg) rotateZ(-3deg)',
  'wander-together':   'rotateY(-15deg) rotateX(4deg) rotateZ(2deg)',
  'travel-minimal':    'rotateY(-20deg) rotateX(6deg) rotateZ(-5deg)',
  'blue-bold':         'rotateY(-22deg) rotateX(5deg) rotateZ(1deg)',
  'explore-editorial': 'rotateY(-18deg) rotateX(4deg) rotateZ(-2deg)',
  'green-beige':       'rotateY(-28deg) rotateX(7deg) rotateZ(4deg)',
  'hanover':           'rotateY(-23deg) rotateX(6deg) rotateZ(-4deg)',
};

export default function MagazineMockup3D({ template, isHovered, onClick, onMouseEnter, onMouseLeave }: Props) {
  const resting = RESTING_ROTATION[template.id] || 'rotateY(-20deg) rotateX(5deg)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        perspective: '1200px',
        cursor: 'pointer',
        width: 220,
        height: 300,
        position: 'relative',
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: isHovered
          ? 'rotateY(-5deg) rotateX(2deg) rotateZ(0deg) translateY(-16px) scale(1.05)'
          : resting,
        transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease',
        filter: isHovered
          ? 'drop-shadow(0 40px 40px rgba(0,0,0,0.55))'
          : 'drop-shadow(0 20px 30px rgba(0,0,0,0.45))',
      }}>

        {/* FRONT COVER */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: template.palette.primary,
          borderRadius: '2px 6px 6px 2px',
          overflow: 'hidden',
          backfaceVisibility: 'hidden',
        }}>
          {/* Cover photo */}
          <img
            src={`/templates/${template.id}-cover.jpg`}
            onError={(e) => {
              const img = e.currentTarget;
              img.style.display = 'none';
              if (img.parentElement) {
                img.parentElement.style.background =
                  `linear-gradient(135deg, ${template.palette.primary}, ${template.palette.accent}88)`;
              }
            }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
            }}
            alt=""
          />

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 35%, ${template.palette.primary}cc 80%, ${template.palette.primary} 100%)`,
          }} />

          {/* Cover text */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '16px 14px',
          }}>
            <div style={{
              color: template.palette.accent,
              fontSize: '0.42rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: 5,
              fontFamily: 'system-ui',
            }}>
              WANDERBOOK · TRAVEL MAGAZINE
            </div>
            <div style={{
              color: '#fff',
              fontSize: '1.05rem',
              fontFamily: 'Georgia, serif',
              fontWeight: 900,
              lineHeight: 1.1,
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
            }}>
              YOUR FAMILY<br />JOURNEY
            </div>
            <div style={{
              marginTop: 6,
              width: 20,
              height: 1.5,
              background: template.palette.accent,
            }} />
          </div>

          {/* Fallback gradient when no image */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, ${template.palette.primary} 0%, ${template.palette.accent}55 50%, ${template.palette.primary}dd 100%)`,
            zIndex: -1,
          }} />

          {/* Badge */}
          {template.badge && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: template.palette.accent,
              color: '#fff',
              fontSize: '0.38rem',
              fontWeight: 900,
              padding: '3px 7px',
              borderRadius: 20,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'system-ui',
            }}>
              {template.badge}
            </div>
          )}
        </div>

        {/* SPINE */}
        <div style={{
          position: 'absolute',
          left: -12,
          top: 0,
          width: 12,
          height: '100%',
          background: `linear-gradient(90deg, ${template.palette.primary}77, ${template.palette.primary})`,
          transformOrigin: 'right center',
          transform: 'rotateY(-90deg)',
          borderRadius: '2px 0 0 2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.28rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            fontFamily: 'system-ui',
          }}>
            WANDERBOOK
          </span>
        </div>

        {/* PAGE EDGES — paper layers on right */}
        <div style={{
          position: 'absolute',
          right: -6,
          top: 2,
          width: 6,
          height: 'calc(100% - 4px)',
          background: 'repeating-linear-gradient(180deg, #f5f0e8 0px, #e0d8c8 1px, #f5f0e8 2px)',
          borderRadius: '0 2px 2px 0',
        }} />

        {/* BACK COVER depth */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: template.palette.primary,
          transform: 'translateZ(-2px)',
          borderRadius: '2px 6px 6px 2px',
        }} />
      </div>

      {/* Floor shadow */}
      <div style={{
        position: 'absolute',
        bottom: -20,
        left: '10%',
        width: '80%',
        height: 20,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)',
        filter: 'blur(8px)',
        transform: isHovered ? 'scaleX(1.25) translateY(10px)' : 'scaleX(1)',
        transition: 'all 0.5s ease',
      }} />
    </div>
  );
}
