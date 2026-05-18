import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function WTContents({ slots, palette, fonts }: LayoutProps) {
  const items = [
    slots.contentsItem1,
    slots.contentsItem2,
    slots.contentsItem3,
    slots.contentsItem4,
    slots.contentsItem5,
    slots.contentsItem6
  ];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div
          style={{
            width: '50%',
            height: '100%',
            padding: '80px 56px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: palette.background
          }}
        >
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 700,
              fontSize: '36px',
              letterSpacing: '4px',
              color: palette.primary,
              lineHeight: 1
            }}
          >
            {slots.contentsHeading || 'CONTENTS'}
          </div>
          <div
            style={{
              marginTop: '20px',
              height: '1px',
              backgroundColor: palette.accent,
              width: '60px'
            }}
          />
          <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '10px',
                  fontFamily: fonts.body,
                  fontSize: '14px',
                  color: palette.text
                }}
              >
                <span
                  style={{
                    color: palette.accent,
                    fontWeight: 700,
                    letterSpacing: '1px',
                    minWidth: '24px'
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: '1px dotted ' + palette.accent,
                    height: '12px'
                  }}
                />
                <span style={{ letterSpacing: '0.5px' }}>{it || '—'}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 'auto',
              fontSize: '10px',
              letterSpacing: '3px',
              color: palette.accent,
              fontFamily: fonts.body
            }}
          >
            VOLUME 01
          </div>
        </div>
        <div style={{ width: '50%', height: '100%', position: 'relative' }}>
          <Img src={slots.contentsImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
