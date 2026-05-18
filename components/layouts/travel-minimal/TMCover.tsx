import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMCover({ slots, palette, fonts }: LayoutProps) {
  const stats = [
    { n: slots.coverStat1Number, l: slots.coverStat1Label, b: slots.coverStat1Body },
    { n: slots.coverStat2Number, l: slots.coverStat2Label, b: slots.coverStat2Body },
    { n: slots.coverStat3Number, l: slots.coverStat3Label, b: slots.coverStat3Body },
    { n: slots.coverStat4Number, l: slots.coverStat4Label, b: slots.coverStat4Body }
  ];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '64px 56px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: '11px', letterSpacing: '3px', color: palette.primary, fontWeight: 600 }}>
          {slots.coverYear || '2026'} · ISSUE 01
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '3px', color: palette.primary, fontWeight: 600 }}>
          WANDERBOOK
        </div>
      </div>
      <div style={{ padding: '0 56px' }}>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: '128px',
            color: palette.primary,
            lineHeight: 0.9,
            letterSpacing: '-4px'
          }}
        >
          {slots.coverTitle || 'TRAVEL'}
        </div>
        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div
            style={{
              fontFamily: fonts.subheading,
              fontWeight: 400,
              fontSize: '28px',
              color: palette.primary
            }}
          >
            {slots.coverLabel || 'Magazine'}
          </div>
          <div style={{ flex: 1, height: '1px', backgroundColor: palette.primary }} />
        </div>
      </div>
      <div style={{ padding: '24px 56px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '14px' }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '36px',
                color: palette.accent,
                lineHeight: 1
              }}
            >
              {s.n}
            </div>
            <div
              style={{
                marginTop: '6px',
                fontSize: '10px',
                letterSpacing: '2px',
                color: palette.primary,
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              {s.l}
            </div>
            <div
              style={{
                marginTop: '4px',
                fontFamily: fonts.body,
                fontSize: '10px',
                lineHeight: 1.4,
                color: '#666'
              }}
            >
              {s.b}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px 56px 0', height: '600px' }}>
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Img src={slots.coverHeroImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
