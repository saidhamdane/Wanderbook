import { PhotoAnalysis } from './types';
import type { UploadedPhoto } from '@/lib/upload-handler';

function tagsFor(
  name: string,
  orientation: PhotoAnalysis['orientation'],
  isHero: boolean
): string[] {
  const f = name.toLowerCase();
  const tags: string[] = [orientation];
  if (/(food|eat|restaurant|meal|cafe|coffee|dinner|breakfast|lunch)/.test(f)) tags.push('food');
  if (/(group|family|people|us|together|kids|child|portrait)/.test(f)) tags.push('group', 'family');
  if (/(beach|sea|ocean|coast|shore|swim)/.test(f)) tags.push('beach');
  if (/(mountain|hike|trek|peak|cliff|valley)/.test(f)) tags.push('mountain');
  if (/(sunset|sunrise|golden|dusk|dawn)/.test(f)) tags.push('sunset', 'golden-hour');
  if (/(culture|street|local|market|village|town|architecture)/.test(f)) tags.push('culture');
  if (/(road|drive|journey|car|trip)/.test(f)) tags.push('road');
  if (/(aerial|drone|sky|above)/.test(f)) tags.push('aerial');
  if (orientation === 'landscape') tags.push('scenic', 'outdoor');
  if (isHero) tags.push('hero');
  return tags;
}

export function analyzeUploadedPhotos(uploads: UploadedPhoto[]): PhotoAnalysis[] {
  return uploads.map((u, index) => {
    const qualityScore = Math.min((u.width * u.height) / 4_000_000, 1);
    const isHero = index === 0 || (qualityScore > 0.5 && u.orientation === 'portrait');
    return {
      id: 'photo_' + index,
      url: u.url,
      originalName: u.originalName,
      width: u.width,
      height: u.height,
      orientation: u.orientation,
      tags: tagsFor(u.originalName, u.orientation, isHero),
      qualityScore,
      isHero
    };
  });
}
