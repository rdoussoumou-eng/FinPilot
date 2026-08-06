import { TopBar } from "@/components/layout/topbar";
import { Icon } from "@/components/icon";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getMonthlyOverview } from "@/lib/queries";
import { formatMoney, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { updateCategoryBudget } from "./actions";

// Next.js 14: searchParams is a plain object, not a Promise.
export default async function Page({
  searchParams,
}: { searchParams: { month?: string; year?: string } }) {
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = searchParams.month !== undefined ? Number(searchParams.month) : now.getMonth();

  const user = await getCurrentUser();
  const supabase = await createClient();
  const { categories, currentTx } = await getMonthlyOverview(supabase, year, month);

  const rows = categories.map((c) => {
    const reel = currentTx.filter((t) => t.category_id === c.id && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const pct = c.monthly_budget ? reel / c.monthly_budget : 0;
    return { ...c, reel, ecart: c.monthly_budget - reel, pct };
  });
  const totalBudget = rows.reduce((s, r) => s + r.monthly_budget, 0);
  const totalReel = rows.reduce((s, r) => s + r.reel, 0);

  return (
    <>
      <TopBar title="Budget mensuel" userEmail={user?.email} />
      <main className="container flex flex-col gap-4 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2 rounded-lg border border-dashed border-gold-soft bg-accent px-4 py-2.5 text-[12px] text-muted-foreground">
            <Icon name="settings" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Modifiez un montant puis appuyez sur Entrée ou cliquez ✓ pour l&rsquo;enregistrer.
          </div>
          <PeriodSelect action="/budget" year={year} month={month} />
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead>
                <tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Catégorie</th>
                  <th className="py-2 pr-3 text-right font-semibold">Budget prévu</th>
                  <th className="py-2 pr-3 text-right font-semibold">Réel</th>
                  <th className="py-2 pr-3 text-right font-semibold">Écart</th>
                  <th className="py-2 pr-3 text-right font-semibold">% utilisé</th>
                  <th className="py-2 pl-3 font-semibold" style={{ minWidth: 140 }}>Progression</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const over = r.pct > 1, warn = !over && r.pct > 0.85;
                  return (
                    <tr key={r.id} className="border-b border-border/60 last:border-none">
                      <td className="py-2.5 pr-3">{r.name}</td>
                      <td className="py-2.5 pr-3">
                        <form action={updateCategoryBudget.bind(null, r.id)} className="flex items-center justify-end gap-1.5">
                          <input
                            name="monthly_budget" type="number" min="0" step="1" defaultValue={r.monthly_budget}
                            className="w-28 rounded-md border border-border bg-background px-2 py-1 text-right text-[13px] tabular-nums outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                          />
                          <button type="submit" aria-label={`Enregistrer le budget de ${r.name}`} className="rounded-md p-1 text-muted-foreground hover:bg-success/10 hover:text-success">
                            <Icon name="checkCircle" className="h-4 w-4" />
                          </button>
                        </form>
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">{formatMoney(r.reel)}</td>
                      <td className={cn("py-2.5 pr-3 text-right tabular-nums font-medium", r.ecart >= 0 ? "text-success" : "text-danger")}>
                        {formatMoney(r.ecart)}
                      </td>
                      <td className="py-2.5 pr-3 text-right tabular-nums">{formatPercent(r.pct, 0)}</td>
                      <td className="py-2.5 pl-3">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", over ? "bg-danger" : warn ? "bg-warn" : "bg-success")}
                            style={{ width: `${Math.min(r.pct, 1) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="py-2.5 pr-3">TOTAL</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{formatMoney(totalBudget)}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{formatMoney(totalReel)}</td>
                  <td className={cn("py-2.5 pr-3 text-right tabular-nums", totalBudget - totalReel >= 0 ? "text-success" : "text-danger")}>
                    {formatMoney(totalBudget - totalReel)}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{formatPercent(totalBudget ? totalReel / totalBudget : 0, 0)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
