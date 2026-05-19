import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBBackCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/20.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.backImage}
        palette={palette}
        top="0"
        left="0"
        width="100%"
        height="100%"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.75) 100%)'
        }}
      />
      <TextZone
        bottom="14%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.heading,
          fontSize: '46px',
          fontWeight: 800,
          color: palette.accent,
          letterSpacing: '4px',
          textTransform: 'uppercase'
        }}
      >
        {slots.backBrand}
      </TextZone>
      <TextZone
        bottom="6%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: '13px',
          color: '#FFFFFF',
          lineHeight: 1.4
        }}
      >
        {slots.backTagline}
      </TextZone>
    </CanvaPageRoot>
  );
}
