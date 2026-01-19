export const metadata = {
  title: "Privacy & Disclaimer • Ask the Realtor",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,196,48,0.14),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Privacy first • Plain English
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            Privacy & Disclaimer
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Here’s how Ask the Realtor handles your info, and what this tool is (and isn’t).
          </p>

          <div className="mt-8 space-y-8 text-slate-800">
            <section>
              <h2 className="text-lg font-semibold text-slate-900">Privacy</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                <li>
                  <span className="font-semibold text-slate-900">We do not sell your information.</span>{" "}
                  We do not sell, rent, or trade personal information to third parties.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">We do not share your information for advertising.</span>{" "}
                  We don’t share your data with ad networks.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Saved answers stay on your device.</span>{" "}
                  If you use “Saved answers” or “Recently asked,” that information is stored in your browser (localStorage).
                  It’s not sent anywhere unless you choose to share it.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">What we receive.</span>{" "}
                  When you ask a question, the app sends your question, the area you typed (default: New Jersey), and your
                  selected tone to generate an answer.
                </li>
                <li>
                  <span className="font-semibold text-slate-900">Security basics.</span>{" "}
                  We keep access keys private and do not intentionally log full sensitive data. Still: don’t paste SSNs,
                  full account numbers, or highly sensitive personal information into the question box.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Disclaimer</h2>
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-900">Educational guidance only — not legal or financial advice.</p>
                <p className="mt-2">
                  Ask the Realtor provides general real estate information and practical checklists. It is not a substitute
                  for advice from a licensed attorney, a licensed loan officer, or other professionals.
                </p>
                <p className="mt-2">
                  For legal questions (contracts, disputes, attorney review, tenant/landlord matters), consult a{" "}
                  <span className="font-semibold text-slate-900">licensed attorney</span>. For financing decisions (rates,
                  underwriting, loan programs), consult a{" "}
                  <span className="font-semibold text-slate-900">licensed loan officer</span>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900">Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Want to discuss your specific situation? Use the “Work with Yvonne” section on the home page to book a call
                and reach Yvonne Sanford directly.
              </p>
            </section>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Back to Ask the Realtor
              </a>

              <div className="text-xs text-slate-500">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Ask the Realtor • Built for clarity in real estate decisions.
        </div>
      </div>
    </div>
  );
}
