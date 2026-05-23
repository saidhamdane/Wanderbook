import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedFiles } from '@/lib/upload-handler';
import { generateMagazine } from '@/lib/magazine/generate-magazine';
import { saveMagazine } from '@/lib/magazine/store';
import { normalizeLanguage } from '@/lib/magazine/generate-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ct = req.headers.get('content-type') ?? '';
    let templateId = '';
    let destination = '';
    let travelers = '';
    let style = 'Warm & Personal';
    let language = 'en';
    let notes: string | undefined;
    let tagline: string | undefined;
    let familyName: string | undefined;
    let useStockFallback = true;
    let photoFiles: File[] = [];

    if (ct.includes('application/json')) {
      const body = await req.json();
      templateId = String(body.templateId || '');
      destination = String(body.destination || '');
      travelers = String(body.travelers || body.familyName || '');
      style = String(body.style || 'Warm & Personal');
      language = String(body.language || 'en');
      notes = body.notes ? String(body.notes) : undefined;
      tagline = body.tagline ? String(body.tagline) : undefined;
      familyName = body.familyName ? String(body.familyName) : undefined;
      useStockFallback = body.useStockFallback !== false;
    } else {
      const form = await req.formData();
      templateId = String(form.get('templateId') || '');
      destination = String(form.get('destination') || '');
      travelers = String(form.get('travelers') || '');
      style = String(form.get('style') || 'Warm & Personal');
      language = String(form.get('language') || 'en');
      notes = form.get('notes') ? String(form.get('notes')) : undefined;
      tagline = form.get('tagline') ? String(form.get('tagline')) : undefined;
      familyName = form.get('familyName') ? String(form.get('familyName')) : undefined;
      useStockFallback = String(form.get('useStockFallback') || 'true') === 'true';
      const fileEntries = form.getAll('photos');
      for (const entry of fileEntries) {
        if (entry instanceof File && entry.size > 0) photoFiles.push(entry);
      }
    }

    language = normalizeLanguage(language);

    if (!templateId || !destination) {
      return NextResponse.json(
        { error: 'templateId and destination are required' },
        { status: 400 }
      );
    }

    const { sessionId, photos } = await saveUploadedFiles(photoFiles);

    const doc = await generateMagazine({
      templateId,
      destination,
      travelers,
      style,
      language,
      notes,
      tagline,
      familyName,
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
