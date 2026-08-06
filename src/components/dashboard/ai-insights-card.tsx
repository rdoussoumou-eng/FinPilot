"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { Insight } from "@/lib/insights";

// `warn` (amber) is a semantic token distinct from `gold` (brand accent) —
// gold stays reserved for the CTA/active-nav/brand, warn for "needs attention".
const TONE_STYLES: Record<Insight["tone"], string> = {
  warning: "border-l-warn bg-warn/10",
  positive: "border-l-success bg-success/10",
};

export function AiInsightsCard({ insights }: { insights: Insight[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="mb-4 flex items-center gap-2">
        <Icon name="sparkles" className="h-4 w-4 text-gold" />
        <h3 className="text-[13.5px] font-semibold text-foreground">Conseils IA</h3>
      </div>
      {insights.length === 0 ? (
        <p className={cn("rounded-r-lg border-l-2 px-3 py-2 text-[13px] leading-snug text-foreground/90", TONE_STYLES.positive)}>
          Aucune alerte pour l&rsquo;instant — vos finances sont sous contrôle ce mois-ci.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {insights.map((insight, i) => (
            <li key={i} className={cn("rounded-r-lg border-l-2 px-3 py-2 text-[13px] leading-snug text-foreground/90", TONE_STYLES[insight.tone])}>
              {insight.text}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
