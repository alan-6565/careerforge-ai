import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resume } = await req.json();
  if (!resume) return NextResponse.json({ error: "Resume is required" }, { status: 400 });

  const prompt = `You are a brutally honest but professional career coach doing a "Resume Roast" — like a code review but for resumes. You are direct, witty, and sometimes savage, but always constructive. Your goal is to genuinely help the person improve.

Analyze this resume and return a JSON object with EXACTLY this structure:

{
  "roastScore": <number 0-100, where 100 is perfect and 0 is a disaster>,
  "verdict": "<one punchy sentence overall verdict — be brutally honest but not mean>",
  "roastLines": [
    "<savage but fair observation 1>",
    "<savage but fair observation 2>",
    "<savage but fair observation 3>"
  ],
  "crimes": [
    {
      "title": "<short crime name>",
      "description": "<what's wrong and why it hurts them>"
    }
  ],
  "redeeming": [
    "<something genuinely good about the resume>"
  ],
  "fixes": [
    {
      "priority": "critical" | "high" | "medium",
      "fix": "<specific actionable fix they can do right now>"
    }
  ],
  "finalVerdict": "<1-2 sentence closing roast with encouragement>"
}

RESUME:
${resume}

Be funny but fair. Be specific — reference actual content from their resume. Return ONLY valid JSON.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");
    const result = JSON.parse(content.text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Roast error:", error);
    return NextResponse.json({ error: "Failed to roast resume" }, { status: 500 });
  }
}
