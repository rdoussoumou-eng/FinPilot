"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/icon";
import { useCountUp } from "@/hooks/use-count-up";
import { formatMoney, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/types/finance";

export function KpiCard({ kpi, index = 0 }: { kpi: Kpi; index?: number }) {
  const animated = useCountUp(kpi.value);
  const display = kpi.format === "percent" ? formatPercent(animated) : formatMoney(animated);

  const isGood = kpi.deltaPct === 0 ? null : (kpi.deltaPct > 0) === (kpi.goodDirection === "up");
  const deltaLabel = `${kpi.deltaPct > 0 ? "+" : ""}${(kpi.deltaPct * 100).toFixed(1)} %`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -3 }}
      className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <span className="rounded-lg bg-accent p-2 text-navy dark:text-gold">
          <Icon name={kpi.icon} className="h-[18px] w-[18px]" />
        </span>
        {isGood !== null && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              isGood ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            )}
          >
            <Icon name={kpi.deltaPct > 0 ? "trendingUp" : "trendingDown"} className="h-3 w-3" />
            {deltaLabel}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10.5px] font-semibold uppercase tracking-[.06em] text-muted-foreground">
          {kpi.label}
        </p>
        <p className="mt-0.5 font-display text-[21px] font-bold leading-tight text-foreground">
          {display}
        </p>
      </div>
    </motion.div>
  );
}

export function KpiGrid({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-6">
      {kpis.map((k, i) => (
        <KpiCard key={k.id} kpi={k} index={i} />
      ))}
    </div>
  );
}
