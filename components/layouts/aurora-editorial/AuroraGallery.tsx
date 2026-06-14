import { LayoutProps } from '@/lib/magazine/types';
import { magazineLabel } from '@/lib/magazine/localize-magazine';

const PAPER = '#f6f3ec';
const INK = '#17191d';
const TEAL = '#0e6e66';
const SAND = '#c08a4a';
const MUTED = 'rgba(23,25,29,0.48)';

function Photo({ src, caption, fonts, style }: {
  src?: string;
  caption?: string;
  fonts: LayoutProps['fonts'];
  style: React.CSSProperties;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ flex: 1, overflow: 'hidden', background: `${TEAL}18` }}>
        {src ? (
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: `${TEAL}14` }} />
        )}
      </div>
      {caption && (
        <div className="magazine-caption" style={{
          paddingTop: 6,
          fontFamily: fonts.subheading,
          fontSize: 8,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: MUTED,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

export default function AuroraGallery({ slots, fonts, language }: LayoutProps) {
  const PAD = 44;
  const GAP = 10;
  const W = 794 - PAD * 2; // 706px

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: PAPER, padding: `${PAD}px` }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 32, height: 3, background: TEAL, flexShrink: 0 }} />
        <div className="magazine-label" style={{
          fontFamily: fonts.subheading,
          fontSize: 9,
          letterSpacing: '0.36em',
          textTransform: 'uppercase',
          color: TEAL,
          fontWeight: 800,
        }}>
          {magazineLabel(language, 'gallery')}
        </div>
        <div style={{ flex: 1, height: 1, background: `${INK}16` }} />
      </div>

      {/* Row 1: 1 full-width photo */}
      <Photo
        src={slots['gallery-photo-1']}
        caption={slots['gallery-caption-1']}
        fonts={fonts}
        style={{ width: W, height: 294, marginBottom: GAP + 22 }}
      />

      {/* Row 2: 2 side-by-side photos */}
      <div style={{ display: 'flex', gap: GAP, marginBottom: GAP + 22 }}>
        <Photo
          src={slots['gallery-photo-2']}
          caption={slots['gallery-caption-2']}
          fonts={fonts}
          style={{ flex: 1, height: 238 }}
        />
        <Photo
          src={slots['gallery-photo-3']}
          caption={slots['gallery-caption-3']}
          fonts={fonts}
          style={{ flex: 1, height: 238 }}
        />
      </div>

      {/* Row 3: 2 side-by-side photos (asymmetric: 55/45) */}
      <div style={{ display: 'flex', gap: GAP }}>
        <Photo
          src={slots['gallery-photo-4']}
          caption={slots['gallery-caption-4']}
          fonts={fonts}
          style={{ width: Math.round(W * 0.56), height: 218 }}
        />
        <Photo
          src={slots['gallery-photo-5']}
          caption={slots['gallery-caption-5']}
          fonts={fonts}
          style={{ flex: 1, height: 218 }}
        />
      </div>

      {/* Sand accent strip at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 4,
        background: SAND,
      }} />
    </div>
  );
}
