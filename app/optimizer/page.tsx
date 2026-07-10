"use client";

import { useState, useRef } from "react";
import {
  Zap, CheckCircle, XCircle, AlertCircle,
  ChevronUp, ChevronDown, Loader2, ArrowRight,
  Upload, FileText, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Suggestion = { type: "critical" | "improvement" | "tip"; title: string; description: string };
type RewrittenBullet = { original: string; improved: string };
type Result = {
  atsScore: number;
  matchPercentage: number;
  summary: string;
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: Suggestion[];
  sectionScores: Record<string, number>;
  rewrittenBullets: RewrittenBullet[];
};

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle"
          className="rotate-90" style={{ transform: "rotate(90deg) translate(0px, -100px)" }}
          fill="#111" fontSize="18" fontWeight="bold">
          {score}
        </text>
      </svg>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}

const suggestionStyles = {
  critical:    { icon: XCircle,      color: "text-red-500",    bg: "bg-red-50 border-red-100"    },
  improvement: { icon: AlertCircle,  color: "text-yellow-500", bg: "bg-yellow-50 border-yellow-100" },
  tip:         { icon: CheckCircle,  color: "text-green-500",  bg: "bg-green-50 border-green-100"   },
};

export default function OptimizerPage() {
  const [resume, setResume]             = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState<Result | null>(null);
  const [error, setError]               = useState("");
  const [expandedBullet, setExpandedBullet] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [dragging, setDragging]         = useState(false);
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadedFile(file);
    setUploadLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/ai/parse-resume", { method: "POST", body: form });
      if (!res.ok) throw new Error("Failed to read file");
      const { rawText } = await res.json();
      setResume(rawText);
    } catch {
      setError("Could not read file. Try copy-pasting your resume text instead.");
      setUploadedFile(null);
    } finally {
      setUploadLoading(false);
    }
  }

  async function analyze() {
    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please add your resume and the job description.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Make sure your Anthropic API key has credits.");
    } finally {
      setLoading(false);
    }
  }

  const scoreColor = (s: number) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" /> ATS Checker
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Check how well your resume passes Applicant Tracking Systems.
        </p>
      </div>

      {/* Input */}
      {!result && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

          {/* Resume — upload or paste */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Your Resume</label>
              {uploadedFile && (
                <button
                  onClick={() => { setUploadedFile(null); setResume(""); }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="h-3 w-3" /> Remove file
                </button>
              )}
            </div>

            {/* Upload zone */}
            {!uploadedFile && (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 transition-all",
                  dragging ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/30"
                )}
              >
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                {uploadLoading ? (
                  <><Loader2 className="h-6 w-6 animate-spin text-violet-500" /><p className="text-xs text-violet-600">Reading file...</p></>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400" />
                    <p className="text-xs font-medium text-gray-600">Drop PDF or DOCX here</p>
                    <p className="text-xs text-gray-400">or click to browse</p>
                  </>
                )}
              </div>
            )}

            {/* Uploaded file badge */}
            {uploadedFile && (
              <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                <FileText className="h-5 w-5 text-green-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-green-800">{uploadedFile.name}</p>
                  <p className="text-xs text-green-600">Resume text extracted ✓</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or paste text</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume text here..."
              className="h-40 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none shadow-sm"
            />
          </div>

          {/* Job Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="flex-1 min-h-72 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none shadow-sm"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!result && (
        <button
          onClick={analyze}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with Claude AI...</>
          ) : (
            <><Zap className="h-4 w-4" /> Analyze Resume</>
          )}
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Re-analyze button */}
          <button
            onClick={() => setResult(null)}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
          >
            ← Analyze another resume
          </button>

          {/* Score Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center gap-2">
              <div className="text-5xl font-bold" style={{ color: scoreColor(result.atsScore) }}>
                {result.atsScore}
              </div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">ATS Score</div>
              <div className="text-xs text-gray-500 text-center">
                {result.atsScore >= 80 ? "Great! Your resume is ATS-friendly." :
                  result.atsScore >= 60 ? "Good, but there's room to improve." :
                    "Your resume needs optimization."}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center gap-2">
              <div className="text-5xl font-bold text-blue-600">{result.matchPercentage}%</div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Job Match</div>
              <div className="text-xs text-gray-500 text-center">How well you match this specific role</div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Score Breakdown</p>
              <div className="space-y-2">
                {Object.entries(result.sectionScores).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-20 text-xs text-gray-500 capitalize">{key}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                      <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${val}%`, backgroundColor: scoreColor(val) }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-7 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-violet-100 bg-violet-50 px-5 py-4">
            <p className="text-sm text-violet-900">{result.summary}</p>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" /> Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-medium text-red-600">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> Present Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.presentKeywords.map((kw) => (
                  <span key={kw} className="rounded-full bg-green-50 border border-green-100 px-3 py-1 text-xs font-medium text-green-600">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Key Suggestions</h3>
            <div className="space-y-3">
              {result.suggestions.map((s, i) => {
                const { icon: Icon, color, bg } = suggestionStyles[s.type];
                return (
                  <div key={i} className={cn("rounded-lg border p-4", bg)}>
                    <div className="flex items-start gap-3">
                      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", color)} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                        <p className="mt-0.5 text-sm text-gray-600">{s.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rewritten Bullets */}
          {result.rewrittenBullets?.length > 0 && (
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-violet-500" /> AI-Rewritten Bullet Points
              </h3>
              <div className="space-y-3">
                {result.rewrittenBullets.map((b, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setExpandedBullet(expandedBullet === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm text-gray-500 line-through pr-4">{b.original}</p>
                      {expandedBullet === i ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
                    </button>
                    {expandedBullet === i && (
                      <div className="border-t border-gray-100 bg-green-50 px-4 py-3">
                        <p className="text-xs font-semibold text-green-600 mb-1">✨ Improved version</p>
                        <p className="text-sm text-gray-800">{b.improved}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
