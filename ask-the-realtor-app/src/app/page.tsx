"use client";

import { useEffect, useMemo, useState } from "react";

type Tone = "Professional (Savvy)" | "Plain English" | "Investor Lens";

type SavedItem = {
  id: string;
  question: string;
  location: string;
  tone: Tone;
  answer: string;
  savedAt: number;
};

type RecentItem = {
  id: string;
  question: string;
  location: string;
  tone: Tone;
  askedAt: number;
};

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function splitSections(text: string) {
  // Expects headings from your backend:
  // Quick Answer
  // What to Watch Out For
  // Smart Next Steps
  const safe = (text || "").trim();
  const lower = safe.toLowerCase();

  const qaIdx = lower.indexOf("quick answer");
  const woIdx = lower.indexOf("what to watch out for");
  const nsIdx = lower.indexOf("smart next steps");

  // Fallback: if headings are missing, keep it all in one block.
  if (qaIdx === -1 || woIdx === -1 || nsIdx === -1) {
    return {
      quick: safe,
      watch: "",
      next: "",
      hasStructured: false,
    };
  }

  const quick = safe.slice(qaIdx, woIdx).replace(/^quick answer\s*/i, "").trim();
  const watch = safe.slice(woIdx, nsIdx).replace(/^what to watch out for\s*/i, "").trim();
  const next = safe.slice(nsIdx).replace(/^smart next steps\s*/i, "").trim();

  return { quick, watch, next, hasStructured: true };
}

function BulletBlock({ text }: { text: string }) {
  // If the model returns bullets, show as pre-wrapped prose.
  // (Keeping it simple + reliable—no fragile markdown parsing.)
  return (
    <div className="whitespace-pre-wrap leading-relaxed text-slate-800">
      {text}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  text,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
        </div>
      </div>
      <div className="mt-4 text-sm">
        <BulletBlock text={text} />
      </div>
    </div>
  );
}

function IconBolt() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconSteps() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h10M4 12h7M4 17h13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Page() {
  const [question, setQuestion] = useState("");
  const [location, setLocation] = useState("New Jersey");
  const [tone, setTone] = useState<Tone>("Professional (Savvy)");

  const [loading, setLoading] = useState(false);
  const [rawAnswer, setRawAnswer] = useState("");
  const [error, setError] = useState("");

  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);

  const canAsk = useMemo(() => question.trim().length >= 10 && !loading, [question, loading]);

  useEffect(() => {
    // Load from localStorage
    try {
      const s = localStorage.getItem("atr_saved");
      const r = localStorage.getItem("atr_recent");
      if (s) setSaved(JSON.parse(s));
      if (r) setRecent(JSON.parse(r));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("atr_saved", JSON.stringify(saved.slice(0, 50)));
    } catch {}
  }, [saved]);

  useEffect(() => {
    try {
      localStorage.setItem("atr_recent", JSON.stringify(recent.slice(0, 20)));
    } catch {}
  }, [recent]);

  const sections = useMemo(() => splitSections(rawAnswer), [rawAnswer]);

  function addRecent(q: string, loc: string, t: Tone) {
    const item: RecentItem = { id: makeId(), question: q, location: loc, tone: t, askedAt: Date.now() };
    setRecent((prev) => [item, ...prev.filter((x) => x.question !== q)].slice(0, 10));
  }

  function saveAnswer() {
    if (!rawAnswer.trim()) return;
    const item: SavedItem = {
      id: makeId(),
      question: question.trim(),
      location,
      tone,
      answer: rawAnswer,
      savedAt: Date.now(),
    };
    setSaved((prev) => [item, ...prev].slice(0, 30));
  }

  function loadSaved(item: SavedItem) {
    setQuestion(item.question);
    setLocation(item.location);
    setTone(item.tone);
    setRawAnswer(item.answer);
    setError("");
  }

  function loadRecent(item: RecentItem) {
    setQuestion(item.question);
    setLocation(item.location);
    setTone(item.tone);
    setRawAnswer("");
    setError("");
  }

  async function onAsk() {
    setError("");
    setRawAnswer("");
    if (!canAsk) return;

    const q = question.trim();
    addRecent(q, location, tone);

    try {
      setLoading(true);
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, location, tone }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.error?.message ||
          data?.error ||
          `Request failed (${res.status}). Please try again.`;
        throw new Error(msg);
      }

      setRawAnswer(data?.answer ?? "");
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const examples = [
    "I’m under contract—what should I avoid doing before closing?",
    "How do I negotiate repairs without killing the deal?",
    "What’s the smartest offer strategy in a multiple-offer situation?",
    "Should I buy down my rate or keep cash for reserves?",
  ];

  return (
   <div className="min-h-screen bg-slate-50 text-slate-900 [text-rendering:optimizeLegibility]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,196,48,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.10),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              Real estate clarity, minus the chaos
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
  Ask the Realtor
</h1>
<p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
  Professional guidance with a little Jersey-savvy—fast, clear, and actually useful.
</p>

          </div>

          <div className="mt-2 flex gap-2 sm:mt-0">
            <a
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              href="#how"
            >
              How it works
            </a>
            <a
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              href="#ask"
            >
              Ask a question
            </a>
          </div>
        </header>

        <main className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          {/* LEFT */}
          <section
            id="ask"
           className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-7"

          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-900">What can I help you with?</h2>
                <p className="text-sm text-slate-600">
                  Ask like you would in a consult. I’ll answer like a pro—without the fluff.
                </p>
              </div>

              <label className="text-sm font-medium text-slate-800">
                Your question
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Example: I'm buying in NJ—what should I focus on during attorney review?"
                  className="mt-2 min-h-[120px] w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium text-slate-800">
                  Area
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                  />
                </label>

                <label className="text-sm font-medium text-slate-800 sm:col-span-2">
                  Tone
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-200"
                  >
                    <option>Professional (Savvy)</option>
                    <option>Plain English</option>
                    <option>Investor Lens</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={onAsk}
                  disabled={!canAsk}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-900" />
                      Thinking like a Realtor…
                    </>
                  ) : (
                    "Ask"
                  )}
                </button>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(rawAnswer || "")}
                    disabled={!rawAnswer.trim()}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Copy
                  </button>
                  <button
                    onClick={saveAnswer}
                    disabled={!rawAnswer.trim()}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Save this answer
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                  <div className="font-semibold">Quick heads-up</div>
                  <div className="mt-1">{error}</div>
                </div>
              ) : null}

              {/* ANSWER: elevated sections */}
              {rawAnswer ? (
                <div className="mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Answer</div>
                      <div className="text-xs text-slate-500">
                        Area: <span className="font-medium text-slate-700">{location}</span> • Tone:{" "}
                        <span className="font-medium text-slate-700">{tone}</span>
                      </div>
                    </div>
                    {!sections.hasStructured ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        Classic view
                      </span>
                    ) : (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
                        Structured view
                      </span>
                    )}
                  </div>

                  {sections.hasStructured ? (
                    <div className="grid gap-4">
                      <SectionCard
                        title="Quick Answer"
                        subtitle="The bottom line, fast."
                        icon={<IconBolt />}
                        text={sections.quick}
                      />
                      <SectionCard
                        title="What to Watch Out For"
                        subtitle="Common pitfalls and red flags."
                        icon={<IconShield />}
                        text={sections.watch}
                      />
                      <SectionCard
                        title="Smart Next Steps"
                        subtitle="Practical moves you can take today."
                        icon={<IconSteps />}
                        text={sections.next}
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="prose prose-slate max-w-none whitespace-pre-wrap">
                        {rawAnswer}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="pt-2">
                <div className="text-sm font-semibold text-slate-900">Try one of these</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {examples.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => {
                        setQuestion(ex);
                        setRawAnswer("");
                        setError("");
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="space-y-6">
  {/* Work with Yvonne panel */}
<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
  <div className="flex items-start justify-between gap-3">
    <div>
     <h3 className="text-base font-semibold text-slate-900">Work with Yvonne</h3>
<p className="mt-1 text-sm leading-relaxed text-slate-600">
  I’ve devoted my career to being resourceful, strategic, and transparent—so you can make confident real estate decisions without pressure.
</p>
    </div>

    <span className="shrink-0 rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-semibold text-slate-900">
      Verified Realtor
    </span>
  </div>

  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-slate-900">Book a call with Yvonne</div>
        <div className="mt-1 text-sm text-slate-700">
          Tap the QR to open my Blinq contact card and reach me directly.
        </div>
        <div className="mt-2 text-xs text-slate-600">
          Mobile: tap • Desktop: click
        </div>
      </div>

      <a
        href="https://blinq.me/pEhYxpoPsDCh?bs=db"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Yvonne Sanford's Blinq contact card"
        title="Open my contact card"
        className="group"
      >
        <div className="h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition group-hover:shadow-md">
          <img
            src="/blinq-qr.png"
            alt="Tap or click to open Yvonne Sanford's Blinq contact card"
            className="h-full w-full object-contain p-2"
          />
        </div>
      </a>
    </div>

    <div className="mt-4 grid gap-2">
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">What you’ll get:</span> strategy, clarity, and a clean plan—no pressure.
      </div>
    </div>
  </div>
</section>


            {/* Recently asked */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Recently asked</h3>
                <button
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  onClick={() => setRecent([])}
                  disabled={recent.length === 0}
                >
                  Clear
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                A quick way to revisit what people are curious about.
              </p>

              <div className="mt-4 space-y-2">
                {recent.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    Ask your first question and it’ll show up here.
                  </div>
                ) : (
                  recent.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadRecent(item)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                      title="Click to load this question"
                    >
                      <div className="font-semibold text-slate-900 line-clamp-2">{item.question}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.location} • {item.tone}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            {/* Saved answers */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Saved answers</h3>
                <button
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  onClick={() => setSaved([])}
                  disabled={saved.length === 0}
                >
                  Clear
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Because nobody remembers everything after the adrenaline wears off.
              </p>

              <div className="mt-4 space-y-2">
                {saved.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                    Ask a question, then click <span className="font-semibold text-slate-900">Save this answer</span>.
                  </div>
                ) : (
                  saved.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadSaved(item)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm hover:bg-slate-50"
                      title="Click to load this saved answer"
                    >
                      <div className="font-semibold text-slate-900 line-clamp-2">{item.question}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        Saved • {item.location} • {item.tone}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            {/* How it works + guardrails */}
            <section id="how" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5">
              <h3 className="text-base font-semibold text-slate-900">How it works</h3>
              <ol className="mt-3 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    1
                  </span>
                  <span>Ask your question like you would in a real consult.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    2
                  </span>
                  <span>Default area is New Jersey. Adjust if needed.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    3
                  </span>
                  <span>Get the answer + watch-outs + next steps (so it’s actionable).</span>
                </li>
              </ol>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Guardrails</div>
                <div className="mt-1">
                  Educational guidance only—consult a NJ attorney for legal matters and a licensed loan officer for financing decisions.
                </div>
              </div>
            </section>

           <footer className="text-xs text-slate-500">
  © {new Date().getFullYear()} Ask the Realtor •{" "}
  <a
    href="/privacy"
    className="underline hover:text-slate-700"
  >
    Privacy & Disclaimer
  </a>
</footer>
</aside>
        </main>
      </div>
    </div>
  );
}
  
