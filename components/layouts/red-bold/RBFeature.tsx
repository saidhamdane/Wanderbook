import { LayoutProps } from '@/lib/magazine/types';
import { CanvaPageRoot, PhotoZone, TextZone } from '../canva-utils';

export default function RBFeature({ slots, palette, fonts }: LayoutProps) {
  return (
    <CanvaPageRoot bg="/templates/red-white/8.png" fallbackColor={palette.background}>
      <PhotoZone
        src={slots.story2Image1}
        palette={palette}
        top="0"
        left="0"
        width="100%"
        height="44%"
      />

      <TextZone
        top="48%"
        left="4%"
        right="50%"
        style={{
          fontFamily: fonts.heading,
          fontSize: '36px',
          fontWeight: 900,
          color: palette.primary,
          textTransform: 'uppercase',
          lineHeight: 1
        }}
      >
        {slots.story2Headline}
      </TextZone>

      <TextZone
        top="62%"
        left="4%"
        right="50%"
        bottom="6%"
        style={{
          fontFamily: fonts.body,
          fontSize: '12px',
          lineHeight: 1.8,
          color: palette.text,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slots.story2Body}
      </TextZone>

      <PhotoZone
        src={slots.story2Image2}
        palette={palette}
        top="47%"
        left="55%"
        width="43%"
        height="38%"
        required={false}
      />
    </CanvaPageRoot>
  );
}
