"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/finance";
import type { CategoryRow, AccountRow } from "@/types/db";

export function TransactionsTable({
  transactions, categories, accounts, onDelete, onUpdate,
}: {
  transactions: Transaction[];
  categories: CategoryRow[];
  accounts: AccountRow[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

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
            ) : filtered.map((t) =>
              editingId === t.id ? (
                <tr key={t.id} className="border-b border-border/60 last:border-none bg-muted/30">
                  <td colSpan={7} className="py-3">
                    <form
                      action={async (formData) => {
                        await onUpdate(t.id, formData);
                        setEditingId(null);
                      }}
                      className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-7 lg:items-end"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
                        <input name="date" type="date" defaultValue={t.occurredOn} required className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Montant</label>
                        <input name="amount" type="number" min="0" step="1" defaultValue={Math.abs(t.amount)} required className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-2">
                        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Libellé</label>
                        <input name="label" type="text" defaultValue={t.label} required className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Catégorie</label>
                        <select name="category_id" defaultValue={t.categoryId ?? ""} required className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Type</label>
                        <select name="type" defaultValue={t.amount > 0 ? "in" : "out"} className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                          <option value="out">Dépense</option>
                          <option value="in">Revenu</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Compte</label>
                        <select name="account_id" defaultValue={t.accountId ?? ""} required className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-[13px] outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                          {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                      <input name="payment_mode" type="hidden" defaultValue={t.paymentMode ?? ""} />
                      <div className="col-span-2 flex gap-2 sm:col-span-3 lg:col-span-7">
                        <button type="submit" className="rounded-full bg-gold px-4 py-1.5 text-[12.5px] font-bold text-white hover:opacity-90">
                          Enregistrer
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-border px-4 py-1.5 text-[12.5px] font-semibold text-muted-foreground hover:bg-muted">
                          Annuler
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              ) : (
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
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Modifier"
                        className="rounded-md p-1 text-muted-foreground hover:bg-gold/10 hover:text-gold"
                        onClick={() => setEditingId(t.id)}
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" />
                      </button>
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
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
