import { TopBar } from "@/components/layout/topbar";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getAccounts, getCategories } from "@/lib/queries";
import { CategoryList } from "@/components/dashboard/category-list";
import { AccountList } from "@/components/dashboard/account-list";
import { addCategory, addAccount, deleteCategory, deleteAccount } from "./actions";

export default async function Page() {
  const supabase = await createClient();
  const [user, categories, accounts] = await Promise.all([getCurrentUser(), getCategories(supabase), getAccounts(supabase)]);

  return (
    <>
      <TopBar title="Paramètres" userEmail={user?.email} />
      <main className="container flex flex-col gap-4 py-6">
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-gold-soft bg-accent px-4 py-2.5 text-[12px] text-muted-foreground">
          <Icon name="settings" className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          Ces catégories et comptes alimentent les menus déroulants de Transactions et le budget mensuel.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Catégories & budgets mensuels</h3>
            <CategoryList categories={categories} onDelete={deleteCategory} />
            <details className="group mt-3">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12.5px] font-semibold text-navy dark:text-gold">
                <span className="transition-transform group-open:rotate-45"><Icon name="plus" className="h-3.5 w-3.5" /></span>
                Ajouter une catégorie
              </summary>
              <form action={addCategory} className="mt-3 flex flex-col gap-2.5 border-t border-border pt-3">
                <input
                  name="name" type="text" placeholder="Nom de la catégorie" required
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <input
                  name="monthly_budget" type="number" min="0" step="1" placeholder="Budget mensuel (FCFA)" defaultValue={40000}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <button type="submit" className="self-start rounded-full bg-gold px-4 py-2 text-[12.5px] font-bold text-white hover:opacity-90">
                  Ajouter
                </button>
              </form>
            </details>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="mb-3 text-[13.5px] font-semibold text-foreground">Comptes</h3>
            <AccountList accounts={accounts} onDelete={deleteAccount} />
            <details className="group mt-3">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[12.5px] font-semibold text-navy dark:text-gold">
                <span className="transition-transform group-open:rotate-45"><Icon name="plus" className="h-3.5 w-3.5" /></span>
                Ajouter un compte
              </summary>
              <form action={addAccount} className="mt-3 flex flex-col gap-2.5 border-t border-border pt-3">
                <input
                  name="name" type="text" placeholder="Nom du compte" required
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <button type="submit" className="self-start rounded-full bg-gold px-4 py-2 text-[12.5px] font-bold text-white hover:opacity-90">
                  Ajouter
                </button>
              </form>
            </details>
          </div>
        </div>
      </main>
    </>
  );
}
