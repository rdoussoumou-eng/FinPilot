"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/icon";
import { formatMoney } from "@/lib/format";
import type { GoalRow } from "@/types/db";

export function GoalsCard({
  goals, showLink = true, onDelete,
}: { goals: GoalRow[]; showLink?: boolean; onDelete?: (id: string) => Promise<void> }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground">
          <Icon name="target" className="h-4 w-4 text-navy dark:text-gold" /> Objectifs
        </h3>
        {showLink && (
          <Link href="/objectifs" className="flex items-center gap-1 text-[12px] font-semibold text-navy dark:text-gold">
            Voir tout <Icon name="arrowRight" className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {goals.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-[12.5px] text-muted-foreground">
          Aucun objectif pour l&rsquo;instant.
        </p>
      )}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {goals.map((g, i) => {
          const pct = g.target_amount ? g.current_amount / g.target_amount : 0;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="relative rounded-xl border border-border bg-card p-4 shadow-card"
            >
              {onDelete && (
                <button
                  type="button"
                  aria-label="Supprimer"
                  className="absolute right-2.5 top-2.5 rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                  onClick={() => {
                    if (window.confirm(`Supprimer l'objectif « ${g.name} » ?`)) onDelete(g.id);
                  }}
                >
                  <Icon name="x" className="h-3.5 w-3.5" />
                </button>
              )}
              <div className="mb-1.5 flex items-center justify-between pr-5">
                <span className="text-[13px] font-semibold text-foreground">{g.name}</span>
                <span className="font-display text-[15px] font-bold text-gold">{Math.round(pct * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(pct, 1) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                  className="h-full rounded-full bg-gold"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {formatMoney(g.current_amount)} / {g.target_amount ? formatMoney(g.target_amount) : "objectif non défini"}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
