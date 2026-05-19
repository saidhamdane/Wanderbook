import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBContents({ slots, palette, fonts }: LayoutProps) {
  const items: Array<[string, string?]> = [
    [slots.item1Title, slots.item1Desc],
    [slots.item2Title, slots.item2Desc],
    [slots.item3Title, slots.item3Desc],
    [slots.item4Title],
    [slots.item5Title],
    [slots.item6Title]
  ];

  return (
    <CanvaPageRoot bg="/templates/red-white/2.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.contentsImage}
        palette={palette}
        top="2%"
        left="1%"
        width="42%"
        height="36%"
      />

      <TextZone
        top="3%"
        left="45%"
        right="3%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '56px',
          fontWeight: 900,
          color: palette.primary,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          lineHeight: 1
        }}
      >
        CONTENTS
      </TextZone>

      <TextZone
        top="34%"
        left="6%"
        right="6%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          color: palette.text,
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {items.map(([title, desc], i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'baseline' }}>
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: '34px',
                fontWeight: 900,
                color: palette.primary,
                minWidth: '60px',
                lineHeight: 1
              }}
            >
              {String((i + 1) * 4).padStart(2, '0')}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  color: palette.text
                }}
              >
                {title || '—'}
              </div>
              {desc && (
                <div style={{ fontSize: '11px', color: '#444', lineHeight: 1.5, marginTop: '4px' }}>
                  {desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </TextZone>
    </CanvaPageRoot>
  );
}
