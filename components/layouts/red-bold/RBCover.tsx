import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/1.png" fallbackColor={palette.primary}>
      <PhotoZone
        src={slots.coverHeroImage}
        palette={palette}
        top="30%"
        left="2%"
        width="96%"
        height="43%"
      />

      <CoverBlock color="#FFFFFF" top="18%" left={0} width="100%" height="16%" zIndex={2} />

      <TextZone
        top="6%"
        left={0}
        right={0}
        zIndex={3}
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
        top="19%"
        left={0}
        right={0}
        zIndex={3}
        style={{
          textAlign: 'center',
          fontFamily: fonts.heading,
          fontSize: '76px',
          fontWeight: 900,
          color: palette.primary,
          letterSpacing: '2px',
          lineHeight: 1,
          textTransform: 'uppercase'
        }}
      >
        {slots.coverDestination || 'DESTINATION'}
      </TextZone>

      <CoverBlock color="#FFFFFF" top="78%" left={0} width="100%" height="22%" zIndex={2} />

      <TextZone
        bottom="14%"
        left="6%"
        right="6%"
        zIndex={3}
        style={{
          textAlign: 'center',
          fontFamily: fonts.body,
          fontSize: '11px',
          letterSpacing: '3px',
          color: palette.primary,
          textTransform: 'uppercase',
          fontWeight: 700
        }}
      >
        FEATURED ARTICLES
      </TextZone>

      <TextZone
        bottom="3%"
        left="6%"
        right="6%"
        zIndex={3}
        style={{
          textAlign: 'center',
          fontFamily: fonts.heading,
          fontSize: '22px',
          color: palette.primary,
          fontWeight: 900,
          textTransform: 'uppercase',
          lineHeight: 1.2
        }}
      >
        {slots.coverFeatureTitle}
      </TextZone>
    </CanvaPageRoot>
  );
}
