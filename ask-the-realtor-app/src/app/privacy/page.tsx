import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Privacy, Terms & Disclaimer — Talk to THE Realtor™
          </h1>

          <p className="mt-4 text-slate-700 leading-relaxed">
            Talk to THE Realtor™ respects your privacy and is designed to provide educational real estate guidance.
          </p>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Privacy Policy</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              We collect minimal data necessary to operate the app (for example: anonymous analytics, reliability logs,
              and information you voluntarily submit).
            </li>
            <li>
              Please do not submit sensitive personal information (SSN, account numbers, passwords, or government IDs).
            </li>
            <li>
              Third-party services used to run the app (hosting, analytics, AI services) may process limited technical data
              solely to operate the application.
            </li>
            <li>
              We do not sell your personal information.
            </li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Terms of Use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>This app provides general educational information only.</li>
            <li>Use of this app does not create a realtor-client, attorney-client, or fiduciary relationship.</li>
            <li>You agree not to scrape, copy, or attempt to reverse-engineer the application.</li>
            <li>You are responsible for decisions you make based on the information provided.</li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Disclaimer</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>This tool is not legal or financial advice.</li>
            <li>For legal matters, consult a licensed attorney.</li>
            <li>For financing decisions, consult a licensed mortgage professional.</li>
            <li>For real estate transactions, consult a licensed real estate professional.</li>
          </ul>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Intellectual Property & Trademark</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            <strong>Talk to THE Realtor™</strong> is a trademark of Yvonne Sanford. All branding, design, and software
            associated with this application are protected by intellectual property laws. Unauthorized use, duplication,
            or imitation is prohibited.
          </p>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Governing Law</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            This application is governed by the laws of the State of New Jersey, United States.
          </p>

          <div className="mt-10 flex gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to Talk to THE Realtor™
            </Link>

            <a
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              href="mailto:yvonne.njrealtor@gmail.com"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
