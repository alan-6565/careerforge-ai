"use client";

import { useState } from "react";
import {
  User, FileText, Briefcase, GraduationCap,
  Star, FolderOpen, Award, Plus, Trash2,
  Download, Eye, ChevronRight, ChevronLeft, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
type Experience = {
  id: string; company: string; role: string;
  location: string; startDate: string; endDate: string;
  current: boolean; bullets: string[];
};
type Education = {
  id: string; school: string; degree: string;
  location: string; startDate: string; endDate: string; notes: string;
};
type ResumeData = {
  // Personal
  firstName: string; lastName: string; title: string;
  email: string; phone: string; location: string; linkedin: string; website: string;
  // Sections
  summary: string;
  expertise: string; // comma separated
  experience: Experience[];
  education: Education[];
  skills: string;
  projects: string;
};

const EMPTY: ResumeData = {
  firstName: "JAHIR", lastName: "CRISOSTOMO", title: "Front End Engineer",
  email: "jahircrisostomo@gmail.com", phone: "(510) 367-8417",
  location: "Richmond, CA 94804", linkedin: "linkedin.com/in/jahir-crisostomo-167917232",
  website: "",
  summary: "Motivated Frontend Engineer with hands-on experience building modern web applications using React.js, JavaScript, and Tailwind CSS. Currently an intern at Apple working on the Marcom Engineering team.",
  expertise: "React.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Node.js, Git, REST APIs, Python",
  experience: [
    {
      id: "1", company: "APPLE", role: "Front End Engineer Contractor",
      location: "Sunnyvale, CA", startDate: "Jan. 2026", endDate: "", current: true,
      bullets: [
        "Fixed broken video rendering issues on starting pages and resolved name change problems to improve user experience and functionality.",
        "Collaborated with team of 6 engineers to design, build, and test software solutions that met user needs and business goals.",
        "Worked with Git, VS Code, and specialized Apple tools daily to write code, track changes, and build software features.",
      ],
    },
    {
      id: "2", company: "AMAZON", role: "Warehouse",
      location: "Richmond, CA", startDate: "Jan. 2024", endDate: "Present", current: false,
      bullets: [
        "Used iPad technology to monitor robot status and identify issues, applying technical skills to maintain warehouse automation systems.",
        "Participated in shipping process improvements, reducing delivery times for drivers through efficient packaging methods.",
      ],
    },
  ],
  education: [
    {
      id: "1", school: "CONTRA COSTA COLLEGE", degree: "Computer Science",
      location: "Richmond, CA", startDate: "2022", endDate: "Present",
      notes: "Completed coursework in computer science. Learned Python and C.",
    },
  ],
  skills: "HTML, CSS, JavaScript, React.js, Tailwind CSS, Git, REST APIs, Figma, Python, Node.js",
  projects: "",
};

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { key: "personal",    label: "Personal Info",  icon: User         },
  { key: "summary",     label: "Summary",        icon: FileText     },
  { key: "experience",  label: "Experience",     icon: Briefcase    },
  { key: "education",   label: "Education",      icon: GraduationCap},
  { key: "skills",      label: "Skills",         icon: Star         },
  { key: "projects",    label: "Projects",       icon: FolderOpen   },
];

// ─── Resume Preview ───────────────────────────────────────────────────────────
function ResumePreview({ data }: { data: ResumeData }) {
  return (
    <div
      id="resume-preview"
      className="bg-white text-black font-serif"
      style={{ fontFamily: "Times New Roman, serif", fontSize: "11px", lineHeight: "1.4", padding: "36px 40px", minHeight: "792px", width: "100%" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", fontFamily: "Arial, sans-serif", letterSpacing: "1px", margin: 0 }}>
          {data.firstName} {data.lastName}
        </h1>
        <div style={{ textAlign: "right", fontSize: "10px", lineHeight: "1.6" }}>
          {data.linkedin && <div>{data.linkedin}</div>}
          {data.email && <div>{data.email}</div>}
          {data.location && <div>{data.location}</div>}
          {data.phone && <div>{data.phone}</div>}
        </div>
      </div>
      <div style={{ borderBottom: "2px solid black", marginBottom: "10px" }} />

      {/* Summary */}
      {data.summary && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "4px" }}>
            Career Summary.
          </div>
          <div style={{ borderBottom: "1px solid black", marginBottom: "5px" }} />
          <p style={{ margin: 0 }}>{data.summary}</p>
        </div>
      )}

      {/* Expertise */}
      {data.expertise && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>
            Areas of Expertise
          </div>
          <div style={{ borderBottom: "1px solid black", marginBottom: "5px" }} />
          <div style={{ textAlign: "center" }}>
            {data.expertise.split(",").map(s => s.trim()).filter(Boolean).join(" | ")}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>
            Professional Experience
          </div>
          <div style={{ borderBottom: "1px solid black", marginBottom: "6px" }} />
          {data.experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold", textTransform: "uppercase", fontFamily: "Arial, sans-serif" }}>{exp.company}</span>
                <span>{exp.location}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{exp.role}</span>
                <span>{exp.startDate}{exp.current ? " – Present" : exp.endDate ? ` – ${exp.endDate}` : ""}</span>
              </div>
              <ul style={{ margin: "3px 0 0 16px", padding: 0 }}>
                {exp.bullets.filter(b => b.trim()).map((b, i) => (
                  <li key={i} style={{ marginBottom: "2px" }}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>
            Education &amp; Training
          </div>
          <div style={{ borderBottom: "1px solid black", marginBottom: "6px" }} />
          {data.education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold", textTransform: "uppercase", fontFamily: "Arial, sans-serif" }}>{edu.school}</span>
                <span>{edu.location}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>{edu.degree}</span>
                <span>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ""}</span>
              </div>
              {edu.notes && <p style={{ margin: "2px 0 0 0" }}>{edu.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>
            Technical Skills
          </div>
          <div style={{ borderBottom: "1px solid black", marginBottom: "5px" }} />
          <p style={{ margin: 0 }}>{data.skills}</p>
        </div>
      )}

      {/* Projects */}
      {data.projects && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>
            Projects
          </div>
          <div style={{ borderBottom: "1px solid black", marginBottom: "5px" }} />
          <p style={{ margin: 0, whiteSpace: "pre-line" }}>{data.projects}</p>
        </div>
      )}
    </div>
  );
}

// ─── Form Sections ────────────────────────────────────────────────────────────
function PersonalForm({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const f = (key: keyof ResumeData, val: string) => onChange({ ...data, [key]: val });
  const input = "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">First Name</label><input value={data.firstName} onChange={e => f("firstName", e.target.value)} className={cn(input, "mt-1")} /></div>
        <div><label className="text-xs font-medium text-gray-600">Last Name</label><input value={data.lastName} onChange={e => f("lastName", e.target.value)} className={cn(input, "mt-1")} /></div>
      </div>
      <div><label className="text-xs font-medium text-gray-600">Professional Title</label><input value={data.title} onChange={e => f("title", e.target.value)} placeholder="e.g. Frontend Engineer" className={cn(input, "mt-1")} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600">Email</label><input value={data.email} onChange={e => f("email", e.target.value)} className={cn(input, "mt-1")} /></div>
        <div><label className="text-xs font-medium text-gray-600">Phone</label><input value={data.phone} onChange={e => f("phone", e.target.value)} className={cn(input, "mt-1")} /></div>
      </div>
      <div><label className="text-xs font-medium text-gray-600">Location</label><input value={data.location} onChange={e => f("location", e.target.value)} placeholder="City, State ZIP" className={cn(input, "mt-1")} /></div>
      <div><label className="text-xs font-medium text-gray-600">LinkedIn URL</label><input value={data.linkedin} onChange={e => f("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" className={cn(input, "mt-1")} /></div>
      <div><label className="text-xs font-medium text-gray-600">Website / GitHub</label><input value={data.website} onChange={e => f("website", e.target.value)} placeholder="github.com/yourname" className={cn(input, "mt-1")} /></div>
    </div>
  );
}

function SummaryForm({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-600">Career Summary</label>
        <p className="text-xs text-gray-400 mt-0.5">2-3 sentences. Who you are, what you do, what you're looking for.</p>
        <textarea
          value={data.summary}
          onChange={e => onChange({ ...data, summary: e.target.value })}
          rows={5}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-gray-600">Areas of Expertise</label>
        <p className="text-xs text-gray-400 mt-0.5">Comma-separated skills shown as a horizontal list (e.g. React, TypeScript, Node.js)</p>
        <textarea
          value={data.expertise}
          onChange={e => onChange({ ...data, expertise: e.target.value })}
          rows={3}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none"
        />
      </div>
    </div>
  );
}

function ExperienceForm({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  function addExp() {
    onChange({
      ...data,
      experience: [...data.experience, {
        id: Math.random().toString(36).slice(2),
        company: "", role: "", location: "",
        startDate: "", endDate: "", current: false, bullets: [""],
      }],
    });
  }
  function updateExp(id: string, key: keyof Experience, val: string | boolean | string[]) {
    onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, [key]: val } : e) });
  }
  function removeExp(id: string) { onChange({ ...data, experience: data.experience.filter(e => e.id !== id) }); }
  function addBullet(id: string) { const exp = data.experience.find(e => e.id === id)!; updateExp(id, "bullets", [...exp.bullets, ""]); }
  function updateBullet(id: string, idx: number, val: string) {
    const exp = data.experience.find(e => e.id === id)!;
    const bullets = exp.bullets.map((b, i) => i === idx ? val : b);
    updateExp(id, "bullets", bullets);
  }
  function removeBullet(id: string, idx: number) {
    const exp = data.experience.find(e => e.id === id)!;
    updateExp(id, "bullets", exp.bullets.filter((_, i) => i !== idx));
  }

  const input = "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";

  return (
    <div className="space-y-5">
      {data.experience.map((exp, idx) => (
        <div key={exp.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Experience {idx + 1}</span>
            <button onClick={() => removeExp(exp.id)} className="text-red-400 hover:text-red-600 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600">Company</label><input value={exp.company} onChange={e => updateExp(exp.id, "company", e.target.value)} placeholder="e.g. APPLE" className={cn(input, "mt-1")} /></div>
            <div><label className="text-xs font-medium text-gray-600">Role</label><input value={exp.role} onChange={e => updateExp(exp.id, "role", e.target.value)} placeholder="e.g. Frontend Engineer" className={cn(input, "mt-1")} /></div>
          </div>
          <div><label className="text-xs font-medium text-gray-600">Location</label><input value={exp.location} onChange={e => updateExp(exp.id, "location", e.target.value)} placeholder="City, State" className={cn(input, "mt-1")} /></div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div><label className="text-xs font-medium text-gray-600">Start Date</label><input value={exp.startDate} onChange={e => updateExp(exp.id, "startDate", e.target.value)} placeholder="Jan. 2025" className={cn(input, "mt-1")} /></div>
            <div><label className="text-xs font-medium text-gray-600">End Date</label><input value={exp.endDate} onChange={e => updateExp(exp.id, "endDate", e.target.value)} placeholder="Dec. 2025" disabled={exp.current} className={cn(input, "mt-1 disabled:opacity-40")} /></div>
            <div className="flex items-center gap-2 pb-2">
              <input type="checkbox" id={`curr-${exp.id}`} checked={exp.current} onChange={e => updateExp(exp.id, "current", e.target.checked)} className="accent-violet-600" />
              <label htmlFor={`curr-${exp.id}`} className="text-xs font-medium text-gray-600">Current</label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Bullet Points</label>
            <div className="mt-2 space-y-2">
              {exp.bullets.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input value={b} onChange={e => updateBullet(exp.id, i, e.target.value)} placeholder={`Achievement ${i + 1}...`} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100" />
                  <button onClick={() => removeBullet(exp.id, i)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => addBullet(exp.id)} className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add bullet point
              </button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addExp} className="flex items-center gap-2 w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors justify-center">
        <Plus className="h-4 w-4" /> Add Experience
      </button>
    </div>
  );
}

function EducationForm({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  function addEdu() {
    onChange({ ...data, education: [...data.education, { id: Math.random().toString(36).slice(2), school: "", degree: "", location: "", startDate: "", endDate: "", notes: "" }] });
  }
  function updateEdu(id: string, key: keyof Education, val: string) {
    onChange({ ...data, education: data.education.map(e => e.id === id ? { ...e, [key]: val } : e) });
  }
  function removeEdu(id: string) { onChange({ ...data, education: data.education.filter(e => e.id !== id) }); }
  const input = "w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100";
  return (
    <div className="space-y-4">
      {data.education.map((edu, idx) => (
        <div key={edu.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">Education {idx + 1}</span>
            <button onClick={() => removeEdu(edu.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div><label className="text-xs font-medium text-gray-600">School / Institution</label><input value={edu.school} onChange={e => updateEdu(edu.id, "school", e.target.value)} placeholder="e.g. CONTRA COSTA COLLEGE" className={cn(input, "mt-1")} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600">Degree / Program</label><input value={edu.degree} onChange={e => updateEdu(edu.id, "degree", e.target.value)} placeholder="Computer Science" className={cn(input, "mt-1")} /></div>
            <div><label className="text-xs font-medium text-gray-600">Location</label><input value={edu.location} onChange={e => updateEdu(edu.id, "location", e.target.value)} placeholder="City, State" className={cn(input, "mt-1")} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-medium text-gray-600">Start Year</label><input value={edu.startDate} onChange={e => updateEdu(edu.id, "startDate", e.target.value)} placeholder="2022" className={cn(input, "mt-1")} /></div>
            <div><label className="text-xs font-medium text-gray-600">End Year</label><input value={edu.endDate} onChange={e => updateEdu(edu.id, "endDate", e.target.value)} placeholder="Present" className={cn(input, "mt-1")} /></div>
          </div>
          <div><label className="text-xs font-medium text-gray-600">Notes</label><textarea value={edu.notes} onChange={e => updateEdu(edu.id, "notes", e.target.value)} rows={2} placeholder="Relevant coursework, achievements..." className={cn(input, "mt-1 resize-none")} /></div>
        </div>
      ))}
      <button onClick={addEdu} className="flex items-center gap-2 w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-medium text-gray-400 hover:border-violet-300 hover:text-violet-600 transition-colors justify-center">
        <Plus className="h-4 w-4" /> Add Education
      </button>
    </div>
  );
}

function SkillsForm({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-600">Technical Skills</label>
        <p className="text-xs text-gray-400 mt-0.5">Comma-separated list of your technical skills</p>
        <textarea value={data.skills} onChange={e => onChange({ ...data, skills: e.target.value })} rows={4} placeholder="React, TypeScript, Node.js, Python..." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none" />
      </div>
    </div>
  );
}

function ProjectsForm({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-600">Projects</label>
        <p className="text-xs text-gray-400 mt-0.5">Describe your notable projects — each on a new line</p>
        <textarea value={data.projects} onChange={e => onChange({ ...data, projects: e.target.value })} rows={8} placeholder="JumpStart — AI-powered career platform built with Next.js, Claude API, and Supabase. Full-stack application with resume optimization, interview prep, and job tracking.

Sports Excitement App — React Native mobile app for sports fans..." className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ResumePage() {
  const [data, setData]       = useState<ResumeData>(EMPTY);
  const [step, setStep]       = useState(0);
  const [preview, setPreview] = useState(false);

  function handleDownload() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = document.getElementById("resume-preview")?.innerHTML ?? "";
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.firstName} ${data.lastName} — Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: "Times New Roman", serif; font-size: 11px; line-height: 1.4; padding: 36px 40px; }
            @page { margin: 0; size: letter; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  }

  const currentForm = [
    <PersonalForm    key="personal"   data={data} onChange={setData} />,
    <SummaryForm     key="summary"    data={data} onChange={setData} />,
    <ExperienceForm  key="experience" data={data} onChange={setData} />,
    <EducationForm   key="education"  data={data} onChange={setData} />,
    <SkillsForm      key="skills"     data={data} onChange={setData} />,
    <ProjectsForm    key="projects"   data={data} onChange={setData} />,
  ][step];

  return (
    <div className="flex h-full flex-col max-w-7xl space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-500" /> Resume Builder
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">Create a professional resume that gets you hired.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(p => !p)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              preview ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            )}
          >
            <Eye className="h-4 w-4" /> {preview ? "Hide Preview" : "Preview"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex gap-5 flex-1 min-h-0">

        {/* Left — Steps nav */}
        <div className="w-52 shrink-0">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-3 space-y-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={s.key}
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left",
                    active ? "bg-violet-50 text-violet-700" :
                    done   ? "text-gray-600 hover:bg-gray-50" :
                             "text-gray-400 hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full shrink-0 text-xs font-bold",
                    active ? "bg-violet-600 text-white" :
                    done   ? "bg-green-500 text-white"  :
                             "bg-gray-100 text-gray-400"
                  )}>
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center — Form */}
        <div className={cn("flex flex-col gap-4", preview ? "w-80 shrink-0" : "flex-1")}>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex-1">
            <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">{STEPS[step].label}</h2>
                <p className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</p>
              </div>
              <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-1.5 rounded-full bg-violet-500 transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
            <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
              {currentForm}
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Right — Live Preview */}
        {preview && (
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">Live Preview</span>
                <span className="text-xs text-gray-400">Updates as you type</span>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
                <div className="transform origin-top scale-75" style={{ width: "133%", marginLeft: "-16.5%" }}>
                  <ResumePreview data={data} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
