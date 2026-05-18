import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMServices({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: '45%', position: 'relative' }}>
          <Img src={slots.servicesImage} light={palette.light} required />
        </div>
        <div style={{ width: '55%', padding: '110px 56px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '4px',
              color: palette.accent,
              fontWeight: 700
            }}
          >
            SERVICES
          </div>
          <div
            style={{
              marginTop: '14px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '48px',
              color: palette.primary,
              lineHeight: 1.05,
              letterSpacing: '-1px'
            }}
          >
            {slots.servicesTitle}
          </div>
          <div
            style={{
              marginTop: '20px',
              height: '1px',
              backgroundColor: palette.primary,
              width: '60px'
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
            {slots.servicesBody}
          </div>
        </div>
      </div>
    </PageRoot>
  );
}
