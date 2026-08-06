"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { formatMoney } from "@/lib/format";
import type { CategorySpend } from "@/types/finance";

// Fixed categorical order — six slots max on a donut. Re-validate with the
// palette script (see dataviz skill) before shipping a real brand palette.
const SLOT_COLORS = [
  "hsl(var(--brand-gold))",
  "hsl(var(--brand-navy))",
  "hsl(var(--success))",
  "217 70% 62%",
  "6 63% 62%",
  "220 10% 60%",
].map((c) => (c.startsWith("hsl") ? c : `hsl(${c})`));

export function CategoryPieChart({ data }: { data: CategorySpend[] }) {
  const chartData = data.filter((d) => d.amount > 0);
  return (
    <ChartCard title="Répartition des dépenses" hint="par catégorie">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie data={chartData} dataKey="amount" nameKey="category" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="hsl(var(--card))" strokeWidth={2}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={SLOT_COLORS[i % SLOT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatMoney(v)} contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-1.5">
          {chartData.map((d, i) => (
            <li key={d.category} className="flex items-center gap-2 text-[11.5px]">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: SLOT_COLORS[i % SLOT_COLORS.length] }} />
              <span className="flex-1 truncate text-muted-foreground">{d.category}</span>
              <span className="font-medium text-foreground">{Math.round(d.sharePct * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
