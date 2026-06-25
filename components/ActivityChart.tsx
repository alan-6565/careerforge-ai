"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "May 1", applications: 0 },
  { date: "May 8", applications: 3 },
  { date: "May 15", applications: 7 },
  { date: "May 22", applications: 12 },
  { date: "May 29", applications: 18 },
  { date: "Jun 5", applications: 24 },
];

export default function ActivityChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#colorApps)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
