// Public origin for share links. Prefers the configured production URL so a
// localhost origin (dev server, SSH tunnel) is never copied into shared links.
export function publicSiteOrigin(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  if (envUrl && !/localhost|127\.0\.0\.1/i.test(envUrl)) return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}
