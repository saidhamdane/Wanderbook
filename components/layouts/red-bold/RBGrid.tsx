import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBGrid({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/12.png" fallbackColor={palette.background}>
      <TextZone
        top="5%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '40px',
          fontWeight: 900,
          color: palette.primary,
          textTransform: 'uppercase',
          lineHeight: 1,
          letterSpacing: '1px'
        }}
      >
        {slots.gridHeadline || 'MEMORIES'}
      </TextZone>

      <PhotoZone src={slots.grid1} fallbackColor={palette.light} top="18%" left="2%" width="47%" height="35%" />
      <PhotoZone src={slots.grid2} fallbackColor={palette.light} top="18%" left="51%" width="47%" height="35%" />
      <PhotoZone src={slots.grid3} fallbackColor={palette.light} top="55%" left="2%" width="47%" height="35%" />
      <PhotoZone src={slots.grid4} fallbackColor={palette.light} top="55%" left="51%" width="47%" height="35%" />
    </CanvaPageRoot>
  );
}
