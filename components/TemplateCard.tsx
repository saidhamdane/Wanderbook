'use client';

import { MagazineTemplate } from '@/lib/magazine/types';

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
        'group flex w-full text-left bg-white rounded-2xl overflow-hidden transition-all duration-200 ' +
        (selected
          ? 'ring-4 ring-amber-500 shadow-2xl scale-[1.01]'
          : 'shadow-lg hover:shadow-xl hover:scale-[1.005]')
      }
    >
      <div
        className="relative flex-shrink-0 w-2/5 flex items-end p-6"
        style={{ backgroundColor: p.primary }}
      >
        <div className="text-white">
          <div
            className="text-xs tracking-[3px] font-semibold mb-2"
            style={{ color: p.accent }}
          >
            {template.mood}
          </div>
          <div
            className="text-2xl font-bold leading-tight"
            style={{ fontFamily: template.fonts.heading }}
          >
            {template.name}
          </div>
          <div className="mt-4 flex gap-1">
            <span className="w-6 h-6 rounded-full ring-2 ring-white/30" style={{ backgroundColor: p.background }} />
            <span className="w-6 h-6 rounded-full ring-2 ring-white/30" style={{ backgroundColor: p.accent }} />
            <span className="w-6 h-6 rounded-full ring-2 ring-white/30" style={{ backgroundColor: p.light }} />
          </div>
        </div>
        {selected && (
          <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
            ✓
          </div>
        )}
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between bg-white">
        <div>
          <div
            className="text-xl font-bold mb-2"
            style={{ color: p.primary, fontFamily: template.fonts.heading }}
          >
            {template.name}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{template.description}</p>
        </div>
        <div className="mt-4 flex flex-col gap-1 text-xs text-slate-500">
          <div>· 8 polished spreads</div>
          <div>· Editorial typography</div>
          <div>· Smart photo placement</div>
        </div>
      </div>
    </button>
  );
}
