import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBDiscovery({ slots, palette, fonts }: LayoutProps) {
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
            DISCOVERY
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
            {slots.discoveryHeadline}
          </div>
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
            {slots.discoveryBody}
          </div>
          {slots.discoveryQuote && (
            <div
              style={{
                marginTop: 'auto',
                paddingLeft: '20px',
                borderLeft: '4px solid ' + palette.accent,
                fontFamily: fonts.heading,
                fontStyle: 'italic',
                fontWeight: 700,
                fontSize: '22px',
                color: palette.primary,
                lineHeight: 1.3
              }}
            >
              {slots.discoveryQuote}
            </div>
          )}
        </div>
        <div style={{ width: '50%', position: 'relative' }}>
          <Img src={slots.discoveryImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
