import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function GBContents({ slots, palette, fonts }: LayoutProps) {
  const items = [slots.toc1, slots.toc2, slots.toc3, slots.toc4, slots.toc5, slots.toc6];
  return (
    <CanvaPageRoot bg="/templates/green-beige/2.png" fallbackColor={palette.background}>
      <CoverBlock color={palette.background} top="0" left="0" width="100%" height="100%" zIndex={1} />

      <PhotoZone
        src={slots.contentsImage}
        palette={palette}
        top="2%"
        right="2%"
        width="45%"
        height="40%"
        zIndex={2}
        required={false}
      />

      <TextZone
        top="6%"
        left="5%"
        width="48%"
        zIndex={2}
        style={{
          fontFamily: fonts.heading,
          fontSize: '56px',
          fontWeight: 800,
          color: palette.primary,
          letterSpacing: '-1px',
          lineHeight: 1
        }}
      >
        Contents
      </TextZone>

      <TextZone
        top="22%"
        left="5%"
        width="48%"
        bottom="6%"
        zIndex={2}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid ' + palette.light
            }}
          >
            <span
              style={{
                fontFamily: fonts.heading,
                fontSize: '20px',
                fontWeight: 700,
                color: palette.accent,
                minWidth: '36px'
              }}
            >
              {String((i + 1) * 4).padStart(2, '0')}
            </span>
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: '13px',
                color: palette.text,
                lineHeight: 1.3
              }}
            >
              {it || '—'}
            </span>
          </div>
        ))}
      </TextZone>

      <TextZone
        top="46%"
        right="5%"
        width="45%"
        bottom="6%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.editorialBody}
      </TextZone>
    </CanvaPageRoot>
  );
}
