import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBStory({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '80px 64px 32px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: palette.accent,
            fontWeight: 700
          }}
        >
          STORY
        </div>
        <div
          style={{
            marginTop: '16px',
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: '56px',
            color: palette.primary,
            lineHeight: 1.05,
            letterSpacing: '-1px',
            maxWidth: '640px'
          }}
        >
          {slots.storyHeadline}
        </div>
      </div>
      <div style={{ position: 'relative', height: '620px', margin: '0 64px' }}>
        <Img src={slots.storyImage} light={palette.light} required />
      </div>
      <div style={{ padding: '20px 64px 0' }}>
        <div
          style={{
            fontFamily: fonts.body,
            fontSize: '11px',
            letterSpacing: '2px',
            color: palette.primary,
            fontWeight: 600,
            textTransform: 'uppercase'
          }}
        >
          {slots.storyCaption}
        </div>
      </div>
    </PageRoot>
  );
}
