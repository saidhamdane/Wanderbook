'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllTemplates } from '@/lib/magazine/template-registry';
import MagazineMockup3D from '@/components/MagazineMockup3D';

const TEMPLATES_WITH_META = getAllTemplates().map((t) => ({
  ...t,
  tagline: (t as { tagline?: string }).tagline || t.mood,
  pages: (t.pages ?? []).length,
  badge: ({
    'red-bold':          'BESTSELLER',
    'wander-together':   'FAMILY FAV',
    'explore-editorial': 'CINEMATIC',
    'travel-minimal':    'MINIMAL',
    'blue-bold':         'BOLD',
    'green-beige':       'FRESH',
    'hanover':           'NEW',
  } as Record<string, string>)[t.id],
}));

export default function LandingPage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ── Nav ── */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook
        </div>
        <div className="flex items-center gap-3">
          <a href="#templates" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:inline">
            Templates
          </a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:inline">
            Pricing
          </a>
          <Link
            href="/create"
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold"
          >
            Create magazine
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-14 pb-20 max-w-5xl mx-auto text-center">
        <div className="text-xs tracking-[4px] font-semibold text-amber-600">
          AI TRAVEL MAGAZINE BUILDER
        </div>
        <h1
          className="mt-4 text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.05]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your trip. Your story.
          <br />
          <span className="italic text-amber-700">Your magazine.</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Wanderbook turns the photos from your last trip into a printable, editorial-quality
          family travel magazine. AI-written copy, smart photo placement, PDF export.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/create"
            className="px-6 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-300 text-white font-semibold shadow-lg"
          >
            Create your magazine →
          </Link>
          <a
            href="#templates"
            className="px-6 py-4 rounded-full border border-slate-200 text-slate-700 font-semibold"
          >
            See the templates
          </a>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How it works
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Upload photos', d: 'Add 8–15 photos from your trip. We auto-detect orientation and content.' },
              { n: '02', t: 'Pick a template', d: 'Six editorial designs, each with unique spreads tailored for families.' },
              { n: '03', t: 'Download PDF', d: 'AI writes the copy, smart layout places your photos, you download the print-ready PDF.' },
            ].map((s) => (
              <div key={s.n} className="bg-white p-6 rounded-2xl shadow">
                <div className="text-xs tracking-widest text-amber-600 font-semibold">{s.n}</div>
                <div className="mt-2 text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {s.t}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
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
            SIX EDITORIAL TEMPLATES
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 700,
            color: '#fff',
            margin: 0,
          }}>
            Pick your magazine style
          </h2>
          <p style={{
            marginTop: 12,
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9rem',
            maxWidth: 480,
            margin: '12px auto 0',
            fontFamily: 'system-ui',
          }}>
            Each template controls cover layout, typography, colour palette,
            and photo placement across every spread.
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
                onClick={() => router.push(`/create?template=${t.id}`)}
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
                <button
                  onClick={() => router.push(`/create?template=${t.id}`)}
                  style={{
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
                  Use Template →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="bg-slate-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Simple pricing
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-7 rounded-2xl shadow">
              <div className="text-xs tracking-widest text-slate-500 font-semibold">FREE</div>
              <div className="mt-2 text-3xl font-bold">$0</div>
              <p className="mt-2 text-sm text-slate-600">
                One magazine, watermarked PDF, all six templates.
              </p>
              <Link
                href="/create"
                className="mt-5 inline-block px-5 py-3 rounded-full bg-slate-900 text-white text-sm font-semibold"
              >
                Try it free
              </Link>
            </div>
            <div className="bg-slate-900 text-white p-7 rounded-2xl shadow-xl">
              <div className="text-xs tracking-widest text-amber-300 font-semibold">PRO</div>
              <div className="mt-2 text-3xl font-bold">
                $9<span className="text-base font-normal text-slate-300">/month</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Unlimited magazines, no watermark, priority PDF generation.
              </p>
              <button
                disabled
                className="mt-5 inline-block px-5 py-3 rounded-full bg-amber-500 text-white text-sm font-semibold opacity-80 cursor-not-allowed"
              >
                Coming soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 border-t border-slate-200 text-center text-sm text-slate-500">
        <div className="font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook
        </div>
        <div className="mt-1">Your trip, your story, your magazine.</div>
      </footer>
    </main>
  );
}
