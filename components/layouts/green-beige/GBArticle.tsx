import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBArticle({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/6.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.art1ImageLeft}
        fallbackColor={palette.light}
        top="6%"
        left="6%"
        width="42%"
        height="56%"
      />
      <PhotoZone
        src={slots.art1ImageRight}
        fallbackColor={palette.light}
        top="6%"
        right="6%"
        width="42%"
        height="32%"
      />

      <TextZone
        top="42%"
        right="6%"
        width="42%"
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
        {slots.art1Body}
      </TextZone>
    </CanvaPageRoot>
  );
}
