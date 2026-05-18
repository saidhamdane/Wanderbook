import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBContents({ slots, palette, fonts }: LayoutProps) {
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
      <div style={{ padding: '80px 64px 64px' }}>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: '88px',
            color: palette.primary,
            lineHeight: 0.9,
            letterSpacing: '-2px'
          }}
        >
          {slots.contentsTitle || 'CONTENTS'}
        </div>
        <div
          style={{
            marginTop: '16px',
            height: '4px',
            width: '120px',
            backgroundColor: palette.accent
          }}
        />
      </div>
      <div
        style={{
          padding: '0 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px 48px'
        }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '18px',
              paddingBottom: '20px',
              borderBottom: '2px solid ' + palette.light
            }}
          >
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '44px',
                color: palette.primary,
                lineHeight: 0.9,
                minWidth: '60px'
              }}
            >
              {String((i + 1) * 4).padStart(2, '0')}
            </div>
            <div style={{ flex: 1, paddingTop: '6px' }}>
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontSize: '13px',
                  letterSpacing: '2px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: palette.text,
                  lineHeight: 1.3
                }}
              >
                {it || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
      {slots.contentsImage && (
        <div
          style={{
            position: 'absolute',
            right: '64px',
            bottom: '64px',
            width: '280px',
            height: '180px'
          }}
        >
          <Img src={slots.contentsImage} light={palette.light} />
        </div>
      )}
    </PageRoot>
  );
}
