import { TopBar } from "@/components/layout/topbar";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getAllTransactions } from "@/lib/queries";
import { sumIn, sumOut } from "@/lib/compute";
import { formatMoney, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const YEARS = [2024, 2025, 2026, 2027, 2028];

export default async function Page() {
  const supabase = await createClient();
  const [user, allTx] = await Promise.all([getCurrentUser(), getAllTransactions(supabase)]);

  const rows = YEARS.map((year) => {
    const yearStr = String(year);
    const yearTx = allTx.filter((t) => t.occurred_on.slice(0, 4) === yearStr);
    const revenus = sumIn(yearTx), depenses = sumOut(yearTx);
    return { year, revenus, depenses, epargne: revenus - depenses, taux: revenus ? (revenus - depenses) / revenus : 0, count: yearTx.length };
  });
  const maxValue = Math.max(1, ...rows.map((r) => Math.max(r.revenus, r.depenses)));

  return (
    <>
      <TopBar title="Historique annuel" userEmail={user?.email} />
      <main className="container flex flex-col gap-4 py-6">
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-gold-soft bg-accent px-4 py-2.5 text-[12px] text-muted-foreground">
          <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          Ce tableau se met à jour automatiquement dès que des transactions existent pour l&rsquo;année concernée.
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="border-b border-border text-left text-[10.5px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Année</th>
                  <th className="py-2 pr-3 text-right font-semibold">Revenus</th>
                  <th className="py-2 pr-3 text-right font-semibold">Dépenses</th>
                  <th className="py-2 pr-3 text-right font-semibold">Épargne</th>
                  <th className="py-2 pr-3 text-right font-semibold">Taux d&rsquo;épargne</th>
                  <th className="py-2 pl-3 text-right font-semibold">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.year} className="border-b border-border/60 last:border-none">
                    <td className="py-2 pr-3 font-semibold">{r.year}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-success">{formatMoney(r.revenus)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-danger">{formatMoney(r.depenses)}</td>
                    <td className={cn("py-2 pr-3 text-right tabular-nums", r.epargne >= 0 ? "text-foreground" : "text-danger")}>{formatMoney(r.epargne)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{formatPercent(r.taux, 0)}</td>
                    <td className="py-2 pl-3 text-right tabular-nums text-muted-foreground">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-4 text-[13.5px] font-semibold text-foreground">Revenus vs Dépenses par année</h3>
          <div className="flex flex-col gap-4">
            {rows.map((r) => (
              <div key={r.year} className="flex items-center gap-3">
                <span className="w-12 shrink-0 text-[12.5px] font-semibold text-muted-foreground">{r.year}</span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success" style={{ width: `${(r.revenus / maxValue) * 100}%` }} />
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-danger" style={{ width: `${(r.depenses / maxValue) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-success" /> Revenus</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-danger" /> Dépenses</span>
          </div>
        </div>
      </main>
    </>
  );
}
