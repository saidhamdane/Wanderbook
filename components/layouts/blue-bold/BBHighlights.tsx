import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBHighlights({ slots, palette, fonts }: LayoutProps) {
  const cards = [
    { img: slots.hl1Image, title: slots.hl1Title, body: slots.hl1Body },
    { img: slots.hl2Image, title: slots.hl2Title, body: slots.hl2Body },
    { img: slots.hl3Image, title: slots.hl3Title, body: slots.hl3Body }
  ];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '64px 64px 24px' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: palette.accent,
            fontWeight: 700
          }}
        >
          HIGHLIGHTS
        </div>
        <div
          style={{
            marginTop: '14px',
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: '48px',
            color: palette.primary,
            letterSpacing: '-1px'
          }}
        >
          THE STANDOUTS
        </div>
      </div>
      <div
        style={{
          padding: '0 64px 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px'
        }}
      >
        {cards.map((c, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
              <Img src={c.img} light={palette.light} />
            </div>
            <div
              style={{
                marginTop: '14px',
                fontFamily: fonts.heading,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '2px',
                color: palette.primary,
                textTransform: 'uppercase'
              }}
            >
              0{i + 1} · {c.title}
            </div>
            <div
              style={{
                marginTop: '8px',
                fontFamily: fonts.body,
                fontSize: '12px',
                lineHeight: 1.6,
                color: palette.text
              }}
            >
              {c.body}
            </div>
          </div>
        ))}
      </div>
    </PageRoot>
  );
}
