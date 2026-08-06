"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/finance";

export function TransactionsTable({
  transactions, onDelete,
}: { transactions: Transaction[]; onDelete: (id: string) => Promise<void> }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) =>
      `${t.label} ${t.category} ${t.account}`.toLowerCase().includes(q)
    );
  }, [query, transactions]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[13.5px] font-semibold text-foreground">
          Toutes les opérations{" "}
          <Badge variant="secondary" className="ml-1 font-normal">
            {query ? `${filtered.length} / ${transactions.length}` : transactions.length} opérations
          </Badge>
        </h3>
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un libellé, une catégorie…"
            className="w-[260px] rounded-full pl-9 text-[13px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[13px]">
          <thead>
            <tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-3 font-semibold">Date</th>
              <th className="py-2 pr-3 font-semibold">Catégorie</th>
              <th className="py-2 pr-3 font-semibold">Libellé</th>
              <th className="py-2 pr-3 font-semibold">Compte</th>
              <th className="py-2 pr-3 text-right font-semibold">Montant</th>
              <th className="py-2 pl-3 font-semibold">Statut</th>
              <th className="py-2 pl-3 font-semibold" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">Aucune opération ne correspond à votre recherche.</td></tr>
            ) : filtered.map((t) => (
              <tr key={t.id} className="border-b border-border/60 last:border-none">
                <td className="whitespace-nowrap py-2.5 pr-3 text-muted-foreground">
                  {t.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="py-2.5 pr-3"><Badge variant="secondary" className="font-normal">{t.category}</Badge></td>
                <td className="py-2.5 pr-3 text-foreground">{t.label}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{t.account}</td>
                <td className={cn("py-2.5 pr-3 text-right font-medium tabular-nums", t.amount > 0 ? "text-success" : "text-foreground")}>
                  {formatMoney(t.amount, { signed: true })}
                </td>
                <td className="py-2.5 pl-3">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", t.status === "cleared" ? "bg-success/10 text-success" : "bg-warn/10 text-warn")}>
                    <Icon name={t.status === "cleared" ? "checkCircle" : "clock"} className="h-3 w-3" />
                    {t.status === "cleared" ? "Validé" : "En attente"}
                  </span>
                </td>
                <td className="py-2.5 pl-3">
                  <button
                    type="button"
                    aria-label="Supprimer"
                    className="rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    onClick={() => {
                      if (window.confirm(`Supprimer « ${t.label} » ? Cette action est irréversible.`)) onDelete(t.id);
                    }}
                  >
                    <Icon name="x" className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
