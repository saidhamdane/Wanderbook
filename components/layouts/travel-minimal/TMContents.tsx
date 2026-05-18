import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function TMContents({ slots, palette, fonts }: LayoutProps) {
  const items = [slots.item1, slots.item2, slots.item3, slots.item4, slots.item5, slots.item6];
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '80px 56px 30px' }}>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 700,
            fontSize: '64px',
            color: palette.primary,
            lineHeight: 1,
            letterSpacing: '-1px'
          }}
        >
          {slots.contentsTitle || 'Content'}
        </div>
        <div style={{ marginTop: '16px', height: '1px', backgroundColor: palette.primary }} />
      </div>
      <div style={{ padding: '0 56px', display: 'flex', flexDirection: 'column' }}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '18px 0',
              borderBottom: '1px solid ' + palette.light
            }}
          >
            <div
              style={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '22px',
                color: palette.accent,
                minWidth: '50px'
              }}
            >
              {String((i + 1) * 4).padStart(2, '0')}
            </div>
            <div
              style={{
                flex: 1,
                fontFamily: fonts.body,
                fontSize: '14px',
                letterSpacing: '1.5px',
                color: palette.text,
                textTransform: 'uppercase'
              }}
            >
              {it || '—'}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px 56px 56px' }}>
        <div style={{ width: '100%', height: '260px', position: 'relative' }}>
          <Img src={slots.contentsImage} light={palette.light} required />
        </div>
      </div>
    </PageRoot>
  );
}
