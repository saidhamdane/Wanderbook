import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBStory({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/4.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.story1Image}
        fallbackColor={palette.light}
        top="6%"
        right="3%"
        width="50%"
        height="60%"
      />

      <TextZone
        top="8%"
        left="6%"
        width="40%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '44px',
          fontWeight: 900,
          color: palette.primary,
          textTransform: 'uppercase',
          lineHeight: 1,
          letterSpacing: '1px'
        }}
      >
        {slots.story1Headline}
      </TextZone>

      <TextZone
        top="40%"
        left="6%"
        width="40%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.story1Body}
      </TextZone>
    </CanvaPageRoot>
  );
}
