'use client';

import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-800 md:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur md:p-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Go back to the previous screen"
        >
          ← Back
        </button>

        <div className="space-y-3 text-slate-700">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">Privacy Policy</h1>
          <p className="text-sm text-slate-600">Effective Date: April 25, 2026</p>

          <p>Chat Homes AI respects your privacy.</p>
          <p>We may collect information you voluntarily provide, including your name, email, phone number, and messages submitted through the app.</p>
          <p>We use information to respond to inquiries, improve services, and provide requested support.</p>
          <p>We do not sell your personal information.</p>
          <p>Some responses may be AI-generated and should be independently verified.</p>
          <p>Contact: contact@chathomesai.com</p>
        </div>
      </div>
    </main>
  );
}
