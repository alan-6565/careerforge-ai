import { auth, currentUser } from "@clerk/nextjs/server";
import {
  FileText,
  Zap,
  Mail,
  Kanban,
  MessageSquare,
  Map,
  Flame,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    href: "/resume",
    icon: FileText,
    label: "Resume Builder",
    description: "Create a polished, ATS-ready resume",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    href: "/optimizer",
    icon: Zap,
    label: "ATS Optimizer",
    description: "Match your resume to any job description",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    href: "/cover-letter",
    icon: Mail,
    label: "Cover Letter",
    description: "Generate personalized cover letters in seconds",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    href: "/tracker",
    icon: Kanban,
    label: "Job Tracker",
    description: "Track every application in a Kanban board",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    href: "/interview",
    icon: MessageSquare,
    label: "Interview Prep",
    description: "Practice with AI-generated questions",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    href: "/roadmap",
    icon: Map,
    label: "Career Roadmap",
    description: "Get a month-by-month plan to your dream job",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    href: "/roast",
    icon: Flame,
    label: "Resume Roast 🔥",
    description: "Brutally honest AI feedback on your resume",
    color: "text-red-400",
    bg: "bg-red-400/10",
  },
];

const stats = [
  { label: "Resume Score", value: "—", icon: Award, color: "text-violet-400" },
  { label: "Applications", value: "0", icon: Target, color: "text-blue-400" },
  { label: "Interviews", value: "0", icon: TrendingUp, color: "text-green-400" },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-gray-400">
          Your AI-powered career operating system. Let&apos;s land that dream
          job.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-gray-900 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{label}</p>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          What do you want to work on?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ href, icon: Icon, label, description, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-white/10 bg-gray-900 p-5 transition-all hover:border-violet-500/50 hover:bg-gray-800"
            >
              <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                {label}
              </h3>
              <p className="mt-1 text-sm text-gray-400">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
