import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export const runtime = "nodejs";

async function extractPDFText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFParser = require("pdf2json");
    const parser = new PDFParser(null, true);

    parser.on("pdfParser_dataError", (err: { parserError: string }) => {
      reject(new Error(err.parserError));
    });

    parser.on("pdfParser_dataReady", () => {
      try {
        const text = parser.getRawTextContent();
        resolve(text);
      } catch {
        reject(new Error("Failed to extract text"));
      }
    });

    parser.parseBuffer(buffer);
  });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase();
  let text = "";

  try {
    if (ext === "pdf") {
      const buffer = Buffer.from(await file.arrayBuffer());
      text = await extractPDFText(buffer);
    } else if (ext === "docx" || ext === "doc") {
      const mammoth = await import("mammoth");
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === "txt") {
      text = await file.text();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, or TXT." },
        { status: 400 }
      );
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text. Try copy-pasting instead." },
        { status: 400 }
      );
    }

    const prompt = `You are a resume parser. Extract all information from this resume text and return a JSON object with EXACTLY this structure:

{
  "firstName": "",
  "lastName": "",
  "title": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "website": "",
  "summary": "",
  "expertise": "",
  "experience": [
    {
      "id": "1",
      "company": "",
      "role": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": [""]
    }
  ],
  "education": [
    {
      "id": "1",
      "school": "",
      "degree": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "notes": ""
    }
  ],
  "skills": "",
  "projects": ""
}

Rules:
- firstName and lastName: split the full name
- title: their professional title or most recent job title
- expertise: comma-separated key skills for the Areas of Expertise section
- skills: comma-separated technical skills
- experience: array of all work experiences, most recent first
- bullets: array of bullet points for each job (clean text, no bullet symbols)
- current: true if they still work there (no end date or says "Present")
- projects: string with all projects separated by newlines
- If a field is not found, use empty string or empty array
- Return ONLY valid JSON, no markdown

RESUME TEXT:
${text}`;

    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response");

    const cleaned = content.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    parsed.experience = (parsed.experience || []).map(
      (e: object, i: number) => ({ ...e, id: String(i + 1) })
    );
    parsed.education = (parsed.education || []).map(
      (e: object, i: number) => ({ ...e, id: String(i + 1) })
    );

    return NextResponse.json({ data: parsed, rawText: text });
  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume. Try copy-pasting the text instead." },
      { status: 500 }
    );
  }
}
