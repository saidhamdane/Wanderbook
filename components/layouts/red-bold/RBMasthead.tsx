import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBMasthead({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/3.png" fallbackColor={palette.background}>
      <CoverBlock color="#FFFFFF" top="2%" left="2%" width="96%" height="46%" zIndex={1} />

      <TextZone
        top="6%"
        left="6%"
        right="6%"
        zIndex={2}
        style={{
          fontFamily: fonts.heading,
          fontSize: '48px',
          fontWeight: 900,
          color: palette.primary,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          lineHeight: 1
        }}
      >
        MASTHEAD
      </TextZone>

      <TextZone
        top="18%"
        left="6%"
        right="6%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap',
          maxHeight: '26%',
          overflow: 'hidden'
        }}
      >
        {slots.mastheadBody}
      </TextZone>

      <PhotoZone
        src={slots.mastheadImage}
        fallbackColor={palette.light}
        top="50%"
        left="2%"
        width="96%"
        height="32%"
      />
    </CanvaPageRoot>
  );
}
