import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXOpener({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ padding: '90px 64px 40px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            color: palette.accent,
            fontWeight: 600
          }}
        >
          OPENING
        </div>
        <div
          style={{
            marginTop: '24px',
            fontFamily: fonts.heading,
            fontWeight: 500,
            fontSize: '56px',
            color: palette.primary,
            lineHeight: 1.05,
            maxWidth: '620px',
            margin: '24px auto 0'
          }}
        >
          {slots.openerHeadline || 'START YOUR TRAVELING TODAY'}
        </div>
        <div
          style={{
            marginTop: '20px',
            height: '1px',
            width: '80px',
            backgroundColor: palette.accent,
            margin: '20px auto 0'
          }}
        />
      </div>
      <div
        style={{
          padding: '0 64px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          height: '700px'
        }}
      >
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.openerImage1} light={palette.light} required />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.openerImage2} light={palette.light} />
        </div>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Img src={slots.openerImage3} light={palette.light} />
        </div>
      </div>
    </PageRoot>
  );
}
