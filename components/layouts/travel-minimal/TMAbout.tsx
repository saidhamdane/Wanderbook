import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMAbout({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '80px 56px 24px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: palette.accent,
            fontWeight: 700
          }}
        >
          ABOUT
        </div>
        <div
          style={{
            marginTop: '14px',
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '52px',
            color: palette.primary,
            letterSpacing: '-1px',
            lineHeight: 1
          }}
        >
          {slots.aboutTitle}
        </div>
        <div
          style={{
            marginTop: '20px',
            fontFamily: fonts.body,
            fontSize: '13px',
            lineHeight: 1.8,
            color: palette.text,
            maxWidth: '640px',
            whiteSpace: 'pre-wrap'
          }}
        >
          {slots.aboutBody}
        </div>
      </div>
      <div
        style={{
          padding: '40px 56px 56px',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '14px',
          height: '600px'
        }}
      >
        <div style={{ gridRow: '1 / 3', position: 'relative' }}>
          <Img src={slots.aboutImage1} light={palette.light} />
        </div>
        <div style={{ position: 'relative' }}>
          <Img src={slots.aboutImage2} light={palette.light} />
        </div>
        <div style={{ position: 'relative' }}>
          <Img src={slots.aboutImage3} light={palette.light} />
        </div>
      </div>
    </PageRoot>
  );
}
