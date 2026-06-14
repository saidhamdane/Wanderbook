import { LayoutProps } from '@/lib/magazine/types';

const champagne = '#c9a25d';
const ivory = '#fffaf0';
const black = '#070707';
const muted = '#746e63';
const line = 'rgba(18,18,18,.16)';

export default function ANEContents({ slots, fonts }: LayoutProps) {
  const items = [1, 2, 3, 4, 5, 6].map((n, i) => ({
    num: String(n).padStart(2, '0'),
    label: slots[`toc-item-${n}`] || '',
    page: String(n * 2 + 1),
  })).filter((i) => i.label);

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: ivory }}>
      {/* Left black panel */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 310, height: '100%', background: black, color: '#fff', padding: '58px 42px' }}>
        <div className="magazine-label" style={{ fontFamily: fonts.body, fontSize: 10, fontWeight: 800, letterSpacing: '0.24em', textTransform: 'uppercase', color: champagne }}>
          Index
        </div>
        <div style={{
          fontFamily: fonts.heading,
          fontSize: 54,
          fontWeight: 700,
          lineHeight: 0.88,
          letterSpacing: '-0.05em',
          marginTop: 88,
          color: '#fff',
        }}>
          Inside<br />the<br />Journey
        </div>
        {/* Vertical label */}
        <div style={{
          position: 'absolute',
          left: 44,
          bottom: 76,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: fonts.body,
          fontSize: 12,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: champagne,
        }}>
          Atlas Nocturne
        </div>
      </div>

      {/* Overlapping photo (sits on both panels) */}
      <div style={{ position: 'absolute', left: 250, top: 78, width: 320, height: 420, border: `12px solid ${ivory}`, boxShadow: '0 18px 45px rgba(0,0,0,.28)', overflow: 'hidden', background: '#222' }}>
        {slots['contents-photo'] ? (
          <img src={slots['contents-photo']} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#2a2a2a' }} />
        )}
      </div>

      {/* TOC list */}
      <div style={{ position: 'absolute', left: 360, right: 58, bottom: 102 }}>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li key={item.num} className="magazine-contents-row" style={{ display: 'grid', gridTemplateColumns: '42px 1fr 34px', gap: 15, alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${line}` }}>
              <span className="magazine-contents-number" style={{ fontFamily: fonts.body, fontWeight: 800, color: champagne, fontSize: 18 }}>{item.num}</span>
              <span className="magazine-contents-item" style={{ fontFamily: fonts.heading, fontSize: 19, fontWeight: 600, lineHeight: 1.08, color: black, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.label}
              </span>
              <span className="magazine-contents-page" style={{ fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.16em', color: muted, textAlign: 'right' }}>{item.page}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Folio */}
      <div style={{ position: 'absolute', bottom: 28, right: 58, fontFamily: fonts.body, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: muted }}>
        02
      </div>
    </div>
  );
}
