import React from 'react';

export const PAGE_W = 794;
export const PAGE_H = 1123;

type Palette = {
  primary: string;
  accent: string;
  background: string;
  text: string;
  light: string;
};

type CanvaPageRootProps = {
  bg: string;
  fallbackColor: string;
  children: React.ReactNode;
};

export function CanvaPageRoot({ bg, fallbackColor, children }: CanvaPageRootProps) {
  return (
    <div
      style={{
        width: PAGE_W + 'px',
        height: PAGE_H + 'px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: fallbackColor
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bg}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      {children}
    </div>
  );
}

type ZonePos = {
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;
  zIndex?: number;
};

export function PhotoZone({
  src,
  palette,
  required = true,
  ...pos
}: ZonePos & { src?: string; palette: Palette; required?: boolean }) {
  if (!src) {
    if (!required) return null;
    return (
      <div
        style={{
          position: 'absolute',
          background:
            'linear-gradient(135deg, ' + palette.primary + ' 0%, ' + palette.accent + ' 100%)',
          opacity: 0.15,
          ...pos
        }}
      />
    );
  }
  return (
    <div style={{ position: 'absolute', overflow: 'hidden', ...pos }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
    </div>
  );
}

export function TextZone({
  children,
  style,
  ...pos
}: ZonePos & { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', ...pos, ...style }}>{children}</div>
  );
}

export function CoverBlock({
  color = '#FFFFFF',
  ...pos
}: ZonePos & { color?: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: color,
        ...pos
      }}
    />
  );
}
