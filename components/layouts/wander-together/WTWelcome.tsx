import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTWelcome({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '55%',
            backgroundColor: palette.light,
            padding: '80px 48px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 700
            }}
          >
            CHAPTER ONE
          </div>
          <div
            style={{
              marginTop: '24px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '38px',
              color: palette.primary,
              lineHeight: 1.1
            }}
          >
            {slots.welcomeHeadline1}
          </div>
          {slots.welcomeHeadline2 && (
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '38px',
                color: palette.primary,
                lineHeight: 1.1
              }}
            >
              {slots.welcomeHeadline2}
            </div>
          )}
          {slots.welcomeSubhead && (
            <div
              style={{
                marginTop: '8px',
                fontFamily: fonts.subheading,
                fontStyle: 'italic',
                fontSize: '20px',
                color: palette.accent
              }}
            >
              {slots.welcomeSubhead}
            </div>
          )}
          <div
            style={{
              marginTop: '20px',
              height: '1px',
              width: '60px',
              backgroundColor: palette.accent
            }}
          />
          <div
            style={{
              marginTop: '24px',
              fontFamily: fonts.body,
              fontSize: '14px',
              lineHeight: 1.8,
              color: '#4a4a4a',
              whiteSpace: 'pre-wrap'
            }}
          >
            {slots.welcomeBody}
          </div>
          <div
            style={{
              marginTop: 'auto',
              fontSize: '10px',
              letterSpacing: '3px',
              color: palette.accent
            }}
          >
            01 · WELCOME
          </div>
        </div>
        <div style={{ width: '45%', height: '100%', position: 'relative' }}>
          <Img src={slots.welcomeImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
