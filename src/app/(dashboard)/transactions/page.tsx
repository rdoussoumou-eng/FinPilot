import { TopBar } from "@/components/layout/topbar";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getAccounts, getAllTransactions, getCategories } from "@/lib/queries";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { addTransaction, deleteTransaction } from "./actions";
import type { Transaction } from "@/types/finance";
import { parseLocalDate, todayLocalISODate } from "@/lib/format";

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const [categories, accounts, rows] = await Promise.all([
    getCategories(supabase), getAccounts(supabase), getAllTransactions(supabase),
  ]);

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  const accountName = new Map(accounts.map((a) => [a.id, a.name]));
  const transactions: Transaction[] = rows.map((t) => ({
    id: t.id,
    date: parseLocalDate(t.occurred_on),
    category: t.category_id ? categoryName.get(t.category_id) ?? "—" : "—",
    label: t.label,
    account: t.account_id ? accountName.get(t.account_id) ?? "—" : "—",
    amount: t.amount,
    status: t.status,
  }));

  const today = todayLocalISODate();

  return (
    <>
      <TopBar title="Transactions" userEmail={user?.email} />
      <main className="container flex flex-col gap-6 py-6">
        <details id="new" open className="group rounded-xl border border-border bg-card shadow-card open:shadow-card-hover">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-[13.5px] font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white transition-transform group-open:rotate-45">
              <Icon name="plus" className="h-3.5 w-3.5" />
            </span>
            Nouvelle transaction
          </summary>
          <form action={addTransaction} className="grid grid-cols-1 gap-3.5 border-t border-border p-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date</label>
              <input name="date" type="date" defaultValue={today} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Montant (FCFA)</label>
              <input name="amount" type="number" min="0" step="1" placeholder="ex. 15000" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Libellé</label>
              <input name="label" type="text" placeholder="ex. Courses de la semaine" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Catégorie</label>
              <select name="category_id" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Type</label>
              <select name="type" className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                <option value="out">Dépense</option>
                <option value="in">Revenu</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Compte</label>
              <select name="account_id" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Mode de paiement</label>
              <input name="payment_mode" type="text" placeholder="ex. Mobile Money" className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
                Ajouter la transaction
              </button>
            </div>
          </form>
        </details>

        <TransactionsTable transactions={transactions} onDelete={deleteTransaction} />
      </main>
    </>
  );
}
