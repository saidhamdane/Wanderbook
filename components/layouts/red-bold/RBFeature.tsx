import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBFeature({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/8.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.story2Image1}
        fallbackColor={palette.light}
        top="0%"
        left="2%"
        width="96%"
        height="42%"
      />

      <TextZone
        top="48%"
        left="6%"
        right="48%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '36px',
          fontWeight: 900,
          color: palette.primary,
          textTransform: 'uppercase',
          lineHeight: 1
        }}
      >
        {slots.story2Headline}
      </TextZone>

      <TextZone
        top="62%"
        left="6%"
        right="48%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.story2Body}
      </TextZone>

      <PhotoZone
        src={slots.story2Image2}
        fallbackColor={palette.light}
        top="48%"
        left="58%"
        width="40%"
        height="35%"
      />
    </CanvaPageRoot>
  );
}
