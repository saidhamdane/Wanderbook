'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTemplates } from '@/lib/magazine/template-registry';
import { TemplateCard } from '@/components/TemplateCard';
import { UploadZone } from '@/components/UploadZone';
import { LoadingMagazine } from '@/components/LoadingMagazine';

type Step = 'template' | 'photos' | 'details' | 'generating';

const STYLES = ['Warm & Personal', 'Epic & Bold', 'Calm & Minimal', 'Classic Editorial'];

const LANGUAGES: Array<{ code: string; label: string }> = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'es', label: '🇪🇸 Español' },
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'de', label: '🇩🇪 Deutsch' },
  { code: 'it', label: '🇮🇹 Italiano' }
];

export default function CreatePage() {
  const router = useRouter();
  const templates = getAllTemplates();
  const [step, setStep] = useState<Step>('template');
  const [templateId, setTemplateId] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [destination, setDestination] = useState('');
  const [travelers, setTravelers] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [language, setLanguage] = useState('en');
  const [notes, setNotes] = useState('');
  const [useStockFallback, setUseStockFallback] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGenerate() {
    setErrorMessage(null);
    setStep('generating');
    const fd = new FormData();
    fd.append('templateId', templateId);
    fd.append('destination', destination);
    fd.append('travelers', travelers);
    fd.append('style', style);
    fd.append('language', language);
    fd.append('notes', notes);
    fd.append('useStockFallback', String(useStockFallback));
    for (const f of files) fd.append('photos', f, f.name);
    try {
      const res = await fetch('/api/generate', { method: 'POST', body: fd });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Generation failed');
      }
      const doc = await res.json();
      router.push('/preview/' + doc.id);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Generation failed');
      setStep('details');
    }
  }

  const canNextFromTemplate = templateId.length > 0;
  const canNextFromPhotos = files.length >= 1;
  const canGenerate = destination.trim().length > 0 && travelers.trim().length > 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b-4 border-amber-500">
        <a href="/" className="font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
          Wanderbook
        </a>
        <div className="text-xs tracking-widest text-amber-200">CREATE</div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <Stepper step={step} />

        {step === 'template' && (
          <section>
            <Heading
              eyebrow="STEP 1 OF 3"
              title="Choose your magazine style"
              subtitle="Each template controls cover layout, typography, color, and the way photos are placed."
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {templates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={templateId === t.id}
                  onSelect={() => setTemplateId(t.id)}
                />
              ))}
            </div>
            <NavRow>
              <button
                onClick={() => setStep('photos')}
                disabled={!canNextFromTemplate}
                className={primaryBtn(canNextFromTemplate)}
              >
                Upload Photos →
              </button>
            </NavRow>
          </section>
        )}

        {step === 'photos' && (
          <section>
            <Heading
              eyebrow="STEP 2 OF 3"
              title="Upload your trip photos"
              subtitle="JPEG, PNG, WEBP. We will analyse them for orientation and content."
            />
            <div className="mt-6">
              <UploadZone files={files} onChange={setFiles} />
            </div>
            <NavRow>
              <button onClick={() => setStep('template')} className={secondaryBtn}>
                ← Back
              </button>
              <button
                onClick={() => setStep('details')}
                disabled={!canNextFromPhotos}
                className={primaryBtn(canNextFromPhotos)}
              >
                Continue →
              </button>
            </NavRow>
          </section>
        )}

        {step === 'details' && (
          <section>
            <Heading
              eyebrow="STEP 3 OF 3"
              title="Tell us about the trip"
              subtitle="A few details help us write the editorial copy."
            />
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5">
              <Field label="DESTINATION">
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tenerife, Spain"
                  className={inputCls}
                />
              </Field>
              <Field label="TRAVELERS">
                <input
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  placeholder="e.g. Family of 4 with 2 kids aged 5 and 9"
                  className={inputCls}
                />
              </Field>
              <Field label="STYLE">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className={inputCls}
                >
                  {STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="LANGUAGE">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputCls}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="NOTES (OPTIONAL)">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special moments or details to include?"
                  rows={3}
                  className={inputCls}
                />
              </Field>
              <label className="flex items-center gap-3 cursor-pointer text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={useStockFallback}
                  onChange={(e) => setUseStockFallback(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                Use stock photos for missing slots (recommended)
              </label>
              {errorMessage && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                  {errorMessage}
                </div>
              )}
            </div>
            <NavRow>
              <button onClick={() => setStep('photos')} className={secondaryBtn}>
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className={primaryBtn(canGenerate)}
              >
                Generate Magazine →
              </button>
            </NavRow>
          </section>
        )}

        {step === 'generating' && <LoadingMagazine />}
      </div>
    </main>
  );
}

function Heading({
  eyebrow,
  title,
  subtitle
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-xs tracking-[4px] font-semibold text-amber-600">{eyebrow}</div>
      <h1
        className="mt-2 text-3xl sm:text-4xl text-slate-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-slate-500 text-sm max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const labels = ['Template', 'Photos', 'Details'];
  const activeIndex =
    step === 'template' ? 0 : step === 'photos' ? 1 : step === 'details' ? 2 : 3;
  return (
    <div className="flex gap-2 justify-center mb-6">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-col items-center min-w-[80px]">
          <div
            className={
              'h-1 w-full rounded-full ' +
              (i <= activeIndex ? 'bg-amber-500' : 'bg-amber-100')
            }
          />
          <div
            className={
              'mt-1 text-[10px] tracking-widest font-semibold ' +
              (i <= activeIndex ? 'text-slate-900' : 'text-slate-400')
            }
          >
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
      <span className="block text-xs tracking-widest font-semibold text-slate-700 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400';
const secondaryBtn =
  'px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-semibold';

function primaryBtn(enabled: boolean) {
  return (
    'px-6 py-3 rounded-xl text-white font-semibold transition ' +
    (enabled
      ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow hover:shadow-lg'
      : 'bg-slate-300 cursor-not-allowed')
  );
}
