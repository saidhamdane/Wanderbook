import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function isSafeSegment(value: string) {
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

function isSafeFilename(value: string) {
  return /^logo-\d+\.(png|jpg|jpeg|webp)$/i.test(value);
}

export async function GET(_: Request, { params }: { params: { partnerId: string; filename: string } }) {
  const partnerId = params.partnerId || '';
  const filename = params.filename || '';
  if (!isSafeSegment(partnerId) || !isSafeFilename(filename)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const uploadRoot = path.join(process.cwd(), 'public', 'uploads', 'partners');
  const filePath = path.join(uploadRoot, partnerId, filename);
  const resolvedRoot = path.resolve(uploadRoot);
  const resolvedFile = path.resolve(filePath);
  if (!resolvedFile.startsWith(resolvedRoot + path.sep)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const file = await fs.readFile(resolvedFile);
    return new Response(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
