"use client";

import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import type { AccountRow } from "@/types/db";

export function AccountList({
  accounts, onDelete, onToggleExclusion,
}: {
  accounts: AccountRow[];
  onDelete: (id: string) => Promise<void>;
  onToggleExclusion: (id: string, excluded: boolean) => Promise<void>;
}) {
  if (accounts.length === 0) {
    return <p className="py-6 text-center text-[12.5px] text-muted-foreground">Aucun compte — ajoutez-en un ci-dessus.</p>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {accounts.map((a) => (
        <li key={a.id} className="flex items-center justify-between gap-2 py-2 text-[13px]">
          <div className="flex items-center gap-2">
            <span>{a.name}</span>
            <button
              type="button"
              onClick={() => onToggleExclusion(a.id, !a.exclude_from_totals)}
              title="Basculer l'exclusion des totaux (budget, tableau de bord, analyses)"
              className={cn(
                "rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide transition-colors",
                a.exclude_from_totals
                  ? "bg-warn/15 text-warn hover:bg-warn/25"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/70"
              )}
            >
              {a.exclude_from_totals ? "Hors totaux" : "Inclus"}
            </button>
          </div>
          <button
            type="button"
            aria-label={`Supprimer ${a.name}`}
            className="rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
            onClick={() => {
              if (window.confirm(`Supprimer le compte « ${a.name} » ? Les transactions déjà associées resteront, mais perdront ce compte.`)) onDelete(a.id);
            }}
          >
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
