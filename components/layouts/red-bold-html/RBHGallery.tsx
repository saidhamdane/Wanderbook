import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBHGallery({ slots, palette, fonts }: LayoutProps) {
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
        {slots.collageTitle || 'MEMORIES'}
      </TextZone>

      <PhotoZone src={slots.gridA} palette={palette} top="18%" left="2%" width="47%" height="35%" />
      <PhotoZone src={slots.gridB} palette={palette} top="18%" left="51%" width="47%" height="35%" required={false} />
      <PhotoZone src={slots.gridC} palette={palette} top="55%" left="2%" width="47%" height="35%" required={false} />
      <PhotoZone src={slots.gridD} palette={palette} top="55%" left="51%" width="47%" height="35%" required={false} />

      <TextZone
        bottom="2%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '10px',
          letterSpacing: '2px',
          color: '#888',
          textTransform: 'uppercase'
        }}
      >
        {slots.caption}
      </TextZone>
    </CanvaPageRoot>
  );
}
