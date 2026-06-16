// Public origin for share links. Prefers the configured production URL so a
// localhost origin (dev server, SSH tunnel) is never copied into shared links.
export function publicSiteOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  if (envUrl && !/localhost|127\.0\.0\.1/i.test(envUrl)) return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

/**
 * Convert a relative public-folder path to an absolute URL.
 * - Already absolute (http/https) → returned as-is.
 * - Starts with "/" → prefixed with NEXT_PUBLIC_APP_URL (or window.location.origin in browser).
 * - Otherwise → returned as-is.
 */
export function resolvePublicAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) {
    const origin =
      (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '') ||
      (typeof window !== 'undefined' ? window.location.origin : '');
    return origin + path;
  }
  return path;
}
