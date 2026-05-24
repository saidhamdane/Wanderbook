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

// Perspective baked into each transform so no preserve-3d parent is needed
const RESTING_TRANSFORM: Record<string, string> = {
  'red-bold':          'perspective(900px) rotateY(-22deg) rotateX(6deg) rotateZ(-3deg)',
  'wander-together':   'perspective(900px) rotateY(-14deg) rotateX(5deg) rotateZ(2deg)',
  'travel-minimal':    'perspective(900px) rotateY(-20deg) rotateX(7deg) rotateZ(-5deg)',
  'blue-bold':         'perspective(900px) rotateY(-20deg) rotateX(6deg) rotateZ(1deg)',
  'explore-editorial': 'perspective(900px) rotateY(-17deg) rotateX(5deg) rotateZ(-2deg)',
  'green-beige':       'perspective(900px) rotateY(-25deg) rotateX(8deg) rotateZ(4deg)',
  'hanover':           'perspective(900px) rotateY(-21deg) rotateX(7deg) rotateZ(-4deg)',
};

export default function MagazineMockup3D({ template, isHovered, onClick, onMouseEnter, onMouseLeave }: Props) {
  const resting = RESTING_TRANSFORM[template.id] || 'perspective(900px) rotateY(-18deg) rotateX(6deg)';

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        cursor: 'pointer',
        width: 220,
        height: 300,
        position: 'relative',
      }}
    >
      {/* The whole magazine as a single rotated element */}
      <div style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transform: isHovered
          ? 'perspective(900px) rotateY(-4deg) rotateX(2deg) rotateZ(0deg) translateY(-16px) scale(1.06)'
          : resting,
        transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
        borderRadius: '2px 5px 5px 2px',
        overflow: 'hidden',
        // Spine shadow on left, page-edge highlight on right, lift shadow
        boxShadow: isHovered
          ? '-8px 0 14px rgba(0,0,0,0.55), 4px 0 6px rgba(255,255,255,0.08), 0 40px 60px rgba(0,0,0,0.6)'
          : '-6px 0 12px rgba(0,0,0,0.5), 3px 0 5px rgba(255,255,255,0.07), 0 24px 40px rgba(0,0,0,0.45)',
        // Fallback background if image doesn't load
        background: `linear-gradient(135deg, ${template.palette.primary}, ${template.palette.accent}88)`,
      }}>

        {/* Cover photo — fills the entire face */}
        <img
          src={`/templates/${template.id}-cover.jpg`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          alt=""
        />

        {/* Dark vignette — top and bottom only, photo stays visible in middle */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, transparent 40%, rgba(0,0,0,0.68) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Page-edge strip — right side */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: 5, height: '100%',
          background: 'repeating-linear-gradient(180deg, #f5f0e8 0px, #e0d8c8 1px, #f5f0e8 2px)',
          opacity: 0.6,
        }} />

        {/* Cover text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 5,
          padding: '14px 12px',
        }}>
          <div style={{
            color: template.palette.accent,
            fontSize: '0.4rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 4,
            fontFamily: 'system-ui',
          }}>
            WANDERBOOK · TRAVEL
          </div>
          <div style={{
            color: '#fff',
            fontSize: '0.95rem',
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>
            YOUR FAMILY<br />JOURNEY
          </div>
          <div style={{
            marginTop: 5,
            width: 18,
            height: 1.5,
            background: template.palette.accent,
          }} />
        </div>

        {/* Badge */}
        {template.badge && (
          <div style={{
            position: 'absolute', top: 10, right: 14,
            background: template.palette.accent,
            color: '#fff',
            fontSize: '0.36rem',
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

      {/* Floor shadow */}
      <div style={{
        position: 'absolute',
        bottom: -18,
        left: '8%',
        width: '84%',
        height: 18,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
        filter: 'blur(8px)',
        transform: isHovered ? 'scaleX(1.3) translateY(10px)' : 'scaleX(1)',
        transition: 'transform 0.5s ease',
      }} />
    </div>
  );
}
