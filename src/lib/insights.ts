import type { CategoryRow, TransactionRow } from "@/types/db";
import { formatMoney } from "@/lib/format";

export interface Insight {
  tone: "warning" | "positive";
  text: string;
}

function spendByCategory(tx: TransactionRow[], categoryId: string) {
  return tx.filter((t) => t.category_id === categoryId && t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);
}

/** Every insight is derived from real rows — never hardcoded — so it can
 *  never contradict the KPIs shown next to it. Mirrors the logic validated
 *  in the HTML prototype (see dashboard_preview.html: computeAiInsights). */
export function computeAiInsights(
  currentTx: TransactionRow[],
  previousTx: TransactionRow[],
  categories: CategoryRow[]
): Insight[] {
  const insights: Insight[] = [];

  let bestIncrease: { name: string; delta: number } | null = null;
  for (const cat of categories) {
    const cur = spendByCategory(currentTx, cat.id);
    const prev = spendByCategory(previousTx, cat.id);
    if (prev > 0 && cur > prev) {
      const delta = (cur - prev) / prev;
      if (!bestIncrease || delta > bestIncrease.delta) bestIncrease = { name: cat.name, delta };
    }
  }
  if (bestIncrease) {
    insights.push({
      tone: "warning",
      text: `Vos dépenses « ${bestIncrease.name} » ont augmenté de ${Math.round(bestIncrease.delta * 100)} % par rapport au mois dernier.`,
    });
  }

  let worstBudget: { name: string; pct: number } | null = null;
  for (const cat of categories) {
    if (!cat.monthly_budget) continue;
    const cur = spendByCategory(currentTx, cat.id);
    const pct = cur / cat.monthly_budget;
    if (pct >= 0.85 && (!worstBudget || pct > worstBudget.pct)) worstBudget = { name: cat.name, pct };
  }
  if (worstBudget) {
    insights.push({
      tone: "warning",
      text: `Votre budget « ${worstBudget.name} » est ${worstBudget.pct >= 1 ? "dépassé" : "presque atteint"} (${Math.round(worstBudget.pct * 100)} %).`,
    });
  }

  let topCat: { name: string; value: number } | null = null;
  for (const cat of categories) {
    const cur = spendByCategory(currentTx, cat.id);
    if (cur > 0 && (!topCat || cur > topCat.value)) topCat = { name: cat.name, value: cur };
  }
  if (topCat) {
    const potential = Math.round((topCat.value * 0.1) / 1000) * 1000;
    if (potential > 0) {
      insights.push({
        tone: "positive",
        text: `Vous pourriez économiser environ ${formatMoney(potential)} en réduisant vos dépenses « ${topCat.name} » de 10 %.`,
      });
    }
  }

  const revenus = currentTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const depenses = currentTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const tauxEpargne = revenus ? (revenus - depenses) / revenus : 0;
  if (tauxEpargne >= 0.2) {
    insights.push({
      tone: "positive",
      text: `Continuez ainsi — votre taux d'épargne du mois (${Math.round(tauxEpargne * 100)} %) dépasse l'objectif recommandé de 20 %.`,
    });
  } else if (revenus > 0 && tauxEpargne < 0) {
    insights.push({
      tone: "warning",
      text: `Vos dépenses ont dépassé vos revenus ce mois-ci (${formatMoney(depenses - revenus)} de découvert).`,
    });
  }

  return insights.slice(0, 4);
}
