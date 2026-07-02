"use client";

import { useState } from "react";
import { Flame, Loader2, AlertTriangle, CheckCircle, Zap, Share2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Fix = { priority: "critical" | "high" | "medium"; fix: string };
type Crime = { title: string; description: string };
type Result = {
  roastScore: number;
  verdict: string;
  roastLines: string[];
  crimes: Crime[];
  redeeming: string[];
  fixes: Fix[];
  finalVerdict: string;
};

const priorityStyles = {
  critical: { bg: "bg-red-50 border-red-100",    icon: "text-red-500",    label: "Critical", labelBg: "bg-red-100 text-red-600"    },
  high:     { bg: "bg-orange-50 border-orange-100", icon: "text-orange-500", label: "High",     labelBg: "bg-orange-100 text-orange-600" },
  medium:   { bg: "bg-yellow-50 border-yellow-100", icon: "text-yellow-500", label: "Medium",   labelBg: "bg-yellow-100 text-yellow-700" },
};

function ScoreDisplay({ score }: { score: number }) {
  const color = score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500";
  const ring  = score >= 75 ? "#22c55e"        : score >= 50 ? "#eab308"         : "#ef4444";
  const label = score >= 75 ? "Not bad! 👍"   : score >= 50 ? "Needs work 😬"   : "Yikes 😬🔥";

  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={radius} fill="none"
            stroke={ring} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-4xl font-black", color)}>{score}</span>
          <span className="text-xs text-gray-400 font-medium">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-600">{label}</span>
    </div>
  );
}

export default function RoastPage() {
  const [resume, setResume]   = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<Result | null>(null);
  const [error, setError]     = useState("");

  async function roast() {
    if (!resume.trim()) { setError("Please paste your resume first."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume }),
      });
      if (!res.ok) throw new Error("Failed");
      setResult(await res.json());
    } catch {
      setError("Something went wrong. Make sure your Anthropic API key has credits.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" /> Resume Roast
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Get brutally honest AI feedback on your resume. No sugarcoating.
        </p>
      </div>

      {/* Input */}
      {!result && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Paste your resume</p>
              <p className="text-xs text-gray-400">The AI will give you honest, actionable feedback</p>
            </div>
          </div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your entire resume here — work experience, skills, education, everything..."
            className="w-full h-72 p-5 text-sm text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none"
          />
          <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-4 flex items-center justify-between">
            <p className="text-xs text-gray-400">{resume.length} characters</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={roast}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors shadow-sm"
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Roasting...</>
                : <><Flame className="h-4 w-4" /> Roast My Resume</>}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setResult(null); setResume(""); }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Roast another resume
            </button>
            <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Share2 className="h-4 w-4" /> Share Roast
            </button>
          </div>

          {/* Score + Verdict */}
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-red-50 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreDisplay score={result.roastScore} />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-500 shrink-0" />
                  <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">The Verdict</span>
                </div>
                <p className="text-xl font-bold text-gray-900 leading-snug">&ldquo;{result.verdict}&rdquo;</p>
                <p className="mt-3 text-sm text-gray-500">{result.finalVerdict}</p>
              </div>
            </div>
          </div>

          {/* Roast Lines */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
              🔥 The Roast
            </h3>
            <div className="space-y-3">
              {result.roastLines.map((line, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <span className="text-orange-400 font-bold text-sm shrink-0">{i + 1}.</span>
                  <p className="text-sm text-gray-700 italic">&ldquo;{line}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Crimes + Redeeming side by side */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Crimes */}
            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" /> Resume Crimes
              </h3>
              <div className="space-y-3">
                {result.crimes.map((c, i) => (
                  <div key={i} className="rounded-xl border border-red-100 bg-red-50 p-3">
                    <p className="text-xs font-bold text-red-700">{c.title}</p>
                    <p className="mt-1 text-xs text-red-600">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Redeeming qualities */}
            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" /> Redeeming Qualities
              </h3>
              <div className="space-y-3">
                {result.redeeming.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl border border-green-100 bg-green-50 p-3">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-700">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixes */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-500" /> How to Fix It
            </h3>
            <div className="space-y-3">
              {result.fixes.map((f, i) => {
                const s = priorityStyles[f.priority];
                return (
                  <div key={i} className={cn("flex items-start gap-3 rounded-xl border p-4", s.bg)}>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold shrink-0 mt-0.5", s.labelBg)}>
                      {s.label}
                    </span>
                    <p className="text-sm text-gray-700">{f.fix}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
