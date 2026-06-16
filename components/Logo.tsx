'use client';

import Link from 'next/link';

type LogoVariant = 'light' | 'dark';
type LogoSize = 'sm' | 'md' | 'lg' | 'display';

const SERIF = "'Playfair Display', Georgia, serif";
const SANS = "'Montserrat', system-ui, sans-serif";

type SizeConfig = {
  wordmark: string;
  wordmarkWeight: number;
  wordmarkSpacing: string;
  sub: string;
  subGap: number;
  tracking: string;
  lineW: number;
};

const SIZE_MAP: Record<LogoSize, SizeConfig> = {
  sm: {
    wordmark: '1.05rem',
    wordmarkWeight: 700,
    wordmarkSpacing: '-0.015em',
    sub: '0.48rem',
    subGap: 2,
    tracking: '0.28em',
    lineW: 16,
  },
  md: {
    wordmark: '1.2rem',
    wordmarkWeight: 700,
    wordmarkSpacing: '-0.015em',
    sub: '0.52rem',
    subGap: 3,
    tracking: '0.30em',
    lineW: 20,
  },
  lg: {
    wordmark: '1.4rem',
    wordmarkWeight: 700,
    wordmarkSpacing: '-0.015em',
    sub: '0.58rem',
    subGap: 3,
    tracking: '0.32em',
    lineW: 24,
  },
  display: {
    wordmark: 'clamp(2rem, 6vw, 3rem)',
    wordmarkWeight: 800,
    wordmarkSpacing: '-0.025em',
    sub: '0.62rem',
    subGap: 8,
    tracking: '0.38em',
    lineW: 28,
  },
};

const COLOR_MAP: Record<LogoVariant, { wordmark: string; sub: string }> = {
  light: { wordmark: '#0B2545', sub: '#C9A84C' },
  dark:  { wordmark: '#ffffff', sub: '#C9A84C' },
};

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  /** Pass false to render without a link wrapper */
  href?: string | false;
  /** Show decorative flanking rules around CANARIAS — use for hero/display contexts */
  withDivider?: boolean;
}

export function Logo({
  variant = 'light',
  size = 'md',
  href = '/',
  withDivider = false,
}: LogoProps) {
  const s = SIZE_MAP[size];
  const c = COLOR_MAP[variant];

  const subLabel = (
    <span
      style={{
        fontFamily: SANS,
        fontSize: s.sub,
        fontWeight: 700,
        color: c.sub,
        letterSpacing: s.tracking,
        textTransform: 'uppercase',
        lineHeight: 1,
      }}
    >
      Canarias
    </span>
  );

  const sub = withDivider ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: s.lineW, height: 1, background: c.sub, flexShrink: 0 }} />
      {subLabel}
      <div style={{ width: s.lineW, height: 1, background: c.sub, flexShrink: 0 }} />
    </div>
  ) : subLabel;

  const mark = (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: withDivider ? 'center' : 'flex-start',
        lineHeight: 1,
        gap: s.subGap,
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontSize: s.wordmark,
          fontWeight: s.wordmarkWeight,
          color: c.wordmark,
          letterSpacing: s.wordmarkSpacing,
          lineHeight: 1,
        }}
      >
        Wanderbook
      </span>
      {sub}
    </span>
  );

  if (href === false) return mark;

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'inline-flex' }}>
      {mark}
    </Link>
  );
}
