"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/icon";
import type { IconName } from "@/types/finance";

const STEPS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "wallet",
    title: "Transactions",
    body: "Enregistrez vos dépenses et revenus au fil de l'eau. Chaque opération met à jour vos comptes et votre budget automatiquement.",
  },
  {
    icon: "barChart",
    title: "Tableau de bord & Analyses",
    body: "Suivez vos totaux du mois, vos dépenses par catégorie et l'évolution de vos finances dans le temps.",
  },
  {
    icon: "piggyBank",
    title: "Budget mensuel",
    body: "Fixez un plafond par catégorie et voyez en un coup d'œil ce qu'il vous reste à dépenser ce mois-ci.",
  },
  {
    icon: "target",
    title: "Objectifs",
    body: "Créez des objectifs d'épargne (voyage, urgence, projet…) et suivez votre progression vers chacun.",
  },
  {
    icon: "settings",
    title: "Paramètres",
    body: "Personnalisez vos catégories et vos comptes (Espèces, Banque, Mobile Money…) selon vos besoins.",
  },
];

export function WelcomeGuide({ onDismiss }: { onDismiss: () => Promise<void> }) {
  const [hidden, setHidden] = useState(false);
  const [pending, startTransition] = useTransition();

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-card-hover">
        <div className="bg-gradient-to-br from-navy to-[#142038] px-6 py-6 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-gold-soft">Bienvenue</p>
          <h2 className="mt-1 font-display text-[20px] font-bold leading-tight">
            Tableau de Bord Financier Premium
          </h2>
          <p className="mt-1.5 text-[13px] text-white/70">
            Un aperçu rapide avant de commencer.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ul className="flex flex-col gap-4">
            {STEPS.map((step) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Icon name={step.icon} className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-foreground">{step.title}</p>
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border px-6 py-4">
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(async () => {
              await onDismiss();
              setHidden(true);
            })}
            className="w-full rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Un instant…" : "Commencer"}
          </button>
        </div>
      </div>
    </div>
  );
}
