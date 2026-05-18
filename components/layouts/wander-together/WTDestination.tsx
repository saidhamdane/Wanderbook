import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTDestination({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '48%',
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
            DESTINATION
          </div>
          <div
            style={{
              marginTop: '24px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '40px',
              color: palette.primary,
              lineHeight: 1.15
            }}
          >
            {slots.destHeadline}
          </div>
          <div
            style={{
              marginTop: '20px',
              height: '1px',
              width: '40px',
              backgroundColor: palette.accent
            }}
          />
          <div
            style={{
              marginTop: '20px',
              fontFamily: fonts.body,
              fontSize: '13px',
              lineHeight: 1.9,
              color: '#4a4a4a',
              whiteSpace: 'pre-wrap'
            }}
          >
            {slots.destBody}
          </div>
          <div style={{ marginTop: 'auto' }}>
            {slots.destLocation && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  backgroundColor: palette.primary,
                  color: '#FFFFFF',
                  fontSize: '10px',
                  letterSpacing: '3px',
                  fontWeight: 700
                }}
              >
                {slots.destLocation}
              </span>
            )}
          </div>
        </div>
        <div style={{ width: '52%', height: '100%', position: 'relative' }}>
          <Img src={slots.destImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
