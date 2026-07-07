import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resume, jobDescription, company, role, type } = await req.json();

  const typeGuide: Record<string, string> = {
    behavioral:    "behavioral questions using the STAR method (e.g. Tell me about a time...)",
    technical:     "technical questions about their specific tech stack mentioned in the resume",
    system_design: "system design questions appropriate for their experience level",
    frontend:      "frontend-specific questions: React, CSS, performance, accessibility, browser APIs",
    backend:       "backend questions: APIs, databases, scalability, security, architecture",
    general:       "a mix of behavioral, situational, and role-specific questions",
  };

  const prompt = `You are an expert technical interviewer at ${company ?? "a top tech company"} interviewing for a ${role ?? "software engineering"} role.

Generate 8 interview questions based on the candidate's resume and job description.

Question type focus: ${typeGuide[type] ?? typeGuide.general}

Requirements:
- Questions should be specific to their actual experience (reference real projects/skills from resume)
- Mix difficulty: 2 warm-up, 4 core, 2 challenging
- Each question should have a clear expected answer direction
- Make them realistic — questions a real interviewer would actually ask

Return a JSON array with exactly this structure:
[
  {
    "id": "1",
    "question": "<the interview question>",
    "type": "behavioral" | "technical" | "situational",
    "difficulty": "easy" | "medium" | "hard",
    "hint": "<brief hint about what a good answer covers — shown after they answer>",
    "followUp": "<a natural follow-up question>"
  }
]

RESUME: ${resume ?? "Not provided"}
JOB DESCRIPTION: ${jobDescription ?? "Not provided"}

Return ONLY valid JSON array.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");
    const questions = JSON.parse(content.text);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Question gen error:", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
