import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBArticle2({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/10.png" fallbackColor={palette.background}>
      <TextZone
        top="6%"
        left="6%"
        right="6%"
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

      <PhotoZone
        src={slots.art2Image}
        fallbackColor={palette.light}
        top="22%"
        left="6%"
        width="88%"
        height="42%"
      />

      <TextZone
        top="68%"
        left="6%"
        right="6%"
        bottom="6%"
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
