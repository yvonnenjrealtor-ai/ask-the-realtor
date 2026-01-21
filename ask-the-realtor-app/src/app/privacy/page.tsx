export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Privacy & Disclaimer
          </h1>

          <p className="mt-4 text-slate-700 leading-relaxed">
            Ask the Realtor is designed to help you make smarter real estate decisions with clarity and confidence.
            Your trust matters—so here’s the plain-English version of how we handle information.
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
              <strong>Saved answers</strong> and <strong>recently asked</strong> items are stored{" "}
              <strong>locally in your browser</strong> (on your device). They are not shared with other users.
            </li>
            <li>
              Please avoid entering sensitive personal identifiers (SSN, full account numbers, passwords, etc.).
            </li>
          </ul>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Quick note</div>
            <div className="mt-1 leading-relaxed">
              If you choose to contact Yvonne using the link/QR on the main page, you’ll be interacting with Blinq and
              any linked scheduling tools under their respective policies.
            </div>
          </div>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Disclaimer</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
            <li>
              This tool provides <strong>educational information</strong> and general guidance—<strong>not</strong>{" "}
              legal, financial, or tax advice.
            </li>
            <li>
              For legal questions (attorney review, contracts, disputes), consult a{" "}
              <strong>New Jersey real estate attorney</strong>.
            </li>
            <li>
              For financing decisions (rates, programs, underwriting), consult a <strong>licensed loan officer</strong>.
            </li>
            <li>
              Always verify key details (timelines, fees, HOA rules, lender requirements) with the appropriate
              professional and your written documents.
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/"
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Back to Ask the Realtor
            </a>

            <a
              href="/"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Ask a new question
            </a>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Last updated: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  );
}
