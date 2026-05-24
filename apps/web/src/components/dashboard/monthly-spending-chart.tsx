"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { DashboardTrendPoint } from "@/services/dashboardService";

function formatEtb(value: number) {
  return `${value.toLocaleString("en-ET", { maximumFractionDigits: 0 })} ETB`;
}

type MonthlySpendingChartProps = {
  data: DashboardTrendPoint[];
  monthlySpent: string | number | null | undefined;
  dailyAverage: string | number | null | undefined;
};

export function MonthlySpendingChart({ data, monthlySpent, dailyAverage }: MonthlySpendingChartProps) {
  const rows = data.map((point) => ({
    ...point,
    amount: Number.parseFloat(point.amount || "0"),
  }));

  const spentValue = typeof monthlySpent === "string" ? Number.parseFloat(monthlySpent || "0") : Number(monthlySpent ?? 0);
  const averageValue = typeof dailyAverage === "string" ? Number.parseFloat(dailyAverage || "0") : Number(dailyAverage ?? 0);

  return (
    <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.55)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
            Monthly trend
          </p>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Spending flow this month</h3>
            <p className="mt-1 text-sm text-white/65">
              Daily spending recorded from the backend. Higher peaks show the days you spent most.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
            <p className="text-white/55">Monthly spent</p>
            <p className="mt-1 text-lg font-semibold">{formatEtb(Number.isFinite(spentValue) ? spentValue : 0)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 backdrop-blur">
            <p className="text-white/55">Daily average</p>
            <p className="mt-1 text-lg font-semibold">{formatEtb(Number.isFinite(averageValue) ? averageValue : 0)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dashboardTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.55)", fontWeight: 600 }}
                interval="preserveStartEnd"
                minTickGap={18}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.55)", fontWeight: 600 }}
                tickFormatter={(value: number) => `${value.toFixed(0)}`}
                width={44}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.14)", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.22)",
                  background: "rgba(255,255,255,0.98)",
                }}
                labelStyle={{ color: "#0f172a", fontWeight: 700 }}
                formatter={(value: number) => [`${value.toLocaleString("en-ET", { maximumFractionDigits: 0 })} ETB`, "Spent"]}
                labelFormatter={(label: string) => `Day ${label}`}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#7dd3fc"
                strokeWidth={3}
                fill="url(#dashboardTrendFill)"
                dot={{ r: 3, fill: "#7dd3fc", strokeWidth: 2, stroke: "#0f172a" }}
                activeDot={{ r: 6, fill: "#e0f2fe", stroke: "#7dd3fc", strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
