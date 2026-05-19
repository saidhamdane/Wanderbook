import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBLetter({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/3.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.letterImage}
        fallbackColor={palette.light}
        top="6%"
        left="6%"
        width="45%"
        height="60%"
      />

      <TextZone
        top="6%"
        right="6%"
        width="42%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '40px',
          fontWeight: 800,
          color: palette.primary,
          lineHeight: 1.05
        }}
      >
        {slots.letterHeadline}
      </TextZone>

      <TextZone
        top="38%"
        right="6%"
        width="42%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.letterBody}
      </TextZone>
    </CanvaPageRoot>
  );
}
