import { LayoutProps } from '@/lib/magazine/types';
import { PageRoot, Img } from '../layout-utils';

export default function BBCover({ slots, palette, fonts }: LayoutProps) {
  return (
    <PageRoot background={palette.primary} text="#FFFFFF" body={fonts.body}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <Img src={slots.coverHeroImage} light={palette.light} required />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.4) 100%)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '8px',
          backgroundColor: palette.accent
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '60px',
          right: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          color: '#FFFFFF',
          fontFamily: fonts.body,
          fontSize: '11px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          fontWeight: 600
        }}
      >
        <span>{slots.coverIssueDate || 'ISSUE 01'}</span>
        <span>{slots.coverWebsite || 'WWW.WANDERBOOK.COM'}</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '60px',
          top: '120px',
          width: '380px',
          color: '#FFFFFF'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '4px',
            fontWeight: 700,
            color: palette.accent
          }}
        >
          {slots.coverSeason || 'SUMMER ISSUE'}
        </div>
        <div
          style={{
            marginTop: '12px',
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: '170px',
            lineHeight: 0.85,
            letterSpacing: '-4px',
            color: '#FFFFFF'
          }}
        >
          {slots.coverBigTitle || 'TRAVEL'}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '60px',
          bottom: '60px',
          right: '60px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: '64px',
              lineHeight: 1,
              color: palette.accent
            }}
          >
            {slots.coverStatNumber}
          </div>
          <div
            style={{
              marginTop: '4px',
              fontFamily: fonts.heading,
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '3px',
              textTransform: 'uppercase'
            }}
          >
            {slots.coverStatLabel}
          </div>
        </div>
        <div style={{ maxWidth: '380px', textAlign: 'right' }}>
          <div
            style={{
              fontFamily: fonts.body,
              fontSize: '13px',
              lineHeight: 1.5,
              color: '#FFFFFF'
            }}
          >
            {slots.coverTagline}
          </div>
          {slots.coverAuthor && (
            <div
              style={{
                marginTop: '12px',
                fontSize: '11px',
                letterSpacing: '3px',
                fontWeight: 700,
                color: palette.accent
              }}
            >
              {slots.coverAuthor}
            </div>
          )}
        </div>
      </div>
    </PageRoot>
  );
}
