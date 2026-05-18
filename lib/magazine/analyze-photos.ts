import { PhotoAnalysis } from './types';

function tagsFromFilename(filename: string, orientation: PhotoAnalysis['orientation'], isHero: boolean): string[] {
  const f = filename.toLowerCase();
  const tags: string[] = [orientation];
  if (/(food|eat|restaurant|meal|cafe|coffee)/.test(f)) tags.push('food');
  if (/(group|family|people|us|together|kids|child)/.test(f)) tags.push('group', 'family');
  if (/(beach|sea|ocean|coast|shore)/.test(f)) tags.push('beach');
  if (/(mountain|hike|trek|peak|cliff)/.test(f)) tags.push('mountain');
  if (/(sunset|sunrise|golden|dusk)/.test(f)) tags.push('sunset', 'golden-hour');
  if (/(culture|street|local|market|village)/.test(f)) tags.push('culture');
  if (/(road|drive|journey)/.test(f)) tags.push('road');
  if (/(aerial|drone|sky)/.test(f)) tags.push('aerial');
  if (orientation === 'landscape') tags.push('scenic', 'outdoor');
  if (isHero) tags.push('hero');
  return tags;
}

async function detectDimensionsBrowser(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1200, height: 1500 });
    img.src = url;
  });
}

function detectDimensionsFromBuffer(buf: Uint8Array): { width: number; height: number } {
  // PNG: bytes 16..23 hold width and height as big-endian uint32.
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    const w = (buf[16] << 24) | (buf[17] << 16) | (buf[18] << 8) | buf[19];
    const h = (buf[20] << 24) | (buf[21] << 16) | (buf[22] << 8) | buf[23];
    if (w > 0 && h > 0) return { width: w, height: h };
  }
  // JPEG: scan for SOF marker.
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) { i += 1; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const h = (buf[i + 5] << 8) | buf[i + 6];
        const w = (buf[i + 7] << 8) | buf[i + 8];
        if (w > 0 && h > 0) return { width: w, height: h };
      }
      const segLen = (buf[i + 2] << 8) | buf[i + 3];
      i += 2 + segLen;
    }
  }
  return { width: 1200, height: 1500 };
}

function bufferToDataUrl(buf: Uint8Array, mime: string): string {
  if (typeof Buffer !== 'undefined') {
    return 'data:' + mime + ';base64,' + Buffer.from(buf).toString('base64');
  }
  let s = '';
  for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
  return 'data:' + mime + ';base64,' + (typeof btoa !== 'undefined' ? btoa(s) : '');
}

export async function analyzePhotos(files: File[]): Promise<PhotoAnalysis[]> {
  const isBrowser = typeof window !== 'undefined';
  return Promise.all(
    files.map(async (file, index) => {
      let width = 1200;
      let height = 1500;
      let url: string;

      if (isBrowser) {
        url = URL.createObjectURL(file);
        const dim = await detectDimensionsBrowser(url);
        width = dim.width;
        height = dim.height;
      } else {
        const buf = new Uint8Array(await file.arrayBuffer());
        const dim = detectDimensionsFromBuffer(buf);
        width = dim.width;
        height = dim.height;
        const mime = file.type || 'image/jpeg';
        url = bufferToDataUrl(buf, mime);
      }

      const ratio = width / height;
      const orientation: PhotoAnalysis['orientation'] =
        ratio > 1.2 ? 'landscape' : ratio < 0.85 ? 'portrait' : 'square';
      const qualityScore = Math.min((width * height) / 4000000, 1);
      const isHero = qualityScore > 0.5 && orientation === 'portrait';
      const tags = tagsFromFilename(file.name, orientation, isHero);

      return {
        id: 'photo_' + index,
        url,
        file: isBrowser ? file : undefined,
        width,
        height,
        orientation,
        tags,
        qualityScore,
        isHero
      };
    })
  );
}
