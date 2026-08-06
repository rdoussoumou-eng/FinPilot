import { TopBar } from "@/components/layout/topbar";
import { WelcomeBlock } from "@/components/dashboard/welcome-block";
import { KpiGrid } from "@/components/dashboard/kpi-card";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { computeKpis } from "@/lib/compute";
import { computeAiInsights } from "@/lib/insights";
import type { Transaction } from "@/types/finance";
import { parseLocalDate } from "@/lib/format";

// Visual hierarchy (top -> bottom): Solde/KPI -> Transactions + Conseils IA -> Objectifs.
// Deliberately trimmed from the first draft — Analytics, category cards and the
// quick-access grid duplicated the sidebar and the dedicated pages, so they were
// cut in favor of a page that fits one screen. See the design review in chat.
export default async function DashboardPage() {
  const [user, supabase] = await Promise.all([getCurrentUser(), createClient()]);
  const { categories, accounts, goals, allTx, currentTx, previousTx } = await getDashboardData(supabase);

  const kpis = computeKpis(allTx, currentTx, previousTx, categories);
  const insights = computeAiInsights(currentTx, previousTx, categories);

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const accountName = new Map(accounts.map((a) => [a.id, a.name]));
  const recentTransactions: Transaction[] = allTx.slice(0, 6).map((t) => ({
    id: t.id,
    date: parseLocalDate(t.occurred_on),
    category: t.category_id ? categoryName.get(t.category_id) ?? "—" : "—",
    label: t.label,
    account: t.account_id ? accountName.get(t.account_id) ?? "—" : "—",
    amount: t.amount,
    status: t.status,
  }));

  const firstName = user?.email ? user.email.split("@")[0] : "Bienvenue";

  return (
    <>
      <TopBar title="Accueil" userEmail={user?.email} />
      <main className="container flex flex-col gap-6 py-6">
        <WelcomeBlock name={firstName.charAt(0).toUpperCase() + firstName.slice(1)} />
        <KpiGrid kpis={kpis} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentTransactions transactions={recentTransactions} />
          </div>
          <AiInsightsCard insights={insights} />
        </div>

        <GoalsCard goals={goals} />
      </main>
    </>
  );
}
