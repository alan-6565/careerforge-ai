"use client";

import { useState } from "react";
import {
  Plus, ExternalLink, MoreHorizontal, Calendar,
  DollarSign, Building2, Briefcase, LayoutGrid, List,
  ChevronDown, X, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Stage =
  | "interested"
  | "applied"
  | "assessment"
  | "phone_screen"
  | "interview"
  | "final_round"
  | "offer"
  | "rejected";

type Job = {
  id: string;
  company: string;
  role: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  stage: Stage;
  appliedDate: string;
  jobUrl?: string;
  notes?: string;
  logo?: string;
};

const STAGES: { key: Stage; label: string; color: string; bg: string; dot: string }[] = [
  { key: "interested",   label: "Interested",    color: "text-gray-600",   bg: "bg-gray-100",    dot: "bg-gray-400"   },
  { key: "applied",      label: "Applied",       color: "text-blue-700",   bg: "bg-blue-100",    dot: "bg-blue-500"   },
  { key: "assessment",   label: "Assessment",    color: "text-yellow-700", bg: "bg-yellow-100",  dot: "bg-yellow-500" },
  { key: "phone_screen", label: "Phone Screen",  color: "text-purple-700", bg: "bg-purple-100",  dot: "bg-purple-500" },
  { key: "interview",    label: "Interview",     color: "text-indigo-700", bg: "bg-indigo-100",  dot: "bg-indigo-500" },
  { key: "final_round",  label: "Final Round",   color: "text-pink-700",   bg: "bg-pink-100",    dot: "bg-pink-500"   },
  { key: "offer",        label: "Offer 🎉",      color: "text-green-700",  bg: "bg-green-100",   dot: "bg-green-500"  },
  { key: "rejected",     label: "Rejected",      color: "text-red-700",    bg: "bg-red-100",     dot: "bg-red-400"    },
];

const SAMPLE_JOBS: Job[] = [
  { id: "1", company: "Google",    role: "Software Engineer Intern", location: "Mountain View, CA", stage: "interview",   appliedDate: "2026-06-10", salaryMin: 8000,  salaryMax: 9000  },
  { id: "2", company: "Microsoft", role: "Frontend Developer",       location: "Remote",            stage: "applied",     appliedDate: "2026-06-15", salaryMin: 7000,  salaryMax: 8500  },
  { id: "3", company: "Amazon",    role: "SDE Intern",               location: "Seattle, WA",       stage: "assessment",  appliedDate: "2026-06-18", salaryMin: 8500,  salaryMax: 9500  },
  { id: "4", company: "Adobe",     role: "Web Developer",            location: "San Jose, CA",      stage: "interview",   appliedDate: "2026-06-12", salaryMin: 6500,  salaryMax: 7500  },
  { id: "5", company: "Flipkart",  role: "Frontend Intern",          location: "Remote",            stage: "applied",     appliedDate: "2026-06-08"                                     },
  { id: "6", company: "Apple",     role: "Software Engineer",        location: "Cupertino, CA",     stage: "final_round", appliedDate: "2026-06-01", salaryMin: 12000, salaryMax: 15000 },
  { id: "7", company: "Meta",      role: "React Native Engineer",    location: "Menlo Park, CA",    stage: "offer",       appliedDate: "2026-05-20", salaryMin: 13000, salaryMax: 16000 },
  { id: "8", company: "Tesla",     role: "Frontend Engineer",        location: "Austin, TX",        stage: "rejected",    appliedDate: "2026-05-25"                                     },
];

const stageMap = Object.fromEntries(STAGES.map((s) => [s.key, s]));

function StageBadge({ stage }: { stage: Stage }) {
  const s = stageMap[stage];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.bg, s.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function AddJobModal({ onClose, onAdd }: { onClose: () => void; onAdd: (job: Job) => void }) {
  const [form, setForm] = useState({ company: "", role: "", location: "", stage: "applied" as Stage, appliedDate: new Date().toISOString().split("T")[0], salaryMin: "", salaryMax: "", jobUrl: "", notes: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.role) return;
    onAdd({
      id: Math.random().toString(36).slice(2),
      company: form.company,
      role: form.role,
      location: form.location,
      stage: form.stage,
      appliedDate: form.appliedDate,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      jobUrl: form.jobUrl,
      notes: form.notes,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Add Job Application</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 transition-colors"><X className="h-4 w-4 text-gray-500" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Company *</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Role *</label>
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Frontend Engineer" required className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Remote" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Status</label>
              <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as Stage })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100">
                {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Applied Date</label>
              <input type="date" value={form.appliedDate} onChange={e => setForm({ ...form, appliedDate: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Min Salary</label>
              <input type="number" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} placeholder="$" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Max Salary</label>
              <input type="number" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} placeholder="$" className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Job URL</label>
            <input value={form.jobUrl} onChange={e => setForm({ ...form, jobUrl: e.target.value })} placeholder="https://..." className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">Add Job</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function KanbanView({ jobs, onStageChange }: { jobs: Job[]; onStageChange: (id: string, stage: Stage) => void }) {
  const columns = STAGES.slice(0, 6); // show first 6 columns
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(col => {
        const colJobs = jobs.filter(j => j.stage === col.key);
        return (
          <div key={col.key} className="w-64 shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <span className={cn("flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide", col.color)}>
                <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                {col.label}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">{colJobs.length}</span>
            </div>
            <div className="space-y-2">
              {colJobs.map(job => (
                <div key={job.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-violet-200 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                      {job.company[0]}
                    </div>
                    <select
                      value={job.stage}
                      onChange={e => onStageChange(job.id, e.target.value as Stage)}
                      className="text-xs text-gray-400 border-none bg-transparent focus:outline-none cursor-pointer"
                    >
                      {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{job.role}</p>
                  <p className="text-xs text-gray-500">{job.company}</p>
                  {job.salaryMin && (
                    <p className="mt-2 text-xs text-green-600 font-medium">
                      ${job.salaryMin.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">{format(new Date(job.appliedDate), "MMM d, yyyy")}</p>
                </div>
              ))}
              {colJobs.length === 0 && (
                <div className="rounded-xl border-2 border-dashed border-gray-100 p-4 text-center text-xs text-gray-300">
                  No applications
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function TrackerPage() {
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);
  const [view, setView] = useState<"table" | "board">("table");
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<Stage | "all">("all");

  const filtered = jobs.filter(j => {
    const matchSearch = j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === "all" || j.stage === filterStage;
    return matchSearch && matchStage;
  });

  function addJob(job: Job) { setJobs(prev => [job, ...prev]); }
  function updateStage(id: string, stage: Stage) { setJobs(prev => prev.map(j => j.id === id ? { ...j, stage } : j)); }
  function removeJob(id: string) { setJobs(prev => prev.filter(j => j.id !== id)); }

  // Stats
  const total = jobs.length;
  const inProgress = jobs.filter(j => !["rejected", "offer"].includes(j.stage)).length;
  const interviews = jobs.filter(j => ["interview", "final_round"].includes(j.stage)).length;
  const offers = jobs.filter(j => j.stage === "offer").length;
  const rejected = jobs.filter(j => j.stage === "rejected").length;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-violet-500" /> Job Tracker
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">Track your applications and never miss an opportunity.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total Applications", value: total, color: "text-gray-900" },
          { label: "In Progress", value: inProgress, color: "text-blue-600" },
          { label: "Interviews", value: interviews, color: "text-indigo-600" },
          { label: "Offers", value: offers, color: "text-green-600" },
          { label: "Rejected", value: rejected, color: "text-red-500" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm text-center">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="mt-0.5 text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <div className="relative">
          <select
            value={filterStage}
            onChange={e => setFilterStage(e.target.value as Stage | "all")}
            className="appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-4 pr-8 text-sm text-gray-600 focus:border-violet-400 focus:outline-none"
          >
            <option value="all">All Stages</option>
            {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button onClick={() => setView("table")} className={cn("flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors", view === "table" ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:text-gray-700")}>
            <List className="h-4 w-4" /> Table
          </button>
          <button onClick={() => setView("board")} className={cn("flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-l border-gray-200", view === "board" ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:text-gray-700")}>
            <LayoutGrid className="h-4 w-4" /> Board
          </button>
        </div>
      </div>

      {/* Table View */}
      {view === "table" && (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Company</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Applied On</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Salary</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Next Step</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                        {job.company[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{job.company}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />{job.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{job.role}</td>
                  <td className="px-4 py-3">
                    <select
                      value={job.stage}
                      onChange={e => updateStage(job.id, e.target.value as Stage)}
                      className="border-none bg-transparent text-xs font-medium focus:outline-none cursor-pointer p-0"
                    >
                      {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(job.appliedDate), "MMM d, yyyy")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {job.salaryMin ? (
                      <span className="flex items-center gap-0.5 text-green-600 font-medium">
                        <DollarSign className="h-3 w-3" />
                        {(job.salaryMin / 1000).toFixed(0)}k – {(job.salaryMax! / 1000).toFixed(0)}k
                      </span>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {job.stage === "applied" ? "Phone Screen" :
                      job.stage === "phone_screen" ? "Technical Interview" :
                        job.stage === "interview" ? "Final Round" :
                          job.stage === "final_round" ? "Awaiting Offer" :
                            job.stage === "offer" ? "🎉 Congrats!" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {job.jobUrl && (
                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="rounded p-1 hover:bg-gray-100 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                        </a>
                      )}
                      <button onClick={() => removeJob(job.id)} className="rounded p-1 hover:bg-red-50 transition-colors">
                        <MoreHorizontal className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400">
                    No applications found. Add your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="border-t border-gray-100 px-4 py-3 text-xs text-gray-400">
            Showing {filtered.length} of {jobs.length} applications
          </div>
        </div>
      )}

      {/* Board View */}
      {view === "board" && (
        <KanbanView jobs={filtered} onStageChange={updateStage} />
      )}

      {showModal && <AddJobModal onClose={() => setShowModal(false)} onAdd={addJob} />}
    </div>
  );
}
