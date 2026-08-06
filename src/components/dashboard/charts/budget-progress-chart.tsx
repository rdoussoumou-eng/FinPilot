"use client";

import { motion } from "framer-motion";
import { ChartCard } from "@/components/dashboard/chart-card";
import { formatMoney, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BudgetProgressChart({ used, total }: { used: number; total: number }) {
  const pct = total ? used / total : 0;
  const over = pct > 1;
  const warn = !over && pct > 0.85;

  return (
    <ChartCard title="Budget consommé" hint={`${formatMoney(used)} / ${formatMoney(total)}`}>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(pct, 1) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className={cn("h-full rounded-full", over ? "bg-danger" : warn ? "bg-warn" : "bg-success")}
        />
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">
        <span className={cn("font-semibold", over ? "text-danger" : "text-foreground")}>{formatPercent(pct, 0)}</span>{" "}
        du budget mensuel utilisé
      </p>
    </ChartCard>
  );
}
