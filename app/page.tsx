'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getAllTemplates } from '@/lib/magazine/template-registry';
import MagazineMockup3D from '@/components/MagazineMockup3D';

const TEMPLATES_WITH_META = getAllTemplates().map((t) => ({
  ...t,
  tagline: (t as { tagline?: string }).tagline || t.mood,
  pages: (t.pages ?? []).length,
  badge: ({
    'aurora-editorial':         'NEW',
    'atlas-nocturne-editorial': 'LUXURY',
  } as Record<string, string>)[t.id],
}));

const HOW_IT_WORKS = [
  {
    n: '01',
    t: 'Create your partner account',
    d: 'Add your business name, island, WhatsApp, website and logo.',
  },
  {
    n: '02',
    t: 'Share your QR or client link',
    d: 'Print it, send it after a tour, or place it in your rental or office.',
  },
  {
    n: '03',
    t: 'Clients upload their photos',
    d: 'They create their own magazine. No manual work for you.',
  },
  {
    n: '04',
    t: 'Your brand appears automatically',
    d: 'Every digital magazine and PDF includes your business branding.',
  },
];

const USE_CASES = [
  {
    t: 'Photographers',
    d: 'Turn each photoshoot into a premium branded memory.',
  },
  {
    t: 'Tour Guides',
    d: 'Give guests a shareable magazine after the experience.',
  },
  {
    t: 'Holiday Rentals',
    d: 'Let guests create a branded keepsake from their stay.',
  },
  {
    t: 'Excursion Companies',
    d: 'Turn tours, boat trips and buggy experiences into shareable digital magazines.',
  },
];

const PLANS = [
  {
    tier: 'FREE',
    price: '0€',
    description: 'Start using your business QR with limited client magazines.',
    features: [
      '3 client magazines',
      'Partner QR link',
      'Wanderbook branding',
      'Basic dashboard',
    ],
    cta: 'Start free',
    href: '/partner/signup?plan=free',
    dark: false,
  },
  {
    tier: 'WANDERBOOK AI UNLIMITED',
    price: '95€',
    period: '/mes',
    description: 'Para negocios turísticos que quieren ofrecer revistas ilimitadas a sus clientes.',
    features: [
      'Revistas ilimitadas',
      'Fotos ilimitadas',
      'Exportación PDF incluida',
      'Sin límite mensual mientras la suscripción esté activa',
    ],
    cta: 'Empezar con Unlimited',
    href: '/partner/signup?plan=unlimited',
    dark: true,
    recommended: true,
  },
];

export default function LandingPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 max-w-6xl mx-auto">
        <div className="font-bold text-[18px] sm:text-xl leading-[1.1] max-w-[48vw] sm:max-w-none whitespace-normal sm:whitespace-nowrap" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook Canarias
        </div>
        <div className="flex items-center gap-3">
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 hidden md:inline">
            How it works
          </a>
          <a href="#templates" className="text-sm text-slate-600 hover:text-slate-900 hidden md:inline">
            Templates
          </a>
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-slate-900 hidden md:inline">
            Pricing
          </Link>
          <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900 hidden md:inline">
            Contact
          </Link>
          <Link href="/partner/login" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:inline">
            Partner login
          </Link>
          <Link
            href="/partner/signup"
            className="px-[14px] sm:px-4 py-[10px] sm:py-2 rounded-full bg-slate-900 text-white text-[13px] sm:text-sm font-semibold whitespace-nowrap"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Create partner account</span>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-14 pb-20 max-w-5xl mx-auto text-center">
        <div className="text-xs tracking-[4px] font-semibold text-amber-600 uppercase">
          For Canary Islands tourism businesses
        </div>
        <h1
          className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Give your guests a digital Canary Islands magazine
          <br className="hidden sm:block" />{' '}
          <span className="italic text-amber-700">with your brand.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Create a partner account, get your QR code, and let clients upload their own photos.
          Wanderbook turns their trip into an interactive flipbook magazine branded with your
          business.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/partner/signup"
            className="px-6 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 text-white font-semibold shadow-lg"
          >
            Create partner account →
          </Link>
          <Link
            href="/partner/login"
            className="px-6 py-4 rounded-full border border-slate-200 text-slate-700 font-semibold"
          >
            Partner login
          </Link>
        </div>
        <p className="mt-5 text-sm text-slate-500">
          Guests open an interactive digital flipbook magazine — with a PDF download as an
          optional backup.
        </p>
        <p className="mt-2 text-[11px] text-slate-400">
          Just want one for yourself?{' '}
          <Link href="/create" className="font-normal text-slate-400 hover:text-slate-500">
            Create personal magazine
          </Link>
        </p>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="bg-white p-6 rounded-2xl shadow">
                <div className="text-xs tracking-widest text-amber-600 font-semibold">{s.n}</div>
                <div className="mt-2 text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.t}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            Clients open their digital flipbook magazine instantly — and can download a PDF as an
            optional backup.
          </p>
        </div>
      </section>

      {/* ── 3D Template Showcase ── */}
      <section id="templates" style={{
        background: '#130f08',
        backgroundImage: `
          radial-gradient(ellipse at 15% 50%, #2a1a0a33 0%, transparent 55%),
          radial-gradient(ellipse at 85% 50%, #0a142233 0%, transparent 55%),
          radial-gradient(ellipse at 50% 100%, #1a1208 0%, transparent 60%)
        `,
        paddingTop: 80,
        paddingBottom: 80,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            color: '#C9A84C',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: 12,
            fontFamily: 'system-ui',
          }}>
            AURORA EDITORIAL · ATLAS NOCTURNE
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
          }}>
            Two premium magazine styles
          </h2>
          <p style={{
            marginTop: 12,
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9rem',
            maxWidth: 480,
            margin: '12px auto 0',
            fontFamily: 'system-ui',
          }}>
            Aurora Editorial and Atlas Nocturne are designed for luxury Canary Islands travel
            magazines.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: 48,
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '0 24px 40px',
        }}>
          {TEMPLATES_WITH_META.map((t) => (
            <div
              key={t.id}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <MagazineMockup3D
                template={t}
                isHovered={hoveredId === t.id}
                onClick={() => window.location.assign(`/partner/signup?template=${t.id}`)}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
              />

              {/* Labels below mockup */}
              <div style={{ marginTop: 28 }}>
                <div style={{
                  color: '#C9A84C',
                  fontSize: '0.58rem',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  fontFamily: 'system-ui',
                }}>
                  {t.mood}
                </div>
                <div style={{
                  color: '#fff',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  margin: '5px 0 3px',
                }}>
                  {t.name}
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.7rem',
                  fontFamily: 'system-ui',
                }}>
                  {t.pages} editorial pages
                </div>
                <Link
                  href={`/partner/signup?template=${t.id}`}
                  style={{
                    display: 'inline-block',
                    marginTop: 14,
                    background: hoveredId === t.id ? '#C9A84C' : 'transparent',
                    color: hoveredId === t.id ? '#0a0f1e' : '#C9A84C',
                    border: '1.5px solid #C9A84C',
                    borderRadius: 24,
                    padding: '7px 20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    transition: 'background 0.2s, color 0.2s',
                    fontFamily: 'system-ui',
                  }}
                >
                  Use for my clients →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.45)',
          fontSize: '0.78rem',
          fontFamily: 'system-ui',
          maxWidth: 440,
          margin: '0 auto',
          padding: '0 24px',
        }}>
          Create a partner account and offer this style to your guests through your QR link.
        </p>
      </section>

      {/* ── Partner use cases ── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Built for Canary Islands tourism businesses
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {USE_CASES.map((c) => (
              <div key={c.t} className="bg-slate-50 p-6 rounded-2xl">
                <div className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {c.t}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Simple partner pricing
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {PLANS.map((p) => (
              <div
                key={p.tier}
                className={
                  p.dark
                    ? 'relative bg-slate-900 text-white p-7 rounded-2xl shadow-xl'
                    : 'bg-white p-7 rounded-2xl shadow'
                }
              >
                {p.recommended && (
                  <div className="absolute right-5 top-5 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-950">
                    Recommended
                  </div>
                )}
                <div
                  className={`text-xs tracking-widest font-semibold ${
                    p.dark ? 'text-amber-300' : 'text-slate-500'
                  }`}
                >
                  {p.tier}
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {p.price}
                  {p.period && (
                    <span className={`text-base font-normal ${p.dark ? 'text-slate-300' : 'text-slate-500'}`}>
                      {p.period}
                    </span>
                  )}
                </div>
                <p className={`mt-3 text-sm leading-6 ${p.dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {p.description}
                </p>
                <ul className={`mt-5 space-y-2 text-sm ${p.dark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  href={p.href}
                  className={
                    p.dark
                      ? 'mt-6 inline-block rounded-full bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-amber-200'
                      : 'mt-6 inline-block rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700'
                  }
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 border-t border-slate-200 text-center text-sm text-slate-500">
        <div className="font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook Canarias
        </div>
        <div className="mt-1">
          Digital travel magazines for tourism businesses in the Canary Islands.
        </div>
        <nav className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 font-semibold text-slate-600">
          <Link href="/about" className="hover:text-slate-950">About</Link>
          <Link href="/pricing" className="hover:text-slate-950">Pricing</Link>
          <Link href="/contact" className="hover:text-slate-950">Contact</Link>
          <Link href="/privacy" className="hover:text-slate-950">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-950">Terms</Link>
        </nav>
      </footer>
    </main>
  );
}
