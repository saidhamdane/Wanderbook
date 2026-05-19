import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBBackCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/19.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.backImage}
        fallbackColor={palette.light}
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
            'linear-gradient(180deg, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.7) 100%)'
        }}
      />
      <TextZone
        bottom="14%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.heading,
          fontSize: '34px',
          fontWeight: 900,
          color: '#FFFFFF',
          textTransform: 'uppercase',
          lineHeight: 1.1
        }}
      >
        {slots.backTagline}
      </TextZone>
      <TextZone
        bottom="6%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: '11px',
          letterSpacing: '4px',
          color: '#FFFFFF',
          fontWeight: 600
        }}
      >
        {slots.backWebsite}
      </TextZone>
    </CanvaPageRoot>
  );
}
