import { NextRequest, NextResponse } from 'next/server';
import { fetchPexelsPhotos } from '@/lib/magazine/pexels';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination') || '';
  const count = parseInt(searchParams.get('count') || '12', 10);
  const orientation = searchParams.get('orientation') as 'landscape' | 'portrait' | 'square' | null;

  if (!destination) {
    return NextResponse.json({ error: 'destination is required' }, { status: 400 });
  }

  const photos = await fetchPexelsPhotos(
    destination,
    Math.min(Math.max(count, 1), 30),
    orientation || undefined
  );
  return NextResponse.json({ photos });
}
