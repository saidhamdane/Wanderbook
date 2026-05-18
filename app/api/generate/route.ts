import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFiles } from '@/lib/upload-handler';
import { generateMagazine } from '@/lib/magazine/generate-magazine';
import { saveMagazine } from '@/lib/magazine/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const templateId = String(form.get('templateId') || '');
    const destination = String(form.get('destination') || '');
    const travelers = String(form.get('travelers') || '');
    const style = String(form.get('style') || 'Warm & Personal');
    const notes = form.get('notes') ? String(form.get('notes')) : undefined;
    const useStockFallback = String(form.get('useStockFallback') || 'true') === 'true';

    if (!templateId || !destination) {
      return NextResponse.json(
        { error: 'templateId and destination are required' },
        { status: 400 }
      );
    }

    const fileEntries = form.getAll('photos');
    const photoFiles: File[] = [];
    for (const entry of fileEntries) {
      if (entry instanceof File && entry.size > 0) photoFiles.push(entry);
    }

    const { sessionId, photos } = await saveUploadedFiles(photoFiles);

    const doc = await generateMagazine({
      templateId,
      destination,
      travelers,
      style,
      notes,
      userPhotos: photos,
      useStockFallback,
      sessionId
    });

    await saveMagazine(doc);

    return NextResponse.json(doc);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Generation failed', detail: message }, { status: 500 });
  }
}
