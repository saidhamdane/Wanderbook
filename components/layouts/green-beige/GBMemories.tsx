import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function GBMemories({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/17.png" fallbackColor={palette.background}>
      <CoverBlock color={palette.background} top="0" left="0" width="100%" height="100%" zIndex={1} />

      <PhotoZone
        src={slots.mem1}
        palette={palette}
        top="2%"
        left="2%"
        width="96%"
        height="55%"
        zIndex={2}
      />
      <PhotoZone
        src={slots.mem2}
        palette={palette}
        top="60%"
        left="2%"
        width="47%"
        height="35%"
        zIndex={2}
        required={false}
      />
      <PhotoZone
        src={slots.mem3}
        palette={palette}
        top="60%"
        left="51%"
        width="47%"
        height="35%"
        zIndex={2}
        required={false}
      />

      {slots.memHeadline && (
        <TextZone
          top="2%"
          left="4%"
          right="4%"
          zIndex={3}
          style={{
            fontFamily: fonts.heading,
            fontSize: '28px',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)'
          }}
        >
          {slots.memHeadline}
        </TextZone>
      )}

      {slots.memBody && (
        <TextZone
          bottom="2%"
          left="4%"
          right="4%"
          zIndex={3}
          style={{
            fontFamily: fonts.body,
            fontSize: '10px',
            color: '#FFFFFF',
            lineHeight: 1.5,
            textShadow: '0 1px 6px rgba(0,0,0,0.6)'
          }}
        >
          {slots.memBody}
        </TextZone>
      )}
    </CanvaPageRoot>
  );
}
