import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function GBLetter({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/3.png" fallbackColor={palette.background}>
      <CoverBlock color={palette.background} top="0" left="0" width="50%" height="100%" zIndex={1} />

      <PhotoZone
        src={slots.letterImage}
        palette={palette}
        top="0"
        left="50%"
        width="50%"
        height="100%"
      />

      <TextZone
        top="10%"
        left="6%"
        width="40%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '11px',
          color: palette.accent,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontWeight: 700
        }}
      >
        Letter from the Editor
      </TextZone>

      <TextZone
        top="14%"
        left="6%"
        width="42%"
        zIndex={2}
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
        top="42%"
        left="6%"
        width="42%"
        bottom="8%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.85,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.letterBody}
      </TextZone>
    </CanvaPageRoot>
  );
}
