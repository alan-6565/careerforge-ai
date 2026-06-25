"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Zap,
  Mail,
  Kanban,
  MessageSquare,
  Map,
  Flame,
  Sparkles,
  Settings,
  Bookmark,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/optimizer", label: "ATS Checker", icon: Zap },
  { href: "/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/interview", label: "Interview Prep", icon: MessageSquare },
  { href: "/tracker", label: "Job Tracker", icon: Kanban },
  { href: "/roadmap", label: "Career Insights", icon: Map },
  { href: "/roast", label: "Resume Roast", icon: Flame },
];

const bottom = [
  { href: "/saved", label: "Saved Jobs", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-gray-900">CareerForge</span>
        <span className="text-base font-bold text-violet-600">AI</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-violet-50 text-violet-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0", pathname === href ? "text-violet-600" : "text-gray-400")} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
        {bottom.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <Icon className="h-4 w-4 shrink-0 text-gray-400" />
            {label}
          </Link>
        ))}
      </div>

      {/* Upgrade Banner */}
      <div className="mx-3 mb-3 rounded-xl bg-violet-600 p-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Upgrade to Pro</p>
        <p className="mt-1 text-xs opacity-70">Unlock AI insights, unlimited resumes, and more.</p>
        <button className="mt-3 w-full rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors">
          Upgrade Now
        </button>
      </div>

      {/* User */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">My Account</p>
            <p className="truncate text-xs text-gray-400">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
