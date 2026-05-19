import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/cover.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.coverHeroImage}
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
          background: 'rgba(0,0,0,0.35)'
        }}
      />

      <TextZone
        top="6%"
        left="6%"
        right="6%"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: fonts.body,
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#FFFFFF',
          fontWeight: 600
        }}
      >
        <span>{slots.coverMagazineName}</span>
        <span>{slots.coverDate}</span>
      </TextZone>

      <TextZone
        bottom="22%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '64px',
          fontWeight: 800,
          color: palette.accent,
          lineHeight: 0.95,
          letterSpacing: '-1px',
          textShadow: '0 2px 12px rgba(0,0,0,0.4)'
        }}
      >
        {slots.coverMainName}
      </TextZone>

      <TextZone
        bottom="14%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '14px',
          color: '#FFFFFF',
          lineHeight: 1.4,
          maxWidth: '70%'
        }}
      >
        {slots.coverSubtitle}
      </TextZone>

      <TextZone
        bottom="6%"
        left="6%"
        right="50%"
        style={{ fontFamily: fonts.body, color: '#FFFFFF' }}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          {slots.coverStory1Title}
        </div>
        <div style={{ fontSize: '11px', lineHeight: 1.5, marginTop: '4px', opacity: 0.9 }}>
          {slots.coverStory1Body}
        </div>
      </TextZone>

      <TextZone
        bottom="6%"
        right="6%"
        width="40%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          textAlign: 'right'
        }}
      >
        {slots.coverStory2Title}
      </TextZone>
    </CanvaPageRoot>
  );
}
