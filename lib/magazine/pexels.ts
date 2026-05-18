import { StockPhoto } from './types';

const PEXELS_ENDPOINT = 'https://api.pexels.com/v1/search';

export async function fetchPexelsPhotos(
  query: string,
  count: number,
  orientation?: 'landscape' | 'portrait' | 'square'
): Promise<StockPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return [];
  }
  try {
    const params = new URLSearchParams({
      query,
      per_page: String(Math.min(count, 80))
    });
    if (orientation) params.append('orientation', orientation);
    const res = await fetch(PEXELS_ENDPOINT + '?' + params.toString(), {
      headers: { Authorization: apiKey },
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.photos)) return [];
    return data.photos.map((p: any) => {
      const w = p.width || 1200;
      const h = p.height || 1600;
      const ratio = w / h;
      const ori: StockPhoto['orientation'] =
        ratio > 1.2 ? 'landscape' : ratio < 0.85 ? 'portrait' : 'square';
      return {
        id: 'pexels_' + p.id,
        url: (p.src && (p.src.large2x || p.src.large || p.src.original)) || '',
        photographer: p.photographer || 'Pexels',
        orientation: ori
      };
    }).filter((p: StockPhoto) => p.url.length > 0);
  } catch {
    return [];
  }
}
