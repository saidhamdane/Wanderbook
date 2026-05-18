import { writeFile, mkdir, unlink, readdir, rmdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { detectDimensionsFromBuffer, orientationFromDims } from './image-meta';

export const TMP_DIR = path.join(process.cwd(), 'tmp', 'wanderbook-uploads');

export type UploadedPhoto = {
  url: string;
  originalName: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape' | 'square';
};

function sanitizeExt(name: string): string {
  const ext = (name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  return ext.length > 0 && ext.length <= 5 ? ext : 'jpg';
}

export async function saveUploadedFiles(
  files: File[]
): Promise<{ sessionId: string; photos: UploadedPhoto[] }> {
  const sessionId = randomUUID();
  const sessionDir = path.join(TMP_DIR, sessionId);
  await mkdir(sessionDir, { recursive: true });

  const photos: UploadedPhoto[] = [];
  for (const file of files) {
    const buf = new Uint8Array(await file.arrayBuffer());
    const ext = sanitizeExt(file.name);
    const filename = randomUUID() + '.' + ext;
    const filepath = path.join(sessionDir, filename);
    await writeFile(filepath, buf);

    const { width, height } = detectDimensionsFromBuffer(buf);
    photos.push({
      url: '/api/photos/' + sessionId + '/' + filename,
      originalName: file.name,
      width,
      height,
      orientation: orientationFromDims(width, height)
    });
  }

  return { sessionId, photos };
}

export async function cleanupSession(sessionId: string): Promise<void> {
  if (!/^[a-zA-Z0-9-]+$/.test(sessionId)) return;
  const sessionDir = path.join(TMP_DIR, sessionId);
  if (!existsSync(sessionDir)) return;
  try {
    const files = await readdir(sessionDir);
    await Promise.all(
      files.map((f) =>
        unlink(path.join(sessionDir, f)).catch(() => undefined)
      )
    );
    await rmdir(sessionDir).catch(() => undefined);
  } catch {
    // Best-effort cleanup — ignore if the directory has already been removed.
  }
}
