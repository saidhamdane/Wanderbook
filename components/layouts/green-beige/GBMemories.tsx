import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function GBMemories({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/17.png" fallbackColor={palette.background}>
      <TextZone
        top="5%"
        left="6%"
        right="6%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '38px',
          fontWeight: 800,
          color: palette.primary,
          lineHeight: 1
        }}
      >
        {slots.memHeadline || 'Memories'}
      </TextZone>

      <PhotoZone src={slots.mem1} fallbackColor={palette.light} top="16%" left="3%" width="64%" height="40%" />
      <PhotoZone src={slots.mem2} fallbackColor={palette.light} top="16%" right="3%" width="30%" height="19%" />
      <PhotoZone src={slots.mem3} fallbackColor={palette.light} top="37%" right="3%" width="30%" height="19%" />

      <TextZone
        top="60%"
        left="6%"
        right="6%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.85,
          color: palette.text,
          whiteSpace: 'pre-wrap',
          columnCount: 2,
          columnGap: '20px'
        }}
      >
        {slots.memBody}
      </TextZone>
    </CanvaPageRoot>
  );
}
