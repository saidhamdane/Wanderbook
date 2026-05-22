import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBHFeature({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/8.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.featurePhoto}
        palette={palette}
        top="0"
        left="0"
        width="100%"
        height="44%"
      />

      <CoverBlock color="#FFFFFF" top="44%" left={0} width="54%" height="56%" zIndex={2} />

      <TextZone
        top="46%"
        left="4%"
        width="50%"
        zIndex={3}
        style={{
          fontFamily: fonts.body,
          fontSize: '11px',
          color: palette.primary,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 700
        }}
      >
        FEATURED STORY
      </TextZone>

      <TextZone
        top="50%"
        left="4%"
        width="50%"
        zIndex={3}
        style={{
          fontFamily: fonts.heading,
          fontSize: '32px',
          fontWeight: 900,
          color: palette.text,
          textTransform: 'uppercase',
          lineHeight: 1.05
        }}
      >
        {slots.featureTitle}
      </TextZone>

      <TextZone
        top="68%"
        left="4%"
        width="50%"
        bottom="6%"
        zIndex={3}
        style={{
          fontFamily: fonts.body,
          fontSize: '11px',
          lineHeight: 1.7,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.body}
      </TextZone>

      <PhotoZone
        src={slots.detailPhoto}
        palette={palette}
        top="47%"
        left="55%"
        width="43%"
        height="38%"
        required={false}
      />
    </CanvaPageRoot>
  );
}
