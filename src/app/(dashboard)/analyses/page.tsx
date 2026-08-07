import { TopBar } from "@/components/layout/topbar";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getAccounts, getAllTransactions, getCategories } from "@/lib/queries";
import { computeCategoryTotals, computeMonthlySummariesForYear, computeTopExpenses, excludeFromStats, sumOut } from "@/lib/compute";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

// Next.js 14: searchParams is a plain object, not a Promise.
export default async function Page({ searchParams }: { searchParams: { year?: string } }) {
  const year = Number(searchParams.year) || new Date().getFullYear();

  const supabase = await createClient();
  const [user, allTx, categories, accounts] = await Promise.all([
    getCurrentUser(), getAllTransactions(supabase), getCategories(supabase), getAccounts(supabase),
  ]);
  const statsTx = excludeFromStats(allTx, accounts);

  const top10 = computeTopExpenses(statsTx, categories, 10);
  const categoryTotals = computeCategoryTotals(statsTx, categories);
  const monthly = computeMonthlySummariesForYear(statsTx, year);

  const avgDepMensuelle = monthly.reduce((s, m) => s + m.depenses, 0) / 12;
  const avgRevMensuel = monthly.reduce((s, m) => s + m.revenus, 0) / 12;
  const projectionAnnuelle = avgDepMensuelle * 12;
  const capaciteEpargne = avgRevMensuel - avgDepMensuelle;
  const minDate = statsTx.length ? statsTx.reduce((m, t) => (t.occurred_on < m ? t.occurred_on : m), statsTx[0].occurred_on) : null;
  const days = minDate ? Math.max(1, Math.round((Date.now() - new Date(minDate).getTime()) / 86_400_000)) : 1;
  const moyQuotidienne = sumOut(statsTx) / days;
  const ratio = avgRevMensuel ? capaciteEpargne / avgRevMensuel : 0;
  const indiceSante = ratio <= 0 ? 0 : ratio >= 0.3 ? 100 : Math.round((ratio / 0.3) * 100);

  return (
    <>
      <TopBar title="Tableau d'analyse" userEmail={user?.email} />
      <main className="container flex flex-col gap-4 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Top 10 des dépenses</h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-[13px]">
                <thead>
                  <tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">Rang</th>
                    <th className="py-2 pr-3 font-semibold">Libellé</th>
                    <th className="py-2 pr-3 font-semibold">Catégorie</th>
                    <th className="py-2 pr-3 text-right font-semibold">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {top10.map((t, i) => (
                    <tr key={t.id} className="border-b border-border/60 last:border-none">
                      <td className="py-2 pr-3 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 pr-3">{t.label}</td>
                      <td className="py-2 pr-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">{t.category}</span></td>
                      <td className="py-2 pr-3 text-right tabular-nums text-danger">{formatMoney(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Dépenses par catégorie <span className="text-[11px] font-normal text-muted-foreground">toutes périodes</span></h3>
            {categoryTotals.length === 0 ? (
              <p className="text-[12.5px] text-muted-foreground">Aucune dépense enregistrée.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {categoryTotals.map((c) => {
                  const max = categoryTotals[0].value;
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 truncate text-[12.5px] text-muted-foreground">{c.name}</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${(c.value / max) * 100}%` }} />
                      </div>
                      <span className="w-24 shrink-0 text-right text-[12.5px] font-semibold tabular-nums">{formatMoney(c.value)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[13.5px] font-semibold text-foreground">Dépenses & revenus par mois</h3>
            <PeriodSelect action="/analyses" year={year} showMonth={false} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-[13px]">
              <thead>
                <tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Mois</th>
                  <th className="py-2 pr-3 text-right font-semibold">Revenus</th>
                  <th className="py-2 pr-3 text-right font-semibold">Dépenses</th>
                  <th className="py-2 pr-3 text-right font-semibold">Épargne</th>
                </tr>
              </thead>
              <tbody>
                {monthly.map((m) => (
                  <tr key={m.month} className="border-b border-border/60 last:border-none">
                    <td className="py-2 pr-3">{m.month}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-success">{formatMoney(m.revenus)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-danger">{formatMoney(m.depenses)}</td>
                    <td className={cn("py-2 pr-3 text-right tabular-nums", m.epargne >= 0 ? "text-foreground" : "text-danger")}>{formatMoney(m.epargne)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Indicateurs de synthèse</h3>
          <dl className="divide-y divide-border/60">
            {[
              ["Moyenne quotidienne de dépenses", formatMoney(moyQuotidienne)],
              ["Moyenne mensuelle de dépenses", formatMoney(avgDepMensuelle)],
              ["Projection annuelle de dépenses", formatMoney(projectionAnnuelle)],
              ["Capacité d'épargne mensuelle moyenne", formatMoney(capaciteEpargne)],
              ["Indice de santé financière", `${indiceSante} / 100`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 text-[13px]">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </>
  );
}
