import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBIntro({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: '50%', padding: '80px 56px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 700
            }}
          >
            INTRODUCTION
          </div>
          <div
            style={{
              marginTop: '20px',
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: '52px',
              color: palette.primary,
              lineHeight: 1.05,
              letterSpacing: '-1px'
            }}
          >
            {slots.introHeading}
          </div>
          <div style={{ marginTop: '32px', display: 'flex', alignItems: 'baseline', gap: '14px' }}>
            {slots.introStat && (
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 900,
                  fontSize: '64px',
                  color: palette.accent,
                  lineHeight: 0.9
                }}
              >
                {slots.introStat}
              </div>
            )}
            {slots.introStatLabel && (
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '3px',
                  fontWeight: 700,
                  color: palette.primary,
                  textTransform: 'uppercase'
                }}
              >
                {slots.introStatLabel}
              </div>
            )}
          </div>
          <div
            style={{
              marginTop: '24px',
              fontFamily: fonts.body,
              fontSize: '13px',
              lineHeight: 1.8,
              color: palette.text,
              whiteSpace: 'pre-wrap'
            }}
          >
            {slots.introBody}
          </div>
        </div>
        <div style={{ width: '50%', position: 'relative' }}>
          <Img src={slots.introImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
