import { TopBar } from "@/components/layout/topbar";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { KpiGrid } from "@/components/dashboard/kpi-card";
import { RevenueTrendChart } from "@/components/dashboard/charts/revenue-trend-chart";
import { ExpenseTrendChart } from "@/components/dashboard/charts/expense-trend-chart";
import { CategoryPieChart } from "@/components/dashboard/charts/category-pie-chart";
import { BudgetProgressChart } from "@/components/dashboard/charts/budget-progress-chart";
import { SavingsTrendChart } from "@/components/dashboard/charts/savings-trend-chart";
import { MonthComparisonChart } from "@/components/dashboard/charts/month-comparison-chart";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getMonthlyOverview } from "@/lib/queries";
import { computeCategoryTotals, computeKpis, computeMonthlySummariesForYear, sumIn, sumOut } from "@/lib/compute";

// Next.js 14: searchParams is a plain object, not a Promise (that's a Next 15 change).
export default async function Page({
  searchParams,
}: { searchParams: { month?: string; year?: string } }) {
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = searchParams.month !== undefined ? Number(searchParams.month) : now.getMonth();

  const user = await getCurrentUser();
  const supabase = await createClient();
  const { categories, allTx, statsTx, currentTx, previousTx } = await getMonthlyOverview(supabase, year, month);

  const kpis = computeKpis(allTx, currentTx, previousTx, categories);
  const monthly = computeMonthlySummariesForYear(statsTx, year);
  const categoryTotals = computeCategoryTotals(currentTx, categories).slice(0, 6);
  const budgetTotal = categories.reduce((s, c) => s + c.monthly_budget, 0);
  const depensesTotal = sumOut(currentTx);

  return (
    <>
      <TopBar title="Tableau de bord" userEmail={user?.email} />
      <main className="container flex flex-col gap-6 py-6">
        <PeriodSelect action="/dashboard" year={year} month={month} />
        <KpiGrid kpis={kpis} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <RevenueTrendChart data={monthly.map((m) => ({ month: m.month.slice(0, 3), value: m.revenus }))} />
          <ExpenseTrendChart data={monthly.map((m) => ({ month: m.month.slice(0, 3), value: m.depenses }))} />
          <CategoryPieChart
            data={categoryTotals.map((c) => ({ category: c.name, icon: "wallet", amount: c.value, sharePct: depensesTotal ? c.value / depensesTotal : 0, deltaPct: 0 }))}
          />
          <BudgetProgressChart used={depensesTotal} total={budgetTotal} />
          <SavingsTrendChart data={monthly.map((m) => ({ month: m.month.slice(0, 3), value: m.epargne }))} />
          <MonthComparisonChart
            previous={{ revenus: sumIn(previousTx), depenses: sumOut(previousTx) }}
            current={{ revenus: sumIn(currentTx), depenses: sumOut(currentTx) }}
          />
        </div>
      </main>
    </>
  );
}
