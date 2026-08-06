"use client";

import { Icon } from "@/components/icon";
import type { AccountRow } from "@/types/db";

export function AccountList({
  accounts, onDelete,
}: { accounts: AccountRow[]; onDelete: (id: string) => Promise<void> }) {
  if (accounts.length === 0) {
    return <p className="py-6 text-center text-[12.5px] text-muted-foreground">Aucun compte — ajoutez-en un ci-dessus.</p>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {accounts.map((a) => (
        <li key={a.id} className="flex items-center justify-between py-2 text-[13px]">
          <span>{a.name}</span>
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
