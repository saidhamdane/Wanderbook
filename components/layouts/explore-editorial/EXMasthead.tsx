import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function EXMasthead({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.background} text={palette.text} body={fonts.body}>
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        <div style={{ width: '50%', position: 'relative' }}>
          <Img src={slots.mastheadPhoto} light={palette.light} required />
        </div>
        <div
          style={{
            width: '50%',
            padding: '120px 60px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              fontSize: '10px',
              letterSpacing: '5px',
              color: palette.accent,
              fontWeight: 600
            }}
          >
            EDITOR&apos;S NOTE
          </div>
          <div
            style={{
              marginTop: '20px',
              fontFamily: fonts.heading,
              fontWeight: 500,
              fontSize: '52px',
              color: palette.primary,
              lineHeight: 1.05,
              letterSpacing: '-1px'
            }}
          >
            {slots.mastheadTitle || 'MASTHEAD'}
          </div>
          <div
            style={{
              marginTop: '24px',
              height: '1px',
              width: '50px',
              backgroundColor: palette.accent
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
            {slots.mastheadBody}
          </div>
        </div>
      </div>
    </PageRoot>
  );
}
