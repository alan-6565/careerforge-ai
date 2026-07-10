"use client";

import { useState, useRef } from "react";
import {
  Mail, Loader2, Copy, Check, RotateCcw,
  Sparkles, Building2, Briefcase, FileText, Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "professional" | "casual" | "startup" | "creative";

const TONES: { key: Tone; label: string; description: string; emoji: string }[] = [
  { key: "professional", label: "Professional", description: "Polished & formal",   emoji: "💼" },
  { key: "casual",       label: "Casual",       description: "Warm & human",         emoji: "😊" },
  { key: "startup",      label: "Startup",      description: "Fast & scrappy",       emoji: "🚀" },
  { key: "creative",     label: "Creative",     description: "Bold & memorable",     emoji: "🎨" },
];

export default function CoverLetterPage() {
  const [resume, setResume]           = useState("");
  const [jobDescription, setJobDesc]  = useState("");
  const [company, setCompany]         = useState("");
  const [role, setRole]               = useState("");
  const [tone, setTone]               = useState<Tone>("professional");
  const [loading, setLoading]         = useState(false);
  const [output, setOutput]           = useState("");
  const [copied, setCopied]           = useState(false);
  const [error, setError]             = useState("");
  const [step, setStep]               = useState<1 | 2>(1);
  const outputRef                     = useRef<HTMLDivElement>(null);

  async function generate() {
    if (!resume.trim() || !jobDescription.trim() || !company.trim() || !role.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");
    setStep(2);

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription, company, role, tone }),
      });

      if (!res.ok) throw new Error("Failed");
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput(prev => prev + decoder.decode(value, { stream: true }));
      }
    } catch {
      setError("Something went wrong. Make sure your Anthropic API key has credits.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPDF() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cover Letter — ${role} at ${company}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: "Times New Roman", serif;
              font-size: 12px;
              line-height: 1.8;
              padding: 72px 80px;
              color: #111;
            }
            p { margin-bottom: 16px; }
            @page { margin: 0; size: letter; }
          </style>
        </head>
        <body>
          ${output.split("\n").map(line => `<p>${line || "&nbsp;"}</p>`).join("")}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }

  function reset() {
    setOutput("");
    setStep(1);
    setError("");
  }

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Mail className="h-6 w-6 text-green-500" /> Cover Letter Generator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate a personalized, role-specific cover letter in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* Left — Inputs */}
        <div className="lg:col-span-2 space-y-4">

          {/* Company + Role */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" /> Job Details
            </h2>
            <div>
              <label className="text-xs font-medium text-gray-600">Company *</label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Apple"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Role *</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Tone */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" /> Tone
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTone(t.key)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                    tone === t.key
                      ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <span className="text-lg">{t.emoji}</span>
                  <span className="mt-1 text-xs font-semibold text-gray-900">{t.label}</span>
                  <span className="text-xs text-gray-400">{t.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resume */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" /> Your Resume
            </h2>
            <textarea
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-36 rounded-xl border border-gray-200 p-3 text-sm placeholder:text-gray-300 resize-none focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Job Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" /> Job Description
            </h2>
            <textarea
              value={jobDescription}
              onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-36 rounded-xl border border-gray-200 p-3 text-sm placeholder:text-gray-300 resize-none focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={step === 1 ? generate : reset}
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors shadow-sm disabled:opacity-60",
              step === 1 ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
            )}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
            ) : step === 1 ? (
              <><Sparkles className="h-4 w-4" /> Generate Cover Letter</>
            ) : (
              <><RotateCcw className="h-4 w-4" /> Generate New Version</>
            )}
          </button>
        </div>

        {/* Right — Output */}
        <div className="lg:col-span-3">
          <div className="sticky top-0 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden h-full min-h-96">

            {/* Output header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold text-gray-900">
                  {company && role ? `Cover Letter — ${role} at ${company}` : "Cover Letter"}
                </span>
                {tone && (
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600 capitalize">
                    {tone}
                  </span>
                )}
              </div>
              {output && (
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copied ? <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                </button>
              )}
            </div>

            {/* Content */}
            <div ref={outputRef} className="p-6 min-h-80">
              {!output && !loading && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 mb-4">
                    <Mail className="h-7 w-7 text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Your cover letter will appear here</p>
                  <p className="mt-1 text-xs text-gray-400">Fill in the details and hit Generate</p>
                </div>
              )}

              {loading && !output && (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                  <p className="text-sm text-gray-400">Claude is writing your cover letter...</p>
                </div>
              )}

              {output && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">{output}</p>
                  {loading && (
                    <span className="inline-block h-4 w-1 bg-green-400 animate-pulse ml-0.5 rounded" />
                  )}
                </div>
              )}
            </div>

            {output && !loading && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3 flex items-center justify-between">
                <p className="text-xs text-gray-400">{output.split(" ").length} words</p>
                <div className="flex gap-2">
                  <button
                    onClick={generate}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
