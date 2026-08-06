import { TopBar } from "@/components/layout/topbar";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getAccounts, getAllTransactions } from "@/lib/queries";
import { computeAccountBalances } from "@/lib/compute";
import { formatMoney, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export default async function Page() {
  const supabase = await createClient();
  const [user, accounts, allTx] = await Promise.all([getCurrentUser(), getAccounts(supabase), getAllTransactions(supabase)]);
  const balances = computeAccountBalances(allTx, accounts);

  const totalBalance = balances.reduce((s, b) => s + b.balance, 0);
  const totalIn = balances.reduce((s, b) => s + b.in, 0);
  const totalOut = balances.reduce((s, b) => s + b.out, 0);

  return (
    <>
      <TopBar title="Comptes" userEmail={user?.email} />
      <main className="container flex flex-col gap-4 py-6">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {balances.map((b) => {
            const share = totalBalance ? b.balance / totalBalance : 0;
            return (
              <div key={b.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground">
                    <Icon name="wallet" className="h-4 w-4 text-navy dark:text-gold" /> {b.name}
                  </h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                    {formatPercent(share, 0)}
                  </span>
                </div>
                <p className={cn("font-display text-[20px] font-bold", b.balance >= 0 ? "text-foreground" : "text-danger")}>
                  {formatMoney(b.balance)}
                </p>
                <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${Math.max(Math.min(share * 100, 100), 0)}%` }} />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11.5px]">
                  <span className="text-success">+ {formatMoney(b.in)}</span>
                  <span className="text-danger">− {formatMoney(b.out)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Total</h3>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Total entrées</p>
              <p className="font-display text-[18px] font-bold text-success">{formatMoney(totalIn)}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Total sorties</p>
              <p className="font-display text-[18px] font-bold text-danger">{formatMoney(totalOut)}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Solde global</p>
              <p className="font-display text-[18px] font-bold text-foreground">{formatMoney(totalBalance)}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
