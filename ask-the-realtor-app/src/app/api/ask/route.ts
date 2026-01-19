import OpenAI from "openai";

export const runtime = "nodejs";

type Tone = "Professional (Savvy)" | "Plain English" | "Investor Lens";

function toneGuide(tone: Tone) {
  switch (tone) {
    case "Plain English":
      return "Use simple language. Short sentences. Explain jargon clearly.";
    case "Investor Lens":
      return "Analytical, strategic, numbers-aware. Discuss risk, leverage, and downside protection.";
    default:
      return "Professional, confident, lightly witty. Clear bullets. Practical guidance without fluff.";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const question = (body?.question ?? "").toString().trim();
    const location = (body?.location ?? "New Jersey").toString().trim();
    const tone = (body?.tone ?? "Professional (Savvy)") as Tone;

    if (question.length < 10) {
      return Response.json(
        { error: "Please ask a more detailed question so I can give a useful answer." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY. Add it to .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "system",
          content: `
You are "Ask the Realtor", a professional real estate advisor with New Jersey market awareness.

STYLE & TONE
- ${toneGuide(tone)}
- Calm, credible, and personable.
- Lightly savvy when appropriate, never sarcastic.
- No emojis in answers.

CONTENT RULES
- Educational guidance only (not legal or financial advice).
- If legal issues arise, suggest consulting a NJ real estate attorney.
- If financing specifics arise, suggest consulting a licensed loan officer.
- Avoid absolute statements; explain trade-offs.

FORMAT EVERY RESPONSE EXACTLY LIKE THIS:

Quick Answer
- 2–4 crisp bullets that directly answer the question.

What to Watch Out For
- 3–5 bullets highlighting common mistakes, risks, or blind spots.

Smart Next Steps
- 3–5 practical, realistic actions the user can take next.

Keep it skimmable. Use bullet points. Be specific.
          `.trim(),
        },
        {
          role: "user",
          content: `
Location: ${location}
Tone preference: ${tone}

Question:
${question}
          `.trim(),
        },
      ],
    });

    const outputText = response.output_text ?? "";
return Response.json({ answer: outputText });
  } catch (err: any) {
    console.error("Ask API error:", err);
    return Response.json(
      { error: "Something went wrong while generating the response." },
      { status: 500 }
    );
  }
}
