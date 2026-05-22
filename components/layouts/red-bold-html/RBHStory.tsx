import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, CoverBlock, PhotoZone, TextZone } from '../canva-utils';

export default function RBHStory({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/3.png" fallbackColor={palette.background}>
      <CoverBlock color="#FFFFFF" top="20%" left={0} width="100%" height="32%" zIndex={2} />
      <CoverBlock color="#FFFFFF" bottom={0} left={0} width="100%" height="16%" zIndex={2} />

      <TextZone
        top="6%"
        left="6%"
        right="6%"
        zIndex={3}
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
        {slots.pageTitle}
      </TextZone>

      <TextZone
        top="22%"
        left="6%"
        right="6%"
        zIndex={3}
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap',
          maxHeight: '28%',
          overflow: 'hidden'
        }}
      >
        {slots.body}
      </TextZone>

      <PhotoZone
        src={slots.widePhoto}
        palette={palette}
        top="54%"
        left="2%"
        width="96%"
        height="30%"
      />

      <TextZone
        bottom="4%"
        left="6%"
        right="6%"
        zIndex={3}
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
