import type { AccountRow, CategoryRow, TransactionRow } from "@/types/db";
import type { Kpi } from "@/types/finance";

export const MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

/** Drops transactions tied to an "exclude from totals" account (e.g. a
 *  Remboursements account) — used everywhere spending is analyzed (KPIs,
 *  budget, charts) so reimbursements don't skew real spending numbers.
 *  Comptes and Transactions intentionally keep using the unfiltered list —
 *  those pages are ledgers, not analysis. */
export function excludeFromStats(tx: TransactionRow[], accounts: AccountRow[]): TransactionRow[] {
  const excluded = new Set(accounts.filter((a) => a.exclude_from_totals).map((a) => a.id));
  if (excluded.size === 0) return tx;
  return tx.filter((t) => !t.account_id || !excluded.has(t.account_id));
}

export function sumIn(rows: TransactionRow[]) {
  return rows.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
}
export function sumOut(rows: TransactionRow[]) {
  return rows.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
}

function pctChange(cur: number, prev: number) {
  if (!prev) return 0;
  return (cur - prev) / Math.abs(prev);
}

/** All KPI values and their month-over-month deltas, computed from real
 *  rows only — nothing here is a placeholder or an estimate. */
export function computeKpis(
  allTx: TransactionRow[],
  currentTx: TransactionRow[],
  previousTx: TransactionRow[],
  categories: CategoryRow[]
): Kpi[] {
  const soldeTotal = allTx.reduce((s, t) => s + t.amount, 0);
  const soldeEndOfPrevMonth = soldeTotal - currentTx.reduce((s, t) => s + t.amount, 0);

  const revenus = sumIn(currentTx), depenses = sumOut(currentTx);
  const revenusPrev = sumIn(previousTx), depensesPrev = sumOut(previousTx);

  const budgetTotal = categories.reduce((s, c) => s + c.monthly_budget, 0);
  const budgetRestant = budgetTotal - depenses;
  const budgetRestantPrev = budgetTotal - depensesPrev;

  const tauxEpargne = revenus ? (revenus - depenses) / revenus : 0;
  const tauxEpargnePrev = revenusPrev ? (revenusPrev - depensesPrev) / revenusPrev : 0;

  // No dedicated "assets" table yet — net worth mirrors total balance until one exists.
  const patrimoine = soldeTotal;

  return [
    { id: "solde", label: "Solde total", value: soldeTotal, format: "money", deltaPct: pctChange(soldeTotal, soldeEndOfPrevMonth), goodDirection: "up", icon: "wallet" },
    { id: "revenus", label: "Revenus du mois", value: revenus, format: "money", deltaPct: pctChange(revenus, revenusPrev), goodDirection: "up", icon: "trendingUp" },
    { id: "depenses", label: "Dépenses du mois", value: depenses, format: "money", deltaPct: pctChange(depenses, depensesPrev), goodDirection: "down", icon: "trendingDown" },
    { id: "budget", label: "Budget restant", value: budgetRestant, format: "money", deltaPct: pctChange(budgetRestant, budgetRestantPrev), goodDirection: "up", icon: "wallet" },
    { id: "epargne", label: "Taux d'épargne", value: tauxEpargne, format: "percent", deltaPct: pctChange(tauxEpargne, tauxEpargnePrev), goodDirection: "up", icon: "piggyBank" },
    { id: "patrimoine", label: "Patrimoine net", value: patrimoine, format: "money", deltaPct: pctChange(patrimoine, soldeEndOfPrevMonth), goodDirection: "up", icon: "barChart" },
  ];
}

export interface CategoryTotal { id: string; name: string; value: number }

/** Expense total per category, for a given transaction set. Categories with
 *  zero spend in that set are omitted (nothing to rank or chart). */
export function computeCategoryTotals(tx: TransactionRow[], categories: CategoryRow[]): CategoryTotal[] {
  return categories
    .map((c) => ({
      id: c.id,
      name: c.name,
      value: tx.filter((t) => t.category_id === c.id && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);
}

export interface AccountBalance { id: string; name: string; in: number; out: number; balance: number }

export function computeAccountBalances(allTx: TransactionRow[], accounts: AccountRow[]): AccountBalance[] {
  return accounts.map((a) => {
    const rows = allTx.filter((t) => t.account_id === a.id);
    return { id: a.id, name: a.name, in: sumIn(rows), out: sumOut(rows), balance: rows.reduce((s, t) => s + t.amount, 0) };
  });
}

/** The N largest expenses in a transaction set, with category names resolved. */
export function computeTopExpenses(tx: TransactionRow[], categories: CategoryRow[], limit = 10) {
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  return tx
    .filter((t) => t.amount < 0)
    .slice()
    .sort((a, b) => a.amount - b.amount) // most negative first = largest expense
    .slice(0, limit)
    .map((t) => ({
      id: t.id,
      label: t.label,
      category: t.category_id ? categoryName.get(t.category_id) ?? "—" : "—",
      amount: Math.abs(t.amount),
    }));
}

export interface MonthSummary { month: string; revenus: number; depenses: number; epargne: number }

/** Buckets an already-fetched transaction list into the 12 months of `year`.
 *  Takes the full set (every caller already has it — needed for the all-time
 *  balance) and groups in memory instead of querying Supabase per month or
 *  per year: string-slicing "YYYY-MM-DD" avoids Date parsing entirely. */
export function computeMonthlySummariesForYear(allTx: TransactionRow[], year: number): MonthSummary[] {
  const yearStr = String(year);
  const buckets: TransactionRow[][] = Array.from({ length: 12 }, () => []);
  for (const t of allTx) {
    if (t.occurred_on.slice(0, 4) !== yearStr) continue;
    const month = Number(t.occurred_on.slice(5, 7)) - 1;
    if (month >= 0 && month < 12) buckets[month].push(t);
  }
  return buckets.map((rows, i) => {
    const revenus = sumIn(rows), depenses = sumOut(rows);
    return { month: MOIS[i], revenus, depenses, epargne: revenus - depenses };
  });
}
