import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBStory({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/4.png" fallbackColor={palette.background}>
      <CoverBlock color="#FFFFFF" top="8%" left="2%" width="50%" height="75%" zIndex={1} />

      <TextZone
        top="10%"
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
        WELCOME TO
      </TextZone>

      <TextZone
        top="14%"
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
        {slots.story1Headline}
      </TextZone>

      <TextZone
        top="38%"
        left="4%"
        width="46%"
        bottom="10%"
        zIndex={2}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.story1Body}
      </TextZone>

      <PhotoZone
        src={slots.story1Image}
        fallbackColor={palette.light}
        top="8%"
        left="52%"
        width="46%"
        height="75%"
      />
    </CanvaPageRoot>
  );
}
