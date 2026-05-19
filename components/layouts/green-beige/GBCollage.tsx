import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function GBCollage({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/green-beige/14.png" fallbackColor={palette.background}>
      <CoverBlock color={palette.background} top="0" left="0" width="100%" height="100%" zIndex={1} />

      <TextZone
        top="1%"
        left="2%"
        right="2%"
        zIndex={3}
        style={{
          fontFamily: fonts.heading,
          fontSize: '20px',
          fontWeight: 700,
          color: palette.primary,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          lineHeight: 1
        }}
      >
        {slots.collageTitle || 'A Visual Diary'}
      </TextZone>

      <PhotoZone src={slots.col1} palette={palette} top="5%" left="2%" width="47%" height="45%" zIndex={2} />
      <PhotoZone src={slots.col2} palette={palette} top="5%" left="51%" width="47%" height="45%" zIndex={2} required={false} />
      <PhotoZone src={slots.col3} palette={palette} top="52%" left="2%" width="47%" height="43%" zIndex={2} required={false} />
      <PhotoZone src={slots.col4} palette={palette} top="52%" left="51%" width="47%" height="43%" zIndex={2} required={false} />

      {slots.collageBody && (
        <TextZone
          top="97%"
          left="2%"
          right="2%"
          zIndex={3}
          style={{
            fontFamily: fonts.body,
            fontSize: '9px',
            color: palette.text,
            lineHeight: 1.3,
            transform: 'translateY(-100%)'
          }}
        >
          {slots.collageBody}
        </TextZone>
      )}
    </CanvaPageRoot>
  );
}
