export function detectDimensionsFromBuffer(buf: Uint8Array): { width: number; height: number } {
  if (
    buf.length > 24 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    const w = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
    const h = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
    if (w > 0 && h > 0) return { width: w, height: h };
  }
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const h = (buf[i + 5] << 8) | buf[i + 6];
        const w = (buf[i + 7] << 8) | buf[i + 8];
        if (w > 0 && h > 0) return { width: w, height: h };
      }
      const segLen = (buf[i + 2] << 8) | buf[i + 3];
      if (segLen <= 0) break;
      i += 2 + segLen;
    }
  }
  return { width: 1200, height: 1500 };
}

export function orientationFromDims(
  w: number,
  h: number
): 'portrait' | 'landscape' | 'square' {
  const ratio = w / h;
  if (ratio > 1.2) return 'landscape';
  if (ratio < 0.85) return 'portrait';
  return 'square';
}
