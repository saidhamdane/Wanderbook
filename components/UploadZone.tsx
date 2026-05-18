'use client';

import { useRef } from 'react';

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
};

const MAX_FILES = 20;
const ACCEPT = 'image/jpeg,image/png,image/webp';

export function UploadZone({ files, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(e.target.files || []);
    const merged = [...files, ...incoming].slice(0, MAX_FILES);
    onChange(merged);
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeAt(i: number) {
    onChange(files.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label
        htmlFor="wb-upload"
        className="block bg-white rounded-2xl border-2 border-dashed border-amber-400 p-10 text-center cursor-pointer hover:bg-amber-50 transition-colors"
      >
        <div className="text-4xl mb-2">📸</div>
        <div className="text-lg font-semibold text-slate-900">Tap to upload photos</div>
        <div className="text-sm text-slate-500 mt-2">
          {files.length} / {MAX_FILES} selected · we recommend 8–15 photos
        </div>
        <div className="text-xs text-slate-400 mt-1">JPEG, PNG, WEBP</div>
        <input
          id="wb-upload"
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {files.map((f, i) => {
            const url = URL.createObjectURL(f);
            return (
              <div
                key={f.name + i}
                className="relative aspect-square rounded-lg overflow-hidden shadow"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-sm leading-none"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
