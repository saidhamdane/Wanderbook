import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { TMP_DIR } from '@/lib/upload-handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif'
};

const SESSION_RE = /^[a-zA-Z0-9-]+$/;
const FILENAME_RE = /^[a-zA-Z0-9._-]+$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: { sessionId: string; filename: string } }
) {
  const { sessionId, filename } = params;

  if (!SESSION_RE.test(sessionId) || !FILENAME_RE.test(filename)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const target = path.resolve(path.join(TMP_DIR, sessionId, filename));
  const root = path.resolve(TMP_DIR) + path.sep;
  if (!target.startsWith(root)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!existsSync(target)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const buf = await readFile(target);
  const ext = (filename.split('.').pop() ?? 'jpg').toLowerCase();
  return new NextResponse(buf, {
    headers: {
      'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
