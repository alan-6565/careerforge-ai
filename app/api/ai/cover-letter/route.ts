import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { resume, jobDescription, company, role, tone } = await req.json();

  if (!resume || !jobDescription || !company || !role) {
    return new Response("Missing required fields", { status: 400 });
  }

  const toneGuide: Record<string, string> = {
    professional: "formal, polished, and confident — suitable for big tech and enterprise companies",
    casual:       "warm, conversational, and personable — still professional but more human",
    startup:      "energetic, direct, and scrappy — show you can move fast and wear many hats",
    creative:     "bold and memorable — open with a hook, show personality while staying relevant",
  };

  const prompt = `You are an expert career coach writing a personalized, high-quality cover letter.

Write a compelling cover letter for this candidate applying to ${role} at ${company}.

Tone: ${toneGuide[tone] ?? toneGuide.professional}

Requirements:
- ALWAYS start with exactly: "Hello ${company} team,"
- Then a blank line, then the opening paragraph
- 3-4 paragraphs total, max 400 words
- Opening paragraph: strong, specific hook — mention something real about ${company} (their products, mission, culture, or recent news) and why this candidate wants to be there specifically
- Middle paragraphs: connect their ACTUAL experience and projects from the resume directly to the job requirements — be specific, use numbers/impact where possible
- Closing paragraph: confident call to action, express genuine excitement, invite next steps
- Sound like a real human who genuinely wants this job, not a template
- Reference specific details from both the resume and job description
- Do NOT use generic phrases like "I am writing to express my interest" or "I believe I would be a great fit"
- Do NOT use the word "leverage" or "passionate"
- End with: "Best," then a new line with the candidate's name (extract from resume)

CANDIDATE RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the cover letter text. No extra explanation.`;

  // Stream the response
  const stream = await anthropic.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
