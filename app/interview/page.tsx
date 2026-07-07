"use client";

import { useState } from "react";
import {
  MessageSquare, Loader2, ChevronRight, ChevronLeft,
  CheckCircle, XCircle, AlertCircle, Sparkles,
  Trophy, RotateCcw, Send, Building2, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionType = "behavioral" | "technical" | "situational";
type Difficulty   = "easy" | "medium" | "hard";
type InterviewType = "behavioral" | "technical" | "system_design" | "frontend" | "backend" | "general";

type Question = {
  id: string;
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  hint: string;
  followUp: string;
};

type Feedback = {
  score: number;
  verdict: string;
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
  tips: string;
};

type AnsweredQuestion = Question & { answer: string; feedback: Feedback };

const INTERVIEW_TYPES: { key: InterviewType; label: string; emoji: string; description: string }[] = [
  { key: "general",       label: "General",       emoji: "🎯", description: "Mix of all types"        },
  { key: "behavioral",    label: "Behavioral",     emoji: "🧠", description: "STAR method questions"   },
  { key: "technical",     label: "Technical",      emoji: "⚙️", description: "Tech stack deep dive"    },
  { key: "frontend",      label: "Frontend",       emoji: "🖥️", description: "React, CSS, performance"  },
  { key: "backend",       label: "Backend",        emoji: "🔧", description: "APIs, DBs, scalability"   },
  { key: "system_design", label: "System Design",  emoji: "🏗️", description: "Architecture questions"   },
];

const difficultyStyles: Record<Difficulty, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

const verdictStyles: Record<string, { color: string; icon: typeof CheckCircle; bg: string }> = {
  "Good Answer":        { color: "text-green-600",  icon: CheckCircle,   bg: "bg-green-50 border-green-100"   },
  "Decent Answer":      { color: "text-blue-600",   icon: AlertCircle,   bg: "bg-blue-50 border-blue-100"     },
  "Needs Improvement":  { color: "text-yellow-600", icon: AlertCircle,   bg: "bg-yellow-50 border-yellow-100" },
  "Poor Answer":        { color: "text-red-600",    icon: XCircle,       bg: "bg-red-50 border-red-100"       },
};

type Screen = "setup" | "interview" | "results";

export default function InterviewPage() {
  const [screen, setScreen]             = useState<Screen>("setup");
  const [company, setCompany]           = useState("");
  const [role, setRole]                 = useState("");
  const [resume, setResume]             = useState("");
  const [jobDesc, setJobDesc]           = useState("");
  const [interviewType, setType]        = useState<InterviewType>("general");
  const [questions, setQuestions]       = useState<Question[]>([]);
  const [current, setCurrent]           = useState(0);
  const [answer, setAnswer]             = useState("");
  const [answered, setAnswered]         = useState<AnsweredQuestion[]>([]);
  const [feedback, setFeedback]         = useState<Feedback | null>(null);
  const [loadingQ, setLoadingQ]         = useState(false);
  const [loadingF, setLoadingF]         = useState(false);
  const [showHint, setShowHint]         = useState(false);
  const [error, setError]               = useState("");

  async function startInterview() {
    if (!company || !role) { setError("Please enter company and role."); return; }
    setError("");
    setLoadingQ(true);
    try {
      const res = await fetch("/api/ai/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription: jobDesc, company, role, type: interviewType }),
      });
      if (!res.ok) throw new Error("Failed");
      const { questions: qs } = await res.json();
      setQuestions(qs);
      setCurrent(0);
      setAnswered([]);
      setAnswer("");
      setFeedback(null);
      setShowHint(false);
      setScreen("interview");
    } catch {
      setError("Failed to generate questions. Make sure your Anthropic API key has credits.");
    } finally {
      setLoadingQ(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setLoadingF(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/ai/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[current].question,
          answer,
          hint: questions[current].hint,
          role,
          company,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const fb = await res.json();
      setFeedback(fb);
      setAnswered(prev => [...prev, { ...questions[current], answer, feedback: fb }]);
    } catch {
      setError("Failed to get feedback.");
    } finally {
      setLoadingF(false);
    }
  }

  function nextQuestion() {
    if (current + 1 >= questions.length) {
      setScreen("results");
    } else {
      setCurrent(c => c + 1);
      setAnswer("");
      setFeedback(null);
      setShowHint(false);
    }
  }

  function restart() {
    setScreen("setup");
    setQuestions([]);
    setAnswered([]);
    setAnswer("");
    setFeedback(null);
    setCurrent(0);
  }

  const avgScore = answered.length
    ? Math.round(answered.reduce((s, q) => s + q.feedback.score, 0) / answered.length)
    : 0;

  // ─── Setup Screen ─────────────────────────────────────────────────
  if (screen === "setup") return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-pink-500" /> Interview Prep
        </h1>
        <p className="mt-1 text-sm text-gray-500">Practice with AI-generated questions. Get instant feedback.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">

        {/* Company + Role */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5 mb-1">
              <Building2 className="h-3.5 w-3.5" /> Company *
            </label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5 mb-1">
              <Briefcase className="h-3.5 w-3.5" /> Role *
            </label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Frontend Engineer" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-2 block">Interview Type</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {INTERVIEW_TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => setType(t.key)}
                className={cn(
                  "flex flex-col items-center rounded-xl border p-3 text-center transition-all",
                  interviewType === t.key
                    ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="mt-1 text-xs font-semibold text-gray-800">{t.label}</span>
                <span className="text-xs text-gray-400 leading-tight">{t.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Resume + JD (optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Resume <span className="text-gray-400">(optional — improves questions)</span></label>
            <textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste resume text..." className="w-full h-32 rounded-xl border border-gray-200 p-3 text-sm placeholder:text-gray-300 resize-none focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Job Description <span className="text-gray-400">(optional)</span></label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste job description..." className="w-full h-32 rounded-xl border border-gray-200 p-3 text-sm placeholder:text-gray-300 resize-none focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
          </div>
        </div>

        {error && <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={startInterview}
          disabled={loadingQ}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600 disabled:opacity-60 transition-colors shadow-sm"
        >
          {loadingQ
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating Questions...</>
            : <><Sparkles className="h-4 w-4" /> Start Mock Interview</>}
        </button>
      </div>
    </div>
  );

  // ─── Interview Screen ──────────────────────────────────────────────
  if (screen === "interview") {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;
    const isAnswered = answered.some(a => a.id === q.id);

    return (
      <div className="max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">{company} — {role}</p>
            <p className="text-xs text-gray-400 capitalize">{interviewType.replace("_", " ")} Interview</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{current + 1} <span className="text-gray-400 font-normal">/ {questions.length}</span></p>
            <p className="text-xs text-gray-400">questions</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div className="h-1.5 rounded-full bg-pink-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Question card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", difficultyStyles[q.difficulty])}>
                {q.difficulty}
              </span>
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 capitalize">
                {q.type.replace("_", " ")}
              </span>
            </div>
            <span className="text-xs text-gray-400">Q{current + 1}</span>
          </div>

          <p className="text-base font-semibold text-gray-900 leading-relaxed">{q.question}</p>

          {/* Answer textarea */}
          {!feedback && (
            <div className="space-y-3">
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Type your answer here... Take your time, think through it like a real interview."
                className="w-full h-40 rounded-xl border border-gray-200 p-4 text-sm text-gray-800 placeholder:text-gray-300 resize-none focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showHint ? "Hide hint" : "💡 Show hint"}
                </button>
                <button
                  onClick={submitAnswer}
                  disabled={loadingF || !answer.trim()}
                  className="flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-600 disabled:opacity-50 transition-colors"
                >
                  {loadingF
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</>
                    : <><Send className="h-4 w-4" /> Submit Answer</>}
                </button>
              </div>
              {showHint && (
                <div className="rounded-xl bg-yellow-50 border border-yellow-100 px-4 py-3">
                  <p className="text-xs font-semibold text-yellow-700 mb-1">💡 Hint</p>
                  <p className="text-xs text-yellow-600">{q.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="space-y-4 pt-2">
              {/* Your answer (collapsed) */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Your Answer</p>
                <p className="text-sm text-gray-700">{answer}</p>
              </div>

              {/* Verdict */}
              {(() => {
                const vs = verdictStyles[feedback.verdict] ?? verdictStyles["Decent Answer"];
                const Icon = vs.icon;
                return (
                  <div className={cn("rounded-xl border p-4 flex items-center gap-3", vs.bg)}>
                    <Icon className={cn("h-5 w-5 shrink-0", vs.color)} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={cn("text-sm font-bold", vs.color)}>{feedback.verdict}</p>
                        <span className={cn("text-2xl font-black", vs.color)}>{feedback.score}<span className="text-sm font-normal">/100</span></span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Strengths + Improvements */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="text-xs font-bold text-green-700 mb-2">✅ What you did well</p>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <p className="text-xs font-bold text-orange-700 mb-2">⚠️ Improve next time</p>
                  <ul className="space-y-1">
                    {feedback.improvements.map((s, i) => (
                      <li key={i} className="text-xs text-orange-700 flex items-start gap-1.5">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Better answer */}
              <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-bold text-violet-700 mb-1">💡 Stronger answer would include</p>
                <p className="text-xs text-violet-700">{feedback.betterAnswer}</p>
              </div>

              {/* Follow-up + Next */}
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-gray-400 italic">Follow-up: &ldquo;{q.followUp}&rdquo;</p>
                <button
                  onClick={nextQuestion}
                  className="flex items-center gap-2 rounded-xl bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
                >
                  {current + 1 >= questions.length ? "See Results" : "Next Question"}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current ? "w-6 bg-pink-500" :
                answered.some(a => a.id === questions[i].id) ? "w-2 bg-green-400" :
                "w-2 bg-gray-200"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── Results Screen ────────────────────────────────────────────────
  if (screen === "results") {
    const scoreColor = avgScore >= 75 ? "text-green-600" : avgScore >= 50 ? "text-yellow-600" : "text-red-500";
    const scoreLabel = avgScore >= 75 ? "Strong Performance! 🎉" : avgScore >= 50 ? "Decent effort 👍" : "Keep practicing 💪";

    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" /> Interview Results
          </h1>
          <p className="mt-1 text-sm text-gray-500">{company} — {role}</p>
        </div>

        {/* Score card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
          <p className={cn("text-6xl font-black", scoreColor)}>{avgScore}</p>
          <p className="text-gray-400 text-sm mt-1">Average Score / 100</p>
          <p className="mt-2 text-base font-semibold text-gray-800">{scoreLabel}</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-gray-900">{answered.length}</p>
              <p className="text-xs text-gray-400">Questions answered</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-600">{answered.filter(a => a.feedback.score >= 75).length}</p>
              <p className="text-xs text-gray-400">Good answers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-red-500">{answered.filter(a => a.feedback.score < 50).length}</p>
              <p className="text-xs text-gray-400">Need work</p>
            </div>
          </div>
        </div>

        {/* Question breakdown */}
        <div className="space-y-3">
          {answered.map((q, i) => {
            const vs = verdictStyles[q.feedback.verdict] ?? verdictStyles["Decent Answer"];
            const Icon = vs.icon;
            return (
              <div key={q.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Q{i + 1}</p>
                    <p className="text-sm font-semibold text-gray-900">{q.question}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Icon className={cn("h-4 w-4", vs.color)} />
                    <span className={cn("text-lg font-black", vs.color)}>{q.feedback.score}</span>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
                  <p className="text-xs font-semibold text-violet-700 mb-1">💡 Key tip</p>
                  <p className="text-xs text-violet-600">{q.feedback.tips}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={restart}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Practice Again
          </button>
          <button
            onClick={() => { setScreen("interview"); setCurrent(0); setAnswered([]); setAnswer(""); setFeedback(null); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white hover:bg-pink-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Retry Same Questions
          </button>
        </div>
      </div>
    );
  }
}
