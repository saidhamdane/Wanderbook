import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBAbout({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '50%',
            position: 'relative',
            backgroundColor: palette.light
          }}
        >
          <Img src={slots.aboutImage} light={palette.light} />
        </div>
        <div style={{ width: '50%', padding: '90px 56px' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 700
            }}
          >
            ABOUT OUR TRIPS
          </div>
          <div
            style={{
              marginTop: '20px',
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: '44px',
              color: palette.primary,
              lineHeight: 1.05
            }}
          >
            {slots.aboutHeading}
          </div>
          <div
            style={{
              marginTop: '24px',
              height: '4px',
              width: '80px',
              backgroundColor: palette.accent
            }}
          />
          <div
            style={{
              marginTop: '24px',
              fontFamily: fonts.body,
              fontSize: '13px',
              lineHeight: 1.85,
              color: palette.text,
              whiteSpace: 'pre-wrap'
            }}
          >
            {slots.aboutBody}
          </div>
        </div>
      </div>
    </PageRoot>
  );
}
