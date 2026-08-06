"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { formatCompact, formatMoney } from "@/lib/format";

interface Props {
  previous: { revenus: number; depenses: number };
  current: { revenus: number; depenses: number };
}

export function MonthComparisonChart({ previous, current }: Props) {
  const data = [
    { label: "Revenus", "Mois précédent": previous.revenus, "Mois actuel": current.revenus },
    { label: "Dépenses", "Mois précédent": previous.depenses, "Mois actuel": current.depenses },
  ];

  return (
    <ChartCard title="Mois précédent vs. mois actuel">
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }} barGap={4}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11.5} stroke="hsl(var(--muted-foreground))" />
          <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="hsl(var(--muted-foreground))" tickFormatter={formatCompact} width={40} />
          <Tooltip formatter={(v: number) => formatMoney(v)} contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Mois précédent" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="Mois actuel" fill="hsl(var(--brand-navy))" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
