import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBHBack({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/19.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.coverPhoto}
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
        {slots.pageTitle}
      </TextZone>

      <TextZone
        bottom="8%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.85)'
        }}
      >
        {slots.body}
      </TextZone>

      <TextZone
        bottom="3%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: '10px',
          letterSpacing: '4px',
          color: 'rgba(255,255,255,0.6)',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}
      >
        {slots.caption || 'WWW.WANDERBOOK.COM'}
      </TextZone>
    </CanvaPageRoot>
  );
}
