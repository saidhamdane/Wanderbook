import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function GBArticle2({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/10.png" fallbackColor={palette.background}>
      <CoverBlock color={palette.background} top="0" left="0" width="100%" height="100%" zIndex={1} />

      <PhotoZone
        src={slots.art2Image}
        palette={palette}
        top="0"
        left="0"
        width="100%"
        height="50%"
        zIndex={2}
      />

      <TextZone
        top="54%"
        left="4%"
        right="4%"
        zIndex={2}
        style={{
          fontFamily: fonts.heading,
          fontSize: '40px',
          fontWeight: 800,
          color: palette.primary,
          lineHeight: 1.05
        }}
      >
        {slots.art2Headline}
      </TextZone>

      <TextZone
        top="68%"
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
        {slots.art2Body}
      </TextZone>
    </CanvaPageRoot>
  );
}
