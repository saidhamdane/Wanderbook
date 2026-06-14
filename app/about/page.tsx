import type { Metadata } from 'next';
import Link from 'next/link';
import { PUBLIC_SITE_URL, PublicPageShell } from '../public-page-shell';

export const metadata: Metadata = {
  title: 'About Wanderbook Canarias',
  description: 'Wanderbook Canarias helps Canary Islands tourism businesses turn guest photos into branded digital travel magazines.',
  alternates: {
    canonical: `${PUBLIC_SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About"
      title="About Wanderbook Canarias"
      description="Wanderbook Canarias helps tourism businesses in the Canary Islands turn guest photos into branded digital travel magazines."
    >
      <div className="prose prose-slate max-w-none">
        <p className="text-base leading-8 text-slate-700">
          Clients scan a QR code, upload their own photos, and receive an interactive flipbook magazine of their experience. The business brand appears automatically, so each guest magazine becomes a polished digital memory connected to the partner who hosted the experience.
        </p>
        <p className="mt-5 text-base leading-8 text-slate-700">
          Wanderbook Canarias is useful for tours, photographers, holiday rentals, hotels, boat trips, buggy tours, diving centers and guides across the Canary Islands.
        </p>
      </div>
      <Link
        href="/partner/signup"
        className="mt-8 inline-flex rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600"
      >
        Create partner account
      </Link>
    </PublicPageShell>
  );
}
