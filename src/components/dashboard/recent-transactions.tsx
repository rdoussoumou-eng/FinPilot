"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/finance";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-foreground">Transactions récentes</h3>
        <Link href="/transactions" className="flex items-center gap-1 text-[12px] font-semibold text-navy dark:text-gold">
          Tout voir <Icon name="arrowRight" className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-semibold">Date</th>
              <th className="py-2 pr-3 font-semibold">Catégorie</th>
              <th className="py-2 pr-3 font-semibold">Libellé</th>
              <th className="py-2 pr-3 font-semibold">Compte</th>
              <th className="py-2 pr-3 text-right font-semibold">Montant</th>
              <th className="py-2 pl-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-border/60 last:border-none">
                <td className="whitespace-nowrap py-2.5 pr-3 text-muted-foreground">{formatDate(t.date)}</td>
                <td className="py-2.5 pr-3">
                  <Badge variant="secondary" className="font-normal">{t.category}</Badge>
                </td>
                <td className="py-2.5 pr-3 text-foreground">{t.label}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{t.account}</td>
                <td className={cn("py-2.5 pr-3 text-right font-medium tabular-nums", t.amount > 0 ? "text-success" : "text-foreground")}>
                  {formatMoney(t.amount, { signed: true })}
                </td>
                <td className="py-2.5 pl-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                      t.status === "cleared" ? "bg-success/10 text-success" : "bg-warn/10 text-warn"
                    )}
                  >
                    <Icon name={t.status === "cleared" ? "checkCircle" : "clock"} className="h-3 w-3" />
                    {t.status === "cleared" ? "Validé" : "En attente"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
