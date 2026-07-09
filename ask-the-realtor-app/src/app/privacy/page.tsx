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

          <p>Chat Homes AI uses OpenAI's artificial intelligence services to generate responses to questions submitted through the application.</p>

<p>When you ask a question, only the text you enter is securely transmitted to OpenAI solely for the purpose of generating an AI-generated response.</p>

<p>If you choose to request a copy of your answer or personalized guidance, you may voluntarily provide your name, email address, and optional phone number. This contact information is used only to respond to your request and is not required to use the app.</p>

<p>Chat Homes AI does not sell your personal information or use your submitted questions for advertising or profiling.</p>

<p>Please do not submit Social Security numbers, financial account information, medical information, government identification numbers, home addresses, or other confidential personal information.</p>

<p>AI-generated responses are provided for general informational purposes only and should be independently verified.</p>

<p>Contact: contact@chathomesai.com</p>
        </div>
      </div>
    </main>
  );
}
