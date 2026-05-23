'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTemplates } from '@/lib/magazine/template-registry';
import { OpenMagazineMockup } from '@/components/OpenMagazineMockup';
import { UploadZone } from '@/components/UploadZone';
import { CoverPreview } from './CoverPreview';
import { CinematicOverlay } from './CinematicOverlay';
import { FilmStrip } from './FilmStrip';

type Step = 'template' | 'photos' | 'details';

const STYLES = ['Warm & Personal', 'Epic & Bold', 'Calm & Minimal', 'Classic Editorial'];
const LANGUAGES: Array<{ code: string; label: string }> = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'it', label: '🇮🇹 Italiano' },
];

export default function CreatePage() {
  const router   = useRouter();
  const templates = getAllTemplates();

  const [step, setStep]         = useState<Step>('template');
  const [templateId, setTplId]  = useState('');
  const [files, setFiles]       = useState<File[]>([]);
  const [destination, setDest]  = useState('');
  const [travelers, setTrav]    = useState('');
  const [style, setStyle]       = useState(STYLES[0]);
  const [language, setLang]     = useState('en');
  const [notes, setNotes]       = useState('');
  const [useStock, setUseStock] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cinematic generation
  const [showCinematic, setShowCinematic] = useState(false);
  const [magId, setMagId]                = useState<string | null>(null);

  const selectedTemplate = templates.find((t) => t.id === templateId);

  async function handleGenerate() {
    setErrorMsg(null);
    setMagId(null);
    setShowCinematic(true);          // show overlay immediately

    const fd = new FormData();
    fd.append('templateId', templateId);
    fd.append('destination', destination);
    fd.append('travelers', travelers);
    fd.append('style', style);
    fd.append('language', language);
    fd.append('notes', notes);
    fd.append('useStockFallback', String(useStock));
    for (const f of files) fd.append('photos', f, f.name);

    try {
      const res = await fetch('/api/generate', { method: 'POST', body: fd });
      if (!res.ok) throw new Error((await res.text()) || 'Generation failed');
      const doc = await res.json();
      setMagId(doc.id);              // signals overlay: confetti + redirect
    } catch (err) {
      setShowCinematic(false);
      setErrorMsg(err instanceof Error ? err.message : 'Generation failed');
    }
  }

  const handleReady = useCallback((id: string) => {
    router.push('/preview/' + id);
  }, [router]);

  const canNextTemplate = templateId.length > 0;
  const canNextPhotos   = files.length >= 1;
  const canGenerate     = destination.trim().length > 0;

  return (
    <>
      {showCinematic && <CinematicOverlay magId={magId} onReady={handleReady} />}

      <main className="min-h-screen bg-slate-50">
        <header className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b-4 border-amber-500">
          <a href="/" className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Wanderbook
          </a>
          <div className="text-xs tracking-widest text-amber-200">CREATE</div>
        </header>

        <div className="max-w-5xl mx-auto px-5 py-8">
          <Stepper step={step} />

          {/* ── STEP 1 ── */}
          {step === 'template' && (
            <section>
              <Heading eyebrow="STEP 1 OF 3" title="Choose your magazine style"
                subtitle="Pick a template — scroll to see all six. Each controls cover, typography, and photo placement." />

              {/* Physical magazine mockup picker */}
              <div style={{ margin: '24px -20px 0', borderRadius: 12, overflow: 'hidden' }}>
                <div
                  className="template-scroll"
                  style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    padding: '40px 24px 32px',
                    background: '#130f08',
                    backgroundImage: `
                      radial-gradient(ellipse at 20% 60%, #2a1a0a22 0%, transparent 55%),
                      radial-gradient(ellipse at 80% 40%, #0a142233 0%, transparent 55%)
                    `,
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  <style>{`.template-scroll::-webkit-scrollbar{display:none}`}</style>
                  {templates.map((t) => (
                    <OpenMagazineMockup
                      key={t.id}
                      template={t}
                      selected={templateId === t.id}
                      onSelect={() => setTplId(t.id)}
                    />
                  ))}
                </div>
              </div>

              {templateId && (
                <p className="mt-3 text-center text-xs text-amber-600 font-semibold tracking-widest">
                  {templates.find(t => t.id === templateId)?.name?.toUpperCase()} SELECTED
                </p>
              )}

              <NavRow>
                <button onClick={() => setStep('photos')} disabled={!canNextTemplate}
                  className={primaryBtn(canNextTemplate)}>Upload Photos →</button>
              </NavRow>
            </section>
          )}

          {/* ── STEP 2 ── */}
          {step === 'photos' && (
            <section>
              <Heading eyebrow="STEP 2 OF 3" title="Upload your trip photos"
                subtitle="JPEG, PNG, WEBP. We analyse them for orientation and content." />
              <div className="mt-6">
                <UploadZone files={files} onChange={setFiles} />
                <FilmStrip files={files} />
              </div>
              <NavRow>
                <button onClick={() => setStep('template')} className={secondaryBtn}>← Back</button>
                <button onClick={() => setStep('details')} disabled={!canNextPhotos}
                  className={primaryBtn(canNextPhotos)}>Continue →</button>
              </NavRow>
            </section>
          )}

          {/* ── STEP 3 ── */}
          {step === 'details' && (
            <section>
              <Heading eyebrow="STEP 3 OF 3" title="Tell us about the trip"
                subtitle="A few details help us write the editorial copy." />

              <div className="mt-6 flex flex-col lg:flex-row gap-8 items-start">
                {/* Form */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5">
                  <Field label="DESTINATION">
                    <input value={destination} onChange={(e) => setDest(e.target.value)}
                      placeholder="e.g. Fuerteventura, Spain" className={inputCls} autoFocus />
                  </Field>
                  <Field label="TRAVELERS / FAMILY NAME">
                    <input value={travelers} onChange={(e) => setTrav(e.target.value)}
                      placeholder="e.g. The Said Family · 4 people" className={inputCls} />
                  </Field>
                  <Field label="STYLE">
                    <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputCls}>
                      {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="LANGUAGE">
                    <select value={language} onChange={(e) => setLang(e.target.value)} className={inputCls}>
                      {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                    </select>
                  </Field>
                  <Field label="NOTES (OPTIONAL)">
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special moments or details to include?"
                      rows={2} className={inputCls} />
                  </Field>
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                    <input type="checkbox" checked={useStock} onChange={(e) => setUseStock(e.target.checked)}
                      className="w-4 h-4 accent-amber-500" />
                    Use stock photos for missing slots (recommended)
                  </label>
                  {errorMsg && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                      {errorMsg}
                    </div>
                  )}
                </div>

                {/* ── Live cover preview ── */}
                <div className="flex-shrink-0 flex justify-center lg:justify-start pt-2">
                  <CoverPreview
                    destination={destination}
                    travelers={travelers}
                    palette={selectedTemplate?.palette ?? {
                      primary: '#0f172a', accent: '#f59e0b',
                      background: '#fff', text: '#1a1a1a',
                    }}
                    photoFile={files[0] ?? null}
                  />
                </div>
              </div>

              <NavRow>
                <button onClick={() => setStep('photos')} className={secondaryBtn}>← Back</button>
                <button onClick={handleGenerate} disabled={!canGenerate}
                  className={primaryBtn(canGenerate)}>Generate Magazine →</button>
              </NavRow>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center">
      <div className="text-xs tracking-[4px] font-semibold text-amber-600">{eyebrow}</div>
      <h1 className="mt-2 text-3xl sm:text-4xl text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-slate-500 text-sm max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const labels = ['Template', 'Photos', 'Details'];
  const activeIndex = step === 'template' ? 0 : step === 'photos' ? 1 : 2;
  return (
    <div className="flex gap-2 justify-center mb-6">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-col items-center min-w-[80px]">
          <div className={'h-1 w-full rounded-full ' + (i <= activeIndex ? 'bg-amber-500' : 'bg-amber-100')} />
          <div className={'mt-1 text-[10px] tracking-widest font-semibold ' + (i <= activeIndex ? 'text-slate-900' : 'text-slate-400')}>
            {l.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
}

function NavRow({ children }: { children: React.ReactNode }) {
  return <div className="mt-8 flex justify-end gap-3 flex-wrap">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs tracking-widest font-semibold text-slate-700 mb-2">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400';
const secondaryBtn = 'px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold';
function primaryBtn(enabled: boolean) {
  return 'px-6 py-3 rounded-xl text-white font-semibold transition ' +
    (enabled ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow hover:shadow-lg' : 'bg-slate-300 cursor-not-allowed');
}
