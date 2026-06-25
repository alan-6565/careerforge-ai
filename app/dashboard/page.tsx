import { currentUser } from "@clerk/nextjs/server";
import {
  FileText, Zap, Mail, MessageSquare,
  TrendingUp, ArrowRight, Clock, Star,
} from "lucide-react";
import Link from "next/link";
import ActivityChart from "@/components/ActivityChart";

const stats = [
  { label: "Resume Score", value: "85", unit: "/100", trend: "Great! Keep improving.", color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Jobs Applied", value: "24", unit: "This Month", trend: "+8 this week", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Interviews", value: "6", unit: "This Month", trend: "+2 this week", color: "text-green-600", bg: "bg-green-50" },
  { label: "Offers", value: "1", unit: "Total", trend: "Keep it up! 🎉", color: "text-orange-600", bg: "bg-orange-50" },
];

const tools = [
  { href: "/resume", icon: FileText, label: "Resume Builder", time: "Used 2 days ago", color: "bg-violet-100 text-violet-600" },
  { href: "/optimizer", icon: Zap, label: "ATS Checker", time: "Used 3 days ago", color: "bg-yellow-100 text-yellow-600" },
  { href: "/cover-letter", icon: Mail, label: "Cover Letter", time: "Used 4 days ago", color: "bg-green-100 text-green-600" },
  { href: "/interview", icon: MessageSquare, label: "Interview Prep", time: "Used 5 days ago", color: "bg-pink-100 text-pink-600" },
];

const activity = [
  { text: "Resume updated", time: "2 hours ago", icon: FileText },
  { text: "Applied to Google — SDE Intern", time: "1 day ago", icon: TrendingUp },
  { text: "ATS Score improved: 72 → 85", time: "3 days ago", icon: Star },
  { text: "Interview practice completed", time: "5 days ago", icon: MessageSquare },
];

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName} 👋
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Let&apos;s continue building your dream career.
          </p>
        </div>
        <Link
          href="/resume"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <FileText className="h-4 w-4" />
          Resume Score
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, unit, trend, color, bg }) => (
          <div key={label} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${color}`}>{value}</span>
              <span className="text-xs text-gray-400">{unit}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">{trend}</p>
          </div>
        ))}
      </div>

      {/* Chart + Next Step */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Your Career Progress</h2>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <ActivityChart />
        </div>

        {/* Next Step */}
        <div className="rounded-xl border border-violet-100 bg-violet-50 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-violet-900">Next Step Recommendation</h2>
          <div className="mt-3 rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-900">Your resume can be stronger!</p>
            <p className="mt-1 text-xs text-gray-500">
              Get AI-powered feedback to improve your chances with top companies.
            </p>
            <Link
              href="/optimizer"
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
            >
              Improve Resume <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-violet-800">Quick tips:</p>
            <ul className="space-y-1">
              {["Add measurable achievements", "Include more keywords", "Quantify your impact"].map(tip => (
                <li key={tip} className="flex items-start gap-1.5 text-xs text-violet-700">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Tools + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recently Used Tools */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Recently Used Tools</h2>
          <div className="space-y-3">
            {tools.map(({ href, icon: Icon, label, time, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 transition-colors"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{time}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map(({ text, time, icon: Icon }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 shrink-0">
                  <Icon className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">{text}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
