import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, answer, hint, role, company } = await req.json();

  const prompt = `You are an expert interviewer at ${company ?? "a top tech company"} evaluating a candidate for a ${role ?? "software engineering"} role.

Evaluate this interview answer and return a JSON object:

{
  "score": <number 0-100>,
  "verdict": "Good Answer" | "Decent Answer" | "Needs Improvement" | "Poor Answer",
  "strengths": ["<what they did well>"],
  "improvements": ["<specific thing to improve>"],
  "betterAnswer": "<a concise example of what a stronger answer would include>",
  "tips": "<one actionable tip for next time>"
}

QUESTION: ${question}
CANDIDATE'S ANSWER: ${answer}
WHAT A GOOD ANSWER COVERS: ${hint}

Be honest but constructive. Score 80+ only if they covered the key points well. Return ONLY valid JSON.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");
    return NextResponse.json(JSON.parse(content.text));
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
