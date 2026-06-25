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
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/optimizer", label: "ATS Optimizer", icon: Zap },
  { href: "/cover-letter", label: "Cover Letter", icon: Mail },
  { href: "/tracker", label: "Job Tracker", icon: Kanban },
  { href: "/interview", label: "Interview Prep", icon: MessageSquare },
  { href: "/roadmap", label: "Career Roadmap", icon: Map },
  { href: "/roast", label: "Resume Roast 🔥", icon: Flame },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Sparkles className="h-5 w-5 text-violet-400" />
        <span className="text-lg font-bold text-white">CareerForge</span>
        <span className="text-lg font-bold text-violet-400">AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-violet-600 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <UserButton
            appearance={{
              elements: { avatarBox: "h-9 w-9" },
            }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">My Account</p>
            <p className="truncate text-xs text-gray-400">Manage profile</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
