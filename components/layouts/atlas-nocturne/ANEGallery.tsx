import { LayoutProps } from '@/lib/magazine/types';

const champagne = '#c9a25d';
const ivory = '#fffaf0';
const black = '#070707';
const muted = 'rgba(255,250,240,.78)';

function Cell({ src, caption, fonts, style }: { src?: string; caption?: string; fonts: LayoutProps['fonts']; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#111', ...style }}>
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
      )}
      {caption && (
        <div className="magazine-caption magazine-caption-on-image" style={{
          position: 'absolute',
          left: 10, bottom: 8, right: 10,
          fontFamily: fonts.body,
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#fff',
          textShadow: '0 1px 10px #000',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}>
          {caption}
        </div>
      )}
    </div>
  );
}

export default function ANEGallery({ slots, fonts }: LayoutProps) {
  const PAD = 54;
  const GAP = 10;
  const W = 794 - PAD * 2; // 686
  const col = (n: number) => Math.floor((W - GAP * 5) / 6) * n + GAP * (n - 1);

  const c1 = col(1); // ~109px
  const c2 = col(2); // ~228px
  const c3 = col(3); // ~347px
  const c4 = col(4); // ~466px
  const ROW_H = 170;

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: black, color: ivory, padding: PAD }}>
      {/* Header */}
      <div className="magazine-label" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: champagne }}>
        Collected frames
      </div>
      <div style={{
        fontFamily: fonts.heading,
        fontSize: 46,
        fontWeight: 700,
        lineHeight: 0.92,
        letterSpacing: '-0.045em',
        color: ivory,
        margin: '18px 0 28px',
      }}>
        Small scenes,<br />large memories.
      </div>

      {/* 6-photo grid using explicit positioning */}
      <div style={{ position: 'relative', width: W, height: ROW_H * 3 + GAP * 2 }}>
        {/* Photo 1: big left (2 rows tall, 3 cols wide) */}
        <Cell
          src={slots['gallery-photo-1']}
          caption={slots['gallery-caption-1']}
          fonts={fonts}
          style={{ position: 'absolute', left: 0, top: 0, width: c3 - GAP, height: ROW_H * 2 + GAP }}
        />
        {/* Photo 2: top right (1 row, 3 cols) */}
        <Cell
          src={slots['gallery-photo-2']}
          caption={slots['gallery-caption-2']}
          fonts={fonts}
          style={{ position: 'absolute', left: c3, top: 0, width: W - c3, height: ROW_H }}
        />
        {/* Photo 3: middle right tall (2 rows, 2 cols) */}
        <Cell
          src={slots['gallery-photo-3']}
          caption={slots['gallery-caption-3']}
          fonts={fonts}
          style={{ position: 'absolute', left: c3, top: ROW_H + GAP, width: c2, height: ROW_H * 2 + GAP }}
        />
        {/* Photo 4: small right (1 row, 1 col) */}
        <Cell
          src={slots['gallery-photo-4']}
          caption={slots['gallery-caption-4']}
          fonts={fonts}
          style={{ position: 'absolute', left: c3 + c2 + GAP, top: ROW_H + GAP, width: W - c3 - c2 - GAP, height: ROW_H }}
        />
        {/* Photo 5: bottom left (1 row, 2 cols) */}
        <Cell
          src={slots['gallery-photo-5']}
          caption={slots['gallery-caption-5']}
          fonts={fonts}
          style={{ position: 'absolute', left: 0, top: ROW_H * 2 + GAP * 2, width: c2, height: ROW_H }}
        />
        {/* Photo 6: bottom wide (1 row, 4 cols) */}
        <Cell
          src={slots['gallery-photo-6']}
          caption={slots['gallery-caption-6']}
          fonts={fonts}
          style={{ position: 'absolute', left: c2 + GAP, top: ROW_H * 2 + GAP * 2, width: W - c2 - GAP, height: ROW_H }}
        />
      </div>

      {/* Bottom notes */}
      <div style={{ position: 'absolute', left: PAD, right: PAD, bottom: 62, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50 }}>
        <div className="magazine-copy magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 10, lineHeight: 1.45, color: muted, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          A private travel magazine made from real images, destination atmosphere, and the small details that survive after the trip.
        </div>
        <div className="magazine-copy magazine-copy-on-dark" style={{ fontFamily: fonts.body, fontSize: 10, lineHeight: 1.45, color: muted, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          Each frame becomes part of the editorial rhythm: cover, story, route, gallery, quote, and closing page.
        </div>
      </div>

      {/* Folio */}
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, right: PAD, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
        06
      </div>
    </div>
  );
}
