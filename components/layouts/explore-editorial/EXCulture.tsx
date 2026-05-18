import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXCulture({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '64px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid #ECE5D8'
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: '14px',
              letterSpacing: '6px',
              color: palette.accent,
              fontWeight: 600,
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap'
            }}
          >
            {slots.cultureVerticalTitle || 'CULTURE'}
          </div>
        </div>
        <div style={{ flex: 1, padding: '80px 60px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 500,
              fontSize: '52px',
              color: palette.primary,
              lineHeight: 1.05,
              letterSpacing: '-1px'
            }}
          >
            Beauty in details
          </div>
          <div
            style={{
              marginTop: '22px',
              height: '1px',
              width: '50px',
              backgroundColor: palette.accent
            }}
          />
          <div
            style={{
              marginTop: '22px',
              fontFamily: fonts.body,
              fontSize: '13px',
              lineHeight: 1.9,
              color: palette.text,
              whiteSpace: 'pre-wrap',
              maxWidth: '420px'
            }}
          >
            {slots.cultureBody}
          </div>
        </div>
        <div style={{ width: '40%', position: 'relative' }}>
          <Img src={slots.cultureImage} light={palette.light} required />
          {slots.cultureCaption && (
            <div
              style={{
                position: 'absolute',
                left: '14px',
                right: '14px',
                bottom: '14px',
                color: '#FFFFFF',
                fontFamily: fonts.body,
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textShadow: '0 1px 8px rgba(0,0,0,0.6)'
              }}
            >
              {slots.cultureCaption}
            </div>
          )}
        </div>
      </div>
    </PageRoot>
  );
}
