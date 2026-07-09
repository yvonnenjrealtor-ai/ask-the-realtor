"use client";
import Image from "next/image";

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
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
useEffect(() => {
  const accepted = localStorage.getItem("aiDisclaimerAccepted");
  if (accepted) setShowDisclaimer(false);
}, []);

const acceptDisclaimer = () => {
  localStorage.setItem("aiDisclaimerAccepted", "true");
  setShowDisclaimer(false);
};
  const [question, setQuestion] = useState("");
  const [location, setLocation] = useState("New Jersey");
  const [tone, setTone] = useState<Tone>("Professional (Savvy)");
const [leadName, setLeadName] = useState("");
const [leadEmail, setLeadEmail] = useState("");
const [leadPhone, setLeadPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawAnswer, setRawAnswer] = useState("");
  const [error, setError] = useState("");

  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [recent, setRecent] = useState<RecentItem[]>([]);
const [copied, setCopied] = useState(false);
const [savedNotice, setSavedNotice] = useState(false);
const [leadSubmitted, setLeadSubmitted] = useState(false);
const [leadError, setLeadError] = useState("");
const [sendingLead, setSendingLead] = useState(false);
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
    setSavedNotice(true);
setTimeout(() => setSavedNotice(false), 2000);
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
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
    <>
      {showDisclaimer && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
    <div className="max-w-lg rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
      <h2 className="mb-3 text-xl font-bold">AI & Privacy Notice</h2>

      <p className="text-sm text-slate-700">
        Chat Homes AI uses OpenAI’s artificial intelligence services to generate real estate responses.
      </p>

      <p className="mt-3 text-sm text-slate-700">
        When you submit a question, the text you enter is sent to OpenAI solely to generate your answer.
      </p>

     <p className="mt-3 text-sm font-semibold text-slate-900">
  Please do not enter Social Security numbers, financial account information,
  medical information, government identification numbers, home addresses,
  or confidential personal information.
</p>

      <p className="mt-3 text-sm text-slate-700">
        Chat Homes AI does not sell your information or use your questions for advertising or profiling.
      </p>

      <p className="mt-3 text-sm text-slate-700">
        By selecting Continue, you acknowledge and consent to the transmission of your submitted question to OpenAI for response generation.
      </p>

      <button
        onClick={acceptDisclaimer}
        className="mt-5 w-full rounded-xl bg-yellow-400 py-3 font-bold text-black"
      >
        Continue
      </button>
    </div>
  </div>
)}
{showHowItWorks && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
<div className="max-w-lg rounded-lg bg-white p-6 text-slate-900 shadow-lg">
<h2 className="mb-3 text-xl font-semibold text-slate-900">
  How Chat Homes AI Works
      </h2>

      <div className="space-y-4">
        <div>
          <p className="font-semibold">1. Ask your question</p>
<p className="text-slate-700">Type any New Jersey real estate question.</p>
        </div>

        <div>
          <p className="font-semibold">2. Get instant guidance</p>
<p className="text-slate-700">Receive a clear answer in seconds.</p>        </div>

        <div>
          <p className="font-semibold">3. Connect when you're ready</p>
<p className="text-slate-700">Need personal help? Schedule a consultation with Yvonne Sanford.</p>
        </div>
      </div>

      <button
        onClick={() => setShowHowItWorks(false)}
        className="mt-5 w-full rounded bg-yellow-400 py-2 font-medium text-black"
      >
        Got It
      </button>
    </div>
  </div>
)}
   <div className="min-h-screen bg-slate-50 text-slate-900 [text-rendering:optimizeLegibility]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(244,196,48,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(15,23,42,0.10),transparent_45%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <div>
    Chat Homes AI
            </div>  
            </div>
  <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
    Chat Homes AI
  </h1>

  <p className="mt-2 text-base text-slate-600">
Get Instant Answers to Your New Jersey Real Estate Questions
  </p>

  <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600">
Buying, selling, investing, or just exploring your options? Ask your question below.
  </p>
</div>


          <div className="mt-2 flex gap-2 sm:mt-0">
           <button
  type="button"
  onClick={() => setShowHowItWorks(true)}
  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
>
  How It Works
</button>
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
                <h2 className="text-lg font-semibold text-slate-900">What real estate question can I help you answer?</h2>
                <p className="text-sm text-slate-600">
Ask your question. Get instant guidance.
                </p>
          
<div className="mb-6 rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-white p-5 shadow-sm">
  <h3 className="text-md font-semibold text-slate-900">
Get Personalized Real Estate Guidance
  </h3>
  
  
  <p className="text-sm text-slate-600 mb-3">
    Powered by AI. Backed by Yvonne Sanford.
  </p>
  
  </div>
                
              <label className="text-sm font-medium text-slate-800">
                Step 1: Your question
  <div className="relative">
  <textarea
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Type your real estate question..."
    className="mt-2 min-h-[140px] w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-4 text-slate-900 shadow-sm"
  />
</div>
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm font-medium text-slate-800">
                  Area
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#D4AF37] bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                  />
                </label>

                <label className="text-sm font-medium text-slate-800 sm:col-span-2">
                  Tone
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as Tone)}
                    className="mt-2 w-full rounded-2xl border border-[#D4AF37] bg-white px-4 py-3 text-slate-900 shadow-sm transition-all duration-200 focus:border-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-100"
                  >
                    <option>Professional (Savvy)</option>
                    <option>Plain English</option>
                    <option>Investor Lens</option>
                  </select>
                </label>
              </div>
              <div className="flex flex-col gap-4">
                <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    Get your answer without entering contact details first.
                  </p>

                  <p className="text-sm text-slate-600">
                    Ask any New Jersey real estate question, then choose whether you'd like a copy or personal guidance after the answer appears.
                  </p>
                </div>
              </div>
              <button
                  onClick={onAsk}
disabled={!canAsk}
className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-8 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-200 transition-all duration-300 hover:-translate-y-0.5 hover:from-yellow-300 hover:to-yellow-400 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
    >
    {loading ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-900/40 border-t-slate-900" />
Getting your answer…
                    </>
                  ) : (
"Get instant guidance"
)}
                </button>
<p className="mt-2 text-center text-xs text-slate-500">
  Free guidance. No obligation. Trusted New Jersey real estate insight.
</p>
  <div className="flex flex-wrap gap-2">
                  <button
onClick={() => {
  navigator.clipboard.writeText(rawAnswer || "");
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}}
                    disabled={!rawAnswer.trim()}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
{copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={saveAnswer}
                    disabled={!rawAnswer.trim()}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
{savedNotice ? "Saved!" : "Save this answer"}
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
                <div className="mt-4 space-y-5 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-xl shadow-slate-200/50 backdrop-blur transition-all duration-700 ease-out">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Area: {location} • Tone: {tone}
                      </div>
                      <div className="text-xs text-slate-500">
                        Area: <span className="font-medium text-slate-700">{location}</span> • Tone: <span className="font-medium text-slate-700">{tone}</span>
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
                    <div className="rounded-3xl border border-yellow-100 bg-gradient-to-br from-white to-yellow-50 p-6 shadow-lg shadow-yellow-100/40">
                      <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-8 text-[15px] text-slate-700">
                        {rawAnswer}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {rawAnswer ? (
                <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                  <div className="text-base font-semibold text-slate-900">
                    Would you like a copy of this answer or personalized guidance from Yvonne Sanford?
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Enter your name and email to receive a copy or request personal guidance.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="First Name"
                      className="w-full rounded-xl border border-[#D4AF37] bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 focus:outline-none"
                    />
                    <input
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full rounded-xl border border-[#D4AF37] bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 focus:outline-none"
                    />
                    <input
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="Phone (optional)"
                      className="w-full rounded-xl border border-[#D4AF37] bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 focus:outline-none"
                    />
                  </div>

                  {leadError ? (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                      {leadError}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={async () => {
                      setLeadError("");
                      if (!leadName.trim() || !leadEmail.trim()) {
                        setLeadError("Please enter your name and email to receive a copy.");
                        return;
                      }
                      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailPattern.test(leadEmail.trim())) {
                        setLeadError("Please enter a valid email address.");
                        return;
                      }

                      setSendingLead(true);
                      try {
                        await fetch("https://hook.us2.make.com/9rfr65qh3uk1jldcsdxkj2qjpencw58w", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: leadName.trim(),
                            email: leadEmail.trim(),
                            phone: leadPhone.trim() || undefined,
                            question: question.trim(),
                            answer: rawAnswer,
                            location,
                            tone,
                            timestamp: new Date().toISOString(),
                            source: "Chat Homes AI",
                          }),
                        });
                        setLeadSubmitted(true);
                      } catch (e: unknown) {
                        setLeadError(
                          e instanceof Error ? e.message : "Unable to submit your request. Please try again."
                        );
                      } finally {
                        setSendingLead(false);
                      }
                    }}
                    disabled={sendingLead}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sendingLead ? "Sending request…" : leadSubmitted ? "Request submitted" : "Send my copy / guidance request"}
                  </button>
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
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
              {/* CTA */}
              <div className="mt-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-5 text-center">
                <div className="text-lg font-semibold text-slate-900">
                  Need more personalized guidance?
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  Book directly with Yvonne Sanford for buyer strategy, investment guidance, or New Jersey real estate support.
                </p>

                <a
                  href="https://blinq.me/pEhYxpoPsDCh?bs=db"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all"
                >
                  Book a Consultation
                </a>
              </div>
            </div>
          </section>

          {/* RIGHT */}
       <aside className="space-y-6">
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
 <h3 className="text-base font-semibold text-slate-900">
  Connect with Yvonne Sanford
</h3>

<p className="mt-1 text-sm font-medium text-slate-800">
  Trusted New Jersey Real Estate Advisor
  Broker-Associate® | REALTOR® | 25+ Years Experience
</p>

<p className="mt-1 text-sm text-slate-600">
  Direct access for guidance, showings, and next steps 🏡
</p>

  <div className="mt-4 space-y-3">
    <a
      href="https://blinq.me/pEhYxpoPsDCh?bs=db"
      target="_blank"
      rel="noreferrer"
      className="block"
    >
      <Image
        src="/blinq-qr.png"
        alt="Yvonne Sanford digital contact card"
        width={600}
        height={360}
        className="w-full rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition"
      />
    </a>

    <p className="text-center text-xs text-slate-500">
      Tap the card or scan QR code to book a call with me!
    </p>
  </div>
</section>

  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">Recently asked</h3>
    <p className="mt-1 text-sm text-slate-600">
      A quick way to revisit what people are asking.
    </p>

    <div className="mt-4 space-y-3">
      {recent.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          No recent questions yet.
        </div>
      ) : (
        recent.map((item) => (
          <button
            key={item.id}
            onClick={() => loadRecent(item)}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50"
          >
            <div className="text-sm font-medium text-slate-900">{item.question}</div>
            <div className="mt-1 text-xs text-slate-500">
              {item.location} • {item.tone}
            </div>
          </button>
        ))
      )}
    </div>
  </section>

  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">Saved answers</h3>
    <p className="mt-1 text-sm text-slate-600">
      Because nobody remembers everything after the conversation ends.
    </p>

    <div className="mt-4 space-y-3">
      {saved.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Ask a question, then click <strong>Save this answer</strong>.
        </div>
      ) : (
        saved.map((item) => (
          <button
            key={item.id}
            onClick={() => loadSaved(item)}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:bg-slate-50"
          >
            <div className="text-sm font-medium text-slate-900">{item.question}</div>
            <div className="mt-1 text-xs text-slate-500">
              {item.location} • {item.tone}
            </div>
          </button>
        ))
      )}
    </div>
  </section>

 <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-600">
  <div className="space-y-2">

    <div className="space-y-1">
      <div className="font-semibold text-slate-900">
        Yvonne Sanford, Broker-Associate
      </div>

      <div className="font-semibold text-slate-900">
        Weichert Realtors®
      </div>
    </div>

    <div>
      505 Millburn Avenue, Short Hills, NJ 07078
    </div>

    <div>
      Office: (973) 376-4545
    </div>

    <div className="mt-3">
      Equal Housing Opportunity
    </div>

    <div className="mt-3">
      This application provides general real estate information for educational purposes only and does not constitute legal, tax, or financial advice.
    </div>

    <div>
      No agency relationship is created through use of this application.
      Agency relationship is established only through a fully executed written agreement and disclosures
      and delivery of the New Jersey Consumer Information Statement (CIS).
    </div>

    <div>
      Information is free. No boligation. Personalized guidance is available whenever you are ready. Inforamtion is generated using artificial intelligence and should be independently verified.
    </div>
<div className="mt-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
  
  <div className="font-medium text-gray-800 mb-3">
    Homebuying Help by Yvonne Sanford
      </div>
  
    <p className="mt-2 text-xs text-slate-500">
  This app provides general educational information only and is not legal, tax, financial, or brokerage advice.
</p>

<p className="mt-2 text-xs text-slate-500">
  Need help? contact@chathomesai.com
</p>

  <div className="flex flex-wrap justify-center gap-4 mb-4">
    <a
      href="/privacy"
      className="hover:text-black underline underline-offset-2"
    >
      Privacy Policy
    </a>

    <a
      href="/terms"
      className="hover:text-black underline underline-offset-2"
    >
      Terms of Use
    </a>

    <a
      href="mailto:contact@chathomesai.com"
      className="hover:text-black underline underline-offset-2"
    >
      Contact Support
    </a>
  </div>

  <div className="text-xs text-gray-500 leading-5 max-w-xl mx-auto"> 
    Questions are free. No obligation. Personalized guidance available when
    you're ready.
  </div>

</div>
    <div className="mt-3">
      {"©"} {new Date().getFullYear()} Chat Homes AI with Yvonne Sanford
    </div>

  </div>
</footer>
</aside>
</main>
</div>
</div>
</>
);
}
