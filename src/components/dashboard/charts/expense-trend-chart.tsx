"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { formatCompact, formatMoney } from "@/lib/format";

export function ExpenseTrendChart({ data }: { data: { month: string; value: number }[] }) {
  return (
    <ChartCard title="Évolution des dépenses" hint="6 derniers mois">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--danger))" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(var(--danger))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
          <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={formatCompact} width={40} />
          <Tooltip
            formatter={(v: number) => formatMoney(v)}
            contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="value" stroke="hsl(var(--danger))" strokeWidth={2} fill="url(#expenseFill)" dot={false} isAnimationActive />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
