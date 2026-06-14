'use client';

import { useState } from 'react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function submitContactForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={submitContactForm} className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Name
          <input
            name="name"
            type="text"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-950 outline-none focus:border-amber-500"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Business name
          <input
            name="businessName"
            type="text"
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-950 outline-none focus:border-amber-500"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Email
        <input
          name="email"
          type="email"
          className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-950 outline-none focus:border-amber-500"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Message
        <textarea
          name="message"
          rows={6}
          className="resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm font-normal text-slate-950 outline-none focus:border-amber-500"
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-full justify-center rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-amber-600 sm:w-auto"
      >
        Send message
      </button>
      {submitted && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800" role="status">
          Thanks. We will contact you at your email soon.
        </p>
      )}
    </form>
  );
}
