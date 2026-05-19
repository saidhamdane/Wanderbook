import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function GBArticle({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/6.png" fallbackColor={palette.background}>
      <CoverBlock color={palette.background} top="0" left="0" width="100%" height="100%" zIndex={1} />

      <PhotoZone
        src={slots.art1ImageLeft}
        palette={palette}
        top="2%"
        left="2%"
        width="48%"
        height="55%"
        zIndex={2}
      />
      <PhotoZone
        src={slots.art1ImageRight}
        palette={palette}
        top="2%"
        right="2%"
        width="48%"
        height="55%"
        zIndex={2}
        required={false}
      />

      <TextZone
        top="60%"
        left="4%"
        right="4%"
        zIndex={2}
        style={{
          fontFamily: fonts.heading,
          fontSize: '34px',
          fontWeight: 800,
          color: palette.primary,
          lineHeight: 1.05
        }}
      >
        {slots.art1Headline}
      </TextZone>

      <TextZone
        top="72%"
        left="4%"
        right="4%"
        bottom="6%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.85,
          color: palette.text,
          whiteSpace: 'pre-wrap',
          columnCount: 2,
          columnGap: '20px'
        }}
      >
        {slots.art1Body}
      </TextZone>
    </CanvaPageRoot>
  );
}
