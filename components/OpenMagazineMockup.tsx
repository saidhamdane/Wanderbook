'use client';

type TemplateLike = {
  id: string;
  name: string;
  mood: string;
  palette: { primary: string; accent: string; background: string; text: string };
  pages: unknown[];
  external?: boolean;
  canvaUrl?: string;
};

type Props = {
  template: TemplateLike;
  selected: boolean;
  onSelect: () => void;
};

const TILT: Record<string, number> = {
  'red-bold':           -4,
  'wander-together':     3,
  'travel-minimal':     -6,
  'blue-bold':           2,
  'explore-editorial':  -3,
  'green-beige':         5,
  'hanover':            -5,
  'wanderbook-luxury':   4,
  'canva-travel':       -2,
};

export function OpenMagazineMockup({ template, selected, onSelect }: Props) {
  const tilt = selected ? 0 : (TILT[template.id] ?? -3);
  const pageCount = template.pages?.length ?? 8;

  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '20px 16px 16px',
        scrollSnapAlign: 'center',
        flexShrink: 0,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Open magazine */}
      <div style={{
        position: 'relative',
        width: 280,
        height: 200,
        transform: selected
          ? 'rotate(0deg) translateY(-12px) scale(1.05)'
          : `rotate(${tilt}deg)`,
        transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1), filter 0.4s ease',
        filter: selected
          ? 'drop-shadow(0 0 20px #C9A84C88) drop-shadow(0 30px 40px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))',
      }}>
        {/* LEFT PAGE — back cover / solid colour */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0,
          width: '49%',
          height: '100%',
          background: `linear-gradient(135deg, ${template.palette.primary}cc, ${template.palette.primary})`,
          borderRadius: '4px 0 0 4px',
          transform: 'perspective(600px) rotateY(8deg)',
          transformOrigin: 'right center',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          padding: 8,
        }}>
          <div style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: `1.5px solid ${template.palette.accent}55`,
          }} />
        </div>

        {/* SPINE — center crease */}
        <div style={{
          position: 'absolute',
          left: '48%',
          top: '5%',
          width: 4,
          height: '90%',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.45), rgba(255,255,255,0.12), rgba(0,0,0,0.35))',
          zIndex: 2,
        }} />

        {/* RIGHT PAGE — front cover with photo */}
        <div style={{
          position: 'absolute',
          right: 0, top: 0,
          width: '49%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '0 4px 4px 0',
          background: template.palette.primary,
          transform: 'perspective(600px) rotateY(-6deg)',
          transformOrigin: 'left center',
        }}>
          <img
            src={`/templates/${template.id}-cover.jpg`}
            alt={template.name}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
            }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
          />
          {/* Cover name overlay — dark vignette only, keeps photo visible */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.78))',
            padding: '18px 8px 7px',
          }}>
            <div style={{
              color: '#fff',
              fontSize: '0.52rem',
              fontFamily: 'Georgia, serif',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {template.name}
            </div>
          </div>
        </div>

        {/* PAGE THICKNESS — bottom edge */}
        <div style={{
          position: 'absolute',
          bottom: -4,
          left: '10%',
          width: '80%',
          height: 4,
          background: 'repeating-linear-gradient(90deg, #f0ebe0 0px, #e0d8c8 2px, #f0ebe0 4px)',
          borderRadius: '0 0 2px 2px',
        }} />

        {/* SURFACE SHADOW */}
        <div style={{
          position: 'absolute',
          bottom: -16,
          left: '5%',
          width: '90%',
          height: 16,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.38) 0%, transparent 70%)',
          filter: 'blur(6px)',
          transform: selected ? 'scaleX(1.3) translateY(10px)' : 'scaleX(1)',
          transition: 'transform 0.4s ease',
        }} />
      </div>

      {/* Info below */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <div style={{
          color: template.palette.accent,
          fontSize: '0.52rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          fontFamily: 'system-ui',
        }}>
          {template.mood}
        </div>
        <div style={{
          color: '#fff',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1rem',
          fontWeight: 700,
          margin: '5px 0 3px',
        }}>
          {template.name}
        </div>
        <div style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '0.65rem',
          fontFamily: 'system-ui',
          marginBottom: 12,
        }}>
          {pageCount} editorial pages
        </div>

        {/* Select indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: selected ? '6px 16px' : '6px 14px',
          borderRadius: 20,
          background: selected ? '#C9A84C' : 'transparent',
          border: `1.5px solid ${selected ? '#C9A84C' : 'rgba(201,168,76,0.45)'}`,
          color: selected ? '#0a0f1e' : '#C9A84C',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontFamily: 'system-ui',
          transition: 'all 0.25s ease',
        }}>
          {selected ? '✓ Selected' : 'Select'}
        </div>

        {/* External / Canva badge */}
        {template.external && (
          <div style={{
            marginTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'rgba(233,69,96,0.15)',
            border: '1px solid rgba(233,69,96,0.4)',
            color: '#e94560',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui',
          }}>
            ↗ Opens in Canva
          </div>
        )}
      </div>
    </div>
  );
}
