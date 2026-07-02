import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resume, jobDescription } = await req.json();

  if (!resume || !jobDescription) {
    return NextResponse.json({ error: "Resume and job description are required" }, { status: 400 });
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach.

Analyze this resume against the job description and return a JSON object with exactly this structure:

{
  "atsScore": <number 0-100>,
  "matchPercentage": <number 0-100>,
  "summary": "<2 sentence overall assessment>",
  "missingKeywords": ["keyword1", "keyword2", ...],
  "presentKeywords": ["keyword1", "keyword2", ...],
  "suggestions": [
    {
      "type": "critical" | "improvement" | "tip",
      "title": "<short title>",
      "description": "<actionable suggestion>"
    }
  ],
  "sectionScores": {
    "formatting": <number 0-100>,
    "keywords": <number 0-100>,
    "experience": <number 0-100>,
    "skills": <number 0-100>,
    "education": <number 0-100>
  },
  "rewrittenBullets": [
    {
      "original": "<original bullet point from resume>",
      "improved": "<stronger rewritten version>"
    }
  ]
}

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON. No markdown, no explanation.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const result = JSON.parse(content.text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("ATS analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
