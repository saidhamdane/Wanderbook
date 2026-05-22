import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBHEssay({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/4.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.widePhoto}
        palette={palette}
        top="0"
        left="0"
        width="100%"
        height="45%"
      />

      <CoverBlock color="#FFFFFF" top="45%" left={0} width="100%" height="55%" zIndex={1} />

      <TextZone
        top="48%"
        left="4%"
        width="46%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '11px',
          color: palette.primary,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontWeight: 700
        }}
      >
        PHOTO ESSAY
      </TextZone>

      <TextZone
        top="52%"
        left="4%"
        width="46%"
        zIndex={2}
        style={{
          fontFamily: fonts.heading,
          fontSize: '32px',
          fontWeight: 900,
          color: palette.primary,
          lineHeight: 1.05,
          textTransform: 'uppercase'
        }}
      >
        {slots.pageTitle}
      </TextZone>

      <TextZone
        top="68%"
        left="4%"
        width="46%"
        bottom="6%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.body}
      </TextZone>

      <PhotoZone
        src={slots.squarePhoto}
        palette={palette}
        top="50%"
        left="52%"
        width="46%"
        height="44%"
        required={false}
      />
    </CanvaPageRoot>
  );
}
