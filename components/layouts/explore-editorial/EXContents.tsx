import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXContents({ slots, palette, fonts }: LayoutProps) {
  const sections = [slots.section1, slots.section2, slots.section3, slots.section4, slots.section5];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '90px 60px 30px' }}>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 500,
            fontSize: '72px',
            color: palette.primary,
            letterSpacing: '-1px',
            lineHeight: 1
          }}
        >
          {slots.contentsTitle || 'CONTENTS'}
        </div>
        <div
          style={{
            marginTop: '12px',
            height: '1px',
            width: '60px',
            backgroundColor: palette.accent
          }}
        />
      </div>
      <div
        style={{
          padding: '20px 60px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          rowGap: '18px'
        }}
      >
        {sections.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              borderBottom: '1px solid #E5E0D5',
              paddingBottom: '14px'
            }}
          >
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 600,
                fontSize: '22px',
                color: palette.accent,
                minWidth: '50px'
              }}
            >
              {String((i + 1) * 6 + 2).padStart(2, '0')}
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: fonts.body,
                fontSize: '13px',
                letterSpacing: '2px',
                color: palette.text,
                textTransform: 'uppercase'
              }}
            >
              {s || '—'}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          right: '60px',
          bottom: '60px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          width: '440px',
          height: '140px'
        }}
      >
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.thumbImage1} light={palette.light} />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.thumbImage2} light={palette.light} />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.thumbImage3} light={palette.light} />
        </div>
      </div>
    </PageRoot>
  );
}
