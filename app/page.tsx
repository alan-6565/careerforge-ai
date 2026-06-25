import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Zap, FileText, MessageSquare } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
        <Sparkles className="h-3.5 w-3.5" />
        AI-Powered Career Platform
      </div>

      {/* Headline */}
      <h1 className="max-w-3xl text-5xl font-bold leading-tight text-white sm:text-6xl">
        Land your{" "}
        <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          dream job
        </span>{" "}
        with AI
      </h1>

      <p className="mt-6 max-w-xl text-lg text-gray-400">
        CareerForge AI is your all-in-one career operating system. Build
        resumes, optimize for ATS, prep for interviews, and track every
        application — all powered by Claude AI.
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/sign-up"
          className="rounded-xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-violet-500"
        >
          Get Started Free
        </Link>
        <Link
          href="/sign-in"
          className="rounded-xl border border-white/10 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-white/5"
        >
          Sign In
        </Link>
      </div>

      {/* Features preview */}
      <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl w-full">
        {[
          { icon: FileText, title: "ATS Resume Builder", desc: "Beat the bots with AI-optimized resumes" },
          { icon: Zap, title: "Job Match Engine", desc: "See how well you match any job posting" },
          { icon: MessageSquare, title: "Mock Interviews", desc: "Practice with an AI interviewer 24/7" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-xl border border-white/10 bg-gray-900 p-5 text-left">
            <Icon className="mb-3 h-5 w-5 text-violet-400" />
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
