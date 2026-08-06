"use client";

import { Icon } from "@/components/icon";
import { formatMoney } from "@/lib/format";
import type { CategoryRow } from "@/types/db";

export function CategoryList({
  categories, onDelete,
}: { categories: CategoryRow[]; onDelete: (id: string) => Promise<void> }) {
  if (categories.length === 0) {
    return <p className="py-6 text-center text-[12.5px] text-muted-foreground">Aucune catégorie — ajoutez-en une ci-dessus.</p>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {categories.map((c) => (
        <li key={c.id} className="flex items-center justify-between py-2 text-[13px]">
          <span>{c.name}</span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">{formatMoney(c.monthly_budget)}</span>
            <button
              type="button"
              aria-label={`Supprimer ${c.name}`}
              className="rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
              onClick={() => {
                if (window.confirm(`Supprimer la catégorie « ${c.name} » ? Les transactions déjà classées dans cette catégorie resteront, mais perdront cette étiquette.`)) onDelete(c.id);
              }}
            >
              <Icon name="x" className="h-3.5 w-3.5" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
