'use client';

import { MagazineTemplate } from '@/lib/magazine/types';
import { TemplatePreview } from './TemplatePreview';

type Props = {
  template: MagazineTemplate;
  selected: boolean;
  onSelect: () => void;
};

export function TemplateCard({ template, selected, onSelect }: Props) {
  const p = template.palette;
  return (
    <button
      onClick={onSelect}
      className={
        'group flex flex-col sm:flex-row items-center sm:items-stretch gap-5 w-full text-left p-5 rounded-2xl transition-all duration-200 ' +
        (selected
          ? 'border-2 border-amber-500 bg-amber-50 shadow-xl'
          : 'border-2 border-slate-200 bg-white shadow hover:shadow-lg hover:border-slate-300')
      }
    >
      <div className="relative flex-shrink-0">
        <TemplatePreview templateId={template.id} size="md" />
        {template.source === 'canva' && (
          <div className="absolute -top-2 -left-2 px-2 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-widest shadow">
            ✦ CANVA
          </div>
        )}
        {selected && (
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow">
            ✓
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div
          className="text-[11px] tracking-[3px] font-semibold"
          style={{ color: p.accent }}
        >
          {template.mood}
        </div>
        <div
          className="mt-1 text-2xl font-bold leading-tight"
          style={{ color: p.primary, fontFamily: template.fonts.heading }}
        >
          {template.name}
        </div>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          {template.description}
        </p>
        <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
          <div>· 8 polished spreads</div>
          <div>· Editorial typography</div>
          <div>· Smart photo placement</div>
        </div>
        {selected && (
          <div className="mt-3 text-[12px] font-semibold text-amber-700">
            ✓ Selected
          </div>
        )}
      </div>
    </button>
  );
}
