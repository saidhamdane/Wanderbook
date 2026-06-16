import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const PUBLIC_SITE_URL = 'https://wanderbookcanarias.com';
export const DEFAULT_CONTACT_EMAIL = 'info@wanderbookcanarias.com';

export function getContactEmail(): string {
  return process.env.CONTACT_EMAIL?.trim() || DEFAULT_CONTACT_EMAIL;
}

export function PublicPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <Logo size="md" />
          <div className="flex flex-wrap items-center justify-end gap-3 text-sm font-semibold">
            <Link href="/pricing" className="text-slate-600 hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-950">
              Contact
            </Link>
            <Link href="/partner/login" className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-700">
              Partner login
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-slate-950 px-5 py-14 text-white sm:py-18">
        <div className="mx-auto max-w-4xl">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:py-14">
        {children}
      </div>

      <PublicFooter />
    </main>
  );
}

export function PublicFooter() {
  const contactEmail = getContactEmail();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-5 py-10 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo size="sm" href={false} />
          <p className="mt-1">Digital travel magazines for tourism businesses in the Canary Islands.</p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 font-semibold">
          <Link href="/about" className="hover:text-slate-950">About</Link>
          <Link href="/pricing" className="hover:text-slate-950">Pricing</Link>
          <Link href="/contact" className="hover:text-slate-950">Contact</Link>
          <a href={`mailto:${contactEmail}`} className="hover:text-slate-950">{contactEmail}</a>
          <Link href="/privacy" className="hover:text-slate-950">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-950">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

export function policySection(title: string, body: React.ReactNode) {
  return (
    <section className="border-b border-slate-200 py-6 last:border-b-0">
      <h2 className="text-xl font-bold text-slate-950" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h2>
      <div className="mt-3 text-sm leading-7 text-slate-600">{body}</div>
    </section>
  );
}
