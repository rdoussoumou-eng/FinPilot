const CURRENCY = "FCFA";

/** Parses a date-only string ("2026-08-06", as Postgres `date` columns come
 *  back from Supabase) as local midnight rather than UTC midnight — plain
 *  `new Date("2026-08-06")` shifts a day in negative-UTC timezones once you
 *  read it back with local getters (getFullYear, toLocaleDateString, …). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Today as "YYYY-MM-DD" in local time — the inverse mistake of the above:
 *  `new Date().toISOString().slice(0,10)` converts through UTC first, which
 *  can show yesterday's or tomorrow's date depending on the server's timezone
 *  and the time of day. */
export function todayLocalISODate(): string {
  const d = new Date();
  const y = String(d.getFullYear()).padStart(4, "0");
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatMoney(value: number, opts: { signed?: boolean } = {}) {
  const abs = Math.abs(Math.round(value));
  const formatted = abs.toLocaleString("fr-FR");
  const sign = value < 0 ? "-" : opts.signed && value > 0 ? "+" : "";
  return `${sign}${formatted} ${CURRENCY}`;
}

export function formatCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)} M`;
  if (abs >= 1_000) return `${Math.round(value / 1_000)} k`;
  return `${Math.round(value)}`;
}

export function formatPercent(value: number, digits = 1) {
  return `${(value * 100).toLocaleString("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} %`;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}
