import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMIntro({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: '55%', padding: '90px 56px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 700
            }}
          >
            INTRO
          </div>
          <div
            style={{
              marginTop: '14px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '110px',
              color: palette.primary,
              lineHeight: 0.9,
              letterSpacing: '-3px'
            }}
          >
            {slots.introTitle || 'Travel'}
          </div>
          <div
            style={{
              marginTop: '32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }}
          >
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: '12px',
                lineHeight: 1.8,
                color: palette.text,
                whiteSpace: 'pre-wrap'
              }}
            >
              {slots.introBody1}
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontSize: '12px',
                lineHeight: 1.8,
                color: palette.text,
                whiteSpace: 'pre-wrap'
              }}
            >
              {slots.introBody2}
            </div>
          </div>
        </div>
        <div style={{ width: '45%', position: 'relative' }}>
          <Img src={slots.introImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
