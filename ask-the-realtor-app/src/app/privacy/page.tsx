import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Privacy & Disclaimer
            </h1>

            <Link
              href="/"
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Back
            </Link>
          </div>

          <p className="mt-4 text-slate-700 leading-relaxed">
            Talk to THE Realtor is built to help you make smarter real estate decisions with clarity and confidence.
            Your trust matters.
          </p>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Privacy</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              <strong>We do not sell</strong> your personal information.
            </li>
            <li>
              <strong>We do not share</strong> your personal information for marketing purposes.
            </li>
            <li>
              Saved answers and recently asked items are stored <strong>locally in your browser</strong> (on your device).
            </li>
            <li>
              Please avoid entering sensitive identifiers (SSN, full account numbers, passwords).
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Disclaimer</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>This tool provides <strong>educational information</strong>, not legal or financial advice.</li>
            <li>For legal questions, consult a <strong>New Jersey real estate attorney</strong>.</li>
            <li>For financing decisions, consult a <strong>licensed loan officer</strong>.</li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to Talk to THE Realtor
            </Link>

            <a
              href="mailto:hello@yourdomain.com"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Contact
            </a>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

