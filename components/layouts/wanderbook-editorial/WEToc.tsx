import { LayoutProps } from '@/lib/magazine/types';

export default function WEToc({ slots, palette, fonts }: LayoutProps) {
  const items = [1, 2, 3, 4, 5, 6].map((n) => ({
    num: n,
    label: slots[`toc-item-${n}`] || '',
    page: String(n * 2 + 1),
  })).filter((i) => i.label);

  return (
    <div style={{ width: 794, height: 1123, position: 'relative', overflow: 'hidden', background: palette.background, display: 'flex' }}>
      {/* Left: photo strip */}
      <div style={{ width: 300, height: '100%', position: 'relative', flexShrink: 0 }}>
        {slots['toc-photo'] ? (
          <img
            src={slots['toc-photo']}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: palette.light }} />
        )}
        {/* Vertical amber bar */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: '100%', background: palette.accent }} />
      </div>

      {/* Right: contents */}
      <div style={{ flex: 1, padding: '52px 40px 40px 44px', display: 'flex', flexDirection: 'column' }}>
        {/* CONTENTS heading */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: fonts.body, fontSize: 9, letterSpacing: 5, color: palette.accent, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
            This Issue
          </div>
          <div style={{ fontFamily: fonts.heading, fontSize: 38, fontWeight: 900, color: palette.primary, lineHeight: 1, textTransform: 'uppercase' }}>
            Contents
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: palette.primary, marginBottom: 32, marginTop: 18 }} />

        {/* TOC list */}
        <div style={{ flex: 1 }}>
          {items.map((item) => (
            <div
              key={item.num}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 22,
                borderBottom: '1px solid ' + palette.light,
                paddingBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: fonts.heading, fontSize: 11, color: palette.accent, fontWeight: 700, minWidth: 16, letterSpacing: 1 }}>
                  {String(item.num).padStart(2, '0')}
                </div>
                <div style={{
                  fontFamily: fonts.body,
                  fontSize: 12,
                  color: palette.text,
                  fontWeight: 500,
                  letterSpacing: 0.5,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {item.label}
                </div>
              </div>
              <div style={{ fontFamily: fonts.body, fontSize: 10, color: palette.accent, letterSpacing: 1, flexShrink: 0, marginLeft: 8 }}>
                {item.page}
              </div>
            </div>
          ))}
        </div>

        {/* Caption */}
        {slots['toc-caption'] && (
          <div style={{
            fontFamily: fonts.body,
            fontSize: 9,
            color: '#999',
            letterSpacing: 2,
            textTransform: 'uppercase',
            lineHeight: 1.6,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {slots['toc-caption']}
          </div>
        )}

        {/* Bottom brand line */}
        <div style={{ marginTop: 20, fontFamily: fonts.heading, fontSize: 10, letterSpacing: 4, color: palette.accent, textTransform: 'uppercase' }}>
          Wanderbook
        </div>
      </div>
    </div>
  );
}
