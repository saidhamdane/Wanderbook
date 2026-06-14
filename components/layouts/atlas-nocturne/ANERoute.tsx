import { LayoutProps } from '@/lib/magazine/types';

const champagne = '#c9a25d';
const paper = '#f7f1e5';
const muted = '#746e63';

function Photo({ src, style }: { src?: string; style: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', overflow: 'hidden', background: '#ccc', ...style }}>
      {src ? (
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', background: '#aaa' }} />
      )}
    </div>
  );
}

export default function ANERoute({ slots, fonts }: LayoutProps) {
  const title = slots['route-title'] || 'Three stops that made the day.';
  const body = slots['route-body'] || '';

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: paper }}>
      {/* Vertical champagne map line */}
      <div style={{ position: 'absolute', left: 110, top: 108, bottom: 132, width: 2, background: champagne }} />

      {/* Route dots */}
      <div style={{ position: 'absolute', left: 101, top: 210, width: 20, height: 20, borderRadius: '50%', background: champagne, border: `5px solid ${paper}` }} />
      <div style={{ position: 'absolute', left: 101, top: 520, width: 20, height: 20, borderRadius: '50%', background: champagne, border: `5px solid ${paper}` }} />
      <div style={{ position: 'absolute', left: 101, bottom: 214, width: 20, height: 20, borderRadius: '50%', background: champagne, border: `5px solid ${paper}` }} />

      {/* Kicker */}
      <div className="magazine-label" style={{ position: 'absolute', left: 160, top: 58, fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: muted }}>
        Route notes
      </div>

      {/* Title */}
      <div style={{ position: 'absolute', left: 160, top: 78, width: 480, fontFamily: fonts.heading, fontSize: 44, fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.045em', color: '#121212', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
        {title}
      </div>

      {/* Body text */}
      {body && (
        <div className="magazine-copy" style={{ position: 'absolute', left: 160, top: 238, width: 260, maxHeight: 240, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 1.58, color: '#26231e', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 10, WebkitBoxOrient: 'vertical' }}>
          {body}
        </div>
      )}

      {/* Three route photos */}
      <Photo src={slots['route-photo-1']} style={{ left: 470, top: 230, width: 220, height: 300 }} />
      <Photo src={slots['route-photo-2']} style={{ left: 160, bottom: 126, width: 260, height: 260 }} />
      <Photo src={slots['route-photo-3']} style={{ right: 78, bottom: 92, width: 230, height: 330 }} />

      {/* Folios */}
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, left: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        Route
      </div>
      <div className="magazine-label" style={{ position: 'absolute', bottom: 28, right: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        05
      </div>
    </div>
  );
}
