"use client";

import { Icon } from "@/components/icon";
import type { AllowedEmailRow } from "@/types/db";

export function AllowedEmailsList({
  emails, onDelete,
}: { emails: AllowedEmailRow[]; onDelete: (email: string) => Promise<void> }) {
  if (emails.length === 0) {
    return <p className="py-6 text-center text-[12.5px] text-muted-foreground">Aucune adresse autorisée — ajoutez-en une ci-dessous.</p>;
  }
  return (
    <ul className="divide-y divide-border/60">
      {emails.map((e) => (
        <li key={e.email} className="flex items-center justify-between py-2 text-[13px]">
          <span>{e.email}</span>
          <button
            type="button"
            aria-label={`Retirer ${e.email}`}
            className="rounded-md p-1 text-muted-foreground hover:bg-danger/10 hover:text-danger"
            onClick={() => {
              if (window.confirm(`Retirer « ${e.email} » de la liste des personnes autorisées ?`)) onDelete(e.email);
            }}
          >
            <Icon name="x" className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  );
}
