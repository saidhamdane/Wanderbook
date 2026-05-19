import Link from 'next/link';
import { getAllTemplates } from '@/lib/magazine/template-registry';
import { TemplatePreview } from '@/components/TemplatePreview';

export default function LandingPage() {
  const templates = getAllTemplates();
  return (
    <main className="min-h-screen bg-white text-slate-900">
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
              { n: '02', t: 'Pick a template', d: 'Four editorial designs, each with eight unique spreads.' },
              { n: '03', t: 'Download PDF', d: 'AI writes the copy, smart layout places your photos, you download the print-ready PDF.' }
            ].map((s) => (
              <div key={s.n} className="bg-white p-6 rounded-2xl shadow">
                <div className="text-xs tracking-widest text-amber-600 font-semibold">{s.n}</div>
                <div
                  className="mt-2 text-xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {s.t}
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-bold text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Six magazine templates
          </h2>
          <p className="mt-3 text-center text-sm text-slate-600 max-w-xl mx-auto">
            Each template controls cover layout, typography, color, and the way your photos are
            placed across eight editorial spreads.
          </p>
          <div className="mt-10 flex gap-6 justify-center flex-wrap">
            {templates.map((t) => (
              <div key={t.id} className="flex flex-col items-center">
                <TemplatePreview templateId={t.id} size="lg" />
                <div
                  className="mt-3 text-base font-bold"
                  style={{ color: t.palette.primary, fontFamily: t.fonts.heading }}
                >
                  {t.name}
                </div>
                <div
                  className="text-[11px] tracking-[2px] mt-1 font-semibold"
                  style={{ color: t.palette.accent }}
                >
                  {t.mood}
                </div>
                <p className="mt-2 max-w-[240px] text-center text-xs text-slate-500 leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                One magazine, watermarked PDF, all four templates.
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

      <footer className="px-6 py-10 border-t border-slate-200 text-center text-sm text-slate-500">
        <div className="font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook
        </div>
        <div className="mt-1">Your trip, your story, your magazine.</div>
      </footer>
    </main>
  );
}
