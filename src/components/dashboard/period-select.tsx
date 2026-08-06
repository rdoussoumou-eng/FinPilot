import { MOIS } from "@/lib/compute";

/** Zero-JS period picker — a plain GET form, so it works even if client JS
 *  fails to hydrate (and there's nothing here for me to get wrong without
 *  a way to test it). Pass `showMonth={false}` for year-only pages (Analyses,
 *  Historique) — showing a month picker that the page silently ignores would
 *  mislead the user into thinking it does something. */
export function PeriodSelect({
  action, year, month, showMonth = true, years = [2024, 2025, 2026, 2027, 2028],
}: { action: string; year: number; month?: number; showMonth?: boolean; years?: number[] }) {
  return (
    <form method="get" action={action} className="flex flex-wrap items-center gap-2.5">
      {showMonth && (
        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5">
          <label htmlFor="month" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Mois</label>
          <select id="month" name="month" defaultValue={month} className="bg-transparent text-[13px] font-semibold outline-none">
            {MOIS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
        </div>
      )}
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5">
        <label htmlFor="year" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Année</label>
        <select id="year" name="year" defaultValue={year} className="bg-transparent text-[13px] font-semibold outline-none">
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <button type="submit" className="rounded-lg bg-gold px-3.5 py-2 text-[12.5px] font-bold text-white hover:opacity-90">
        Afficher
      </button>
    </form>
  );
}
