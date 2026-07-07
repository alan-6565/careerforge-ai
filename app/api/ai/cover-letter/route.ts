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

  const prompt = `You are an expert career coach writing a personalized cover letter.

Write a compelling cover letter for this candidate applying to ${role} at ${company}.

Tone: ${toneGuide[tone] ?? toneGuide.professional}

Requirements:
- 3-4 paragraphs, max 350 words
- Opening paragraph: strong hook that references the company specifically
- Middle paragraphs: connect their actual experience/skills to the job requirements
- Closing: confident call to action
- Sound like a real human wrote it, not an AI
- Reference specific details from both the resume and job description
- Do NOT use generic phrases like "I am writing to express my interest"
- Do NOT use the word "leverage"

CANDIDATE RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the cover letter text. No subject line, no "Dear Hiring Manager" header needed — start directly with the opening paragraph.`;

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
