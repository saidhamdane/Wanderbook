import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBHQuote({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/16.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.featurePhoto}
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
        {slots.quote ? `"${slots.quote}"` : ''}
      </TextZone>

      <TextZone
        bottom="6%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#888',
          textTransform: 'uppercase'
        }}
      >
        {slots.caption}
      </TextZone>
    </CanvaPageRoot>
  );
}
