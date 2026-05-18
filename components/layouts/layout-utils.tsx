import React from 'react';

export const PAGE_W = 794;
export const PAGE_H = 1123;

type ImgProps = {
  src?: string;
  light: string;
  style?: React.CSSProperties;
  required?: boolean;
};

export function Img({ src, light, style, required }: ImgProps) {
  if (src && src.length > 0) {
    return (
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          ...style
        }}
      />
    );
  }
  if (required && typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.warn('Required image missing in slot');
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: light,
        ...style
      }}
    />
  );
}

export function PageRoot({
  background,
  text,
  body,
  children
}: {
  background: string;
  text: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: PAGE_W + 'px',
        height: PAGE_H + 'px',
        backgroundColor: background,
        color: text,
        fontFamily: body,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
}
