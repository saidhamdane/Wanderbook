import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBQuote({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/16.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.quoteImage}
        palette={palette}
        top="0"
        left="0"
        width="100%"
        height="55%"
      />

      <TextZone
        top="60%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '34px',
          fontWeight: 700,
          color: palette.primary,
          textTransform: 'uppercase',
          lineHeight: 1.15,
          letterSpacing: '1px'
        }}
      >
        “{slots.quoteText}”
      </TextZone>

      <TextZone
        bottom="6%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.7,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.quoteBody}
      </TextZone>
    </CanvaPageRoot>
  );
}
