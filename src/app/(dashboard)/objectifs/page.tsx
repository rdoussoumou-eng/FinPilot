import { TopBar } from "@/components/layout/topbar";
import { Icon } from "@/components/icon";
import { GoalsCard } from "@/components/dashboard/goals-card";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { getGoals } from "@/lib/queries";
import { addGoal, deleteGoal } from "./actions";

export default async function Page() {
  const supabase = await createClient();
  const [user, goals] = await Promise.all([getCurrentUser(), getGoals(supabase)]);

  return (
    <>
      <TopBar title="Objectifs financiers" userEmail={user?.email} />
      <main className="container flex flex-col gap-6 py-6">
        <details open className="group rounded-xl border border-border bg-card shadow-card open:shadow-card-hover">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-4 text-[13.5px] font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-white transition-transform group-open:rotate-45">
              <Icon name="plus" className="h-3.5 w-3.5" />
            </span>
            Nouvel objectif
          </summary>
          <form action={addGoal} className="grid grid-cols-1 gap-3.5 border-t border-border p-5 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 sm:col-span-3">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Nom</label>
              <input name="name" type="text" placeholder="ex. Voyage" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Montant cible (FCFA)</label>
              <input name="target_amount" type="number" min="0" step="1" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Montant actuel (FCFA)</label>
              <input name="current_amount" type="number" min="0" step="1" defaultValue={0} className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date cible (optionnel)</label>
              <input name="target_date" type="date" className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
            </div>
            <div className="sm:col-span-3">
              <button type="submit" className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-white hover:opacity-90">
                Créer l&rsquo;objectif
              </button>
            </div>
          </form>
        </details>

        <GoalsCard goals={goals} showLink={false} onDelete={deleteGoal} />
      </main>
    </>
  );
}
