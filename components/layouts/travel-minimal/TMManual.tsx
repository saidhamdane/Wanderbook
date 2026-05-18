import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMManual({ slots, palette, fonts }: LayoutProps) {
  const checks = [slots.check1, slots.check2, slots.check3, slots.check4];
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
            MANUAL
          </div>
          <div
            style={{
              marginTop: '16px',
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '44px',
              color: palette.primary,
              letterSpacing: '-1px',
              lineHeight: 1.1
            }}
          >
            {slots.manualTitle}
          </div>
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    minWidth: '22px',
                    height: '22px',
                    border: '2px solid ' + palette.accent,
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: palette.accent,
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                >
                  ✓
                </div>
                <div
                  style={{
                    fontFamily: fonts.body,
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: palette.text
                  }}
                >
                  {c}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: '45%', position: 'relative' }}>
          <Img src={slots.manualImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
