import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

// Photo / text zone positions are first-pass estimates. Tune to the
// real /public/templates/red-white/1.png once the export lands.
export default function RBCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/1.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.coverHeroImage}
        fallbackColor={palette.light}
        top="22%"
        left="3%"
        width="94%"
        height="47%"
      />

      <TextZone
        top="6%"
        left={0}
        right={0}
        style={{
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: '12px',
          letterSpacing: '4px',
          color: '#FFFFFF',
          fontWeight: 600
        }}
      >
        {slots.coverMagazineLabel}
      </TextZone>

      <TextZone
        top="11%"
        left={0}
        right={0}
        style={{
          textAlign: 'center',
          fontFamily: fonts.heading,
          fontSize: '96px',
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '4px',
          lineHeight: 1,
          textTransform: 'uppercase'
        }}
      >
        {slots.coverDestination}
      </TextZone>

      <TextZone
        top="73%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '11px',
          letterSpacing: '3px',
          color: '#FFFFFF',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span>{slots.coverIssue}</span>
        <span>{slots.coverDate}</span>
      </TextZone>

      <TextZone
        bottom="6%"
        left="6%"
        right="6%"
        style={{
          textAlign: 'center',
          fontFamily: fonts.heading,
          fontSize: '32px',
          color: palette.primary,
          fontWeight: 700,
          textTransform: 'uppercase',
          lineHeight: 1.1
        }}
      >
        {slots.coverFeatureTitle}
      </TextZone>
    </CanvaPageRoot>
  );
}
