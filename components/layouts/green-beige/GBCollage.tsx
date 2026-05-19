import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBCollage({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/14.png" fallbackColor={palette.background}>
      <TextZone
        top="5%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '34px',
          fontWeight: 800,
          color: palette.primary,
          lineHeight: 1
        }}
      >
        {slots.collageTitle || 'A Visual Diary'}
      </TextZone>

      <PhotoZone src={slots.col1} fallbackColor={palette.light} top="16%" left="3%" width="44%" height="44%" />
      <PhotoZone src={slots.col2} fallbackColor={palette.light} top="16%" right="3%" width="50%" height="28%" />
      <PhotoZone src={slots.col3} fallbackColor={palette.light} top="46%" right="3%" width="24%" height="22%" />
      <PhotoZone src={slots.col4} fallbackColor={palette.light} top="46%" right="30%" width="23%" height="22%" />

      <TextZone
        top="70%"
        left="6%"
        right="6%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.collageBody}
      </TextZone>
    </CanvaPageRoot>
  );
}
