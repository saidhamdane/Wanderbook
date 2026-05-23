import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const page = req.nextUrl.searchParams.get('page') || '1';
  const pageNum = parseInt(page, 10);

  if (isNaN(pageNum) || pageNum < 1 || pageNum > 19) {
    return new Response('Page out of range', { status: 404 });
  }

  const imagePath = path.join(
    process.cwd(),
    'public/templates/hanover-pages',
    `page-${pageNum}.png`,
  );

  if (!fs.existsSync(imagePath)) {
    return new Response('Page not found', { status: 404 });
  }

  const buf = fs.readFileSync(imagePath);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  return new Response(new Blob([ab], { type: 'image/png' }), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
