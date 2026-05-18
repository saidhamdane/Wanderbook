import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTQuote({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '50%',
            height: '100%',
            backgroundColor: palette.light,
            padding: '80px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontSize: '180px',
              color: palette.accent,
              opacity: 0.3,
              lineHeight: 0.6,
              position: 'absolute',
              top: '90px',
              left: '40px'
            }}
          >
            “
          </div>
          <div
            style={{
              fontFamily: fonts.heading,
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '28px',
              color: palette.primary,
              lineHeight: 1.4,
              position: 'relative',
              zIndex: 1
            }}
          >
            {slots.quoteText}
          </div>
          <div
            style={{
              marginTop: '30px',
              height: '1px',
              width: '60px',
              backgroundColor: palette.accent
            }}
          />
          <div
            style={{
              marginTop: '16px',
              fontFamily: fonts.body,
              fontSize: '12px',
              color: '#666',
              letterSpacing: '1px'
            }}
          >
            {slots.quoteAttribution}
          </div>
          {slots.quoteSignoff && (
            <div
              style={{
                marginTop: '6px',
                fontFamily: fonts.subheading,
                fontStyle: 'italic',
                fontSize: '13px',
                color: palette.accent
              }}
            >
              {slots.quoteSignoff}
            </div>
          )}
          <div
            style={{
              marginTop: '16px',
              fontSize: '22px',
              color: palette.accent
            }}
          >
            ♡
          </div>
        </div>
        <div style={{ width: '50%', height: '100%', position: 'relative' }}>
          <Img src={slots.quoteImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
