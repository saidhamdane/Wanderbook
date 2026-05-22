import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBHContents({ slots, palette, fonts }: LayoutProps) {
  const items = [
    slots.item1, slots.item2, slots.item3,
    slots.item4, slots.item5, slots.item6
  ].filter(Boolean);

  return (
    <CanvaPageRoot bg="/templates/red-white/2.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.sidePhoto}
        palette={palette}
        top="2%"
        left="1%"
        width="42%"
        height="36%"
      />

      <CoverBlock color="#FFFFFF" top="36%" left={0} width="100%" height="64%" zIndex={2} />

      <TextZone
        top="3%"
        left="45%"
        right="3%"
        zIndex={3}
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
        {slots.pageTitle || 'CONTENTS'}
      </TextZone>

      <TextZone
        top="40%"
        left="6%"
        right="6%"
        bottom="6%"
        zIndex={3}
        style={{
          fontFamily: fonts.body,
          color: palette.text,
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {items.map((title, i) => (
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
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: palette.text,
                lineHeight: 1.2
              }}
            >
              {title}
            </div>
          </div>
        ))}
      </TextZone>
    </CanvaPageRoot>
  );
}
