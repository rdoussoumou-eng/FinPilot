import type { SupabaseClient } from "@supabase/supabase-js";
import type { AccountRow, CategoryRow, GoalRow, TransactionRow } from "@/types/db";
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES, DEFAULT_MONTHLY_BUDGET } from "@/types/db";

function isoDate(year: number, monthIndex0: number, day: number) {
  // Built by hand rather than via `new Date(...).toISOString()`, which
  // converts through UTC and silently shifts a day whenever the server's
  // local timezone isn't UTC (Vercel defaults to UTC, but nothing should
  // depend on that holding true forever).
  const y = String(year).padStart(4, "0");
  const m = String(monthIndex0 + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** `monthIndex0` is 0-based (0 = January), matching `Date#getMonth()`. Handles
 *  month/year rollover in both directions (e.g. monthIndex0 = -1 or = 12). */
export function monthRange(year: number, monthIndex0: number) {
  const start = new Date(year, monthIndex0, 1);
  const end = new Date(year, monthIndex0 + 1, 1);
  return {
    start: isoDate(start.getFullYear(), start.getMonth(), 1),
    end: isoDate(end.getFullYear(), end.getMonth(), 1),
  };
}

function monthBounds(offsetMonths: number) {
  const now = new Date();
  return monthRange(now.getFullYear(), now.getMonth() + offsetMonths);
}

function inRange(occurredOn: string, start: string, end: string) {
  return occurredOn >= start && occurredOn < end; // ISO "YYYY-MM-DD" sorts lexicographically = chronologically
}

/** First-login bootstrap: a brand-new account has no categories/accounts yet.
 *  Seeds the same defaults the original workbook shipped with, once. Only
 *  called when the caller has already checked `user.user_metadata.onboarded`
 *  is unset — see (dashboard)/layout.tsx — so this COUNT query itself only
 *  ever runs once per account, not on every page load. */
export async function ensureDefaultData(supabase: SupabaseClient, userId: string) {
  const { count } = await supabase.from("categories").select("id", { count: "exact", head: true });
  if (count && count > 0) return;

  await supabase.from("categories").insert(
    DEFAULT_CATEGORIES.map((name) => ({ user_id: userId, name, monthly_budget: DEFAULT_MONTHLY_BUDGET }))
  );
  await supabase.from("accounts").insert(
    DEFAULT_ACCOUNTS.map((name) => ({ user_id: userId, name }))
  );
}

export async function getCategories(supabase: SupabaseClient): Promise<CategoryRow[]> {
  const { data, error } = await supabase.from("categories").select("id,name,monthly_budget").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAccounts(supabase: SupabaseClient): Promise<AccountRow[]> {
  const { data, error } = await supabase.from("accounts").select("id,name").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getGoals(supabase: SupabaseClient): Promise<GoalRow[]> {
  const { data, error } = await supabase.from("goals").select("id,name,target_amount,current_amount,target_date").order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function getAllTransactions(supabase: SupabaseClient): Promise<TransactionRow[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("id,occurred_on,label,category_id,account_id,amount,payment_mode,status")
    .order("occurred_on", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Everything the Accueil page needs. Fetches transactions ONCE (`allTx` is
 *  needed anyway for the all-time balance) and derives the current/previous
 *  month slices in memory instead of two extra round trips to Supabase. */
export async function getDashboardData(supabase: SupabaseClient) {
  const cur = monthBounds(0);
  const prev = monthBounds(-1);

  const [categories, accounts, goals, allTx] = await Promise.all([
    getCategories(supabase),
    getAccounts(supabase),
    getGoals(supabase),
    getAllTransactions(supabase),
  ]);

  const currentTx = allTx.filter((t) => inRange(t.occurred_on, cur.start, cur.end));
  const previousTx = allTx.filter((t) => inRange(t.occurred_on, prev.start, prev.end));

  return { categories, accounts, goals, allTx, currentTx, previousTx };
}

/** Same idea as getDashboardData but for an arbitrary, explicitly chosen
 *  month — used by Tableau de bord and Budget mensuel, whose period the user
 *  picks instead of always looking at "now". Doesn't fetch accounts: neither
 *  caller needs them. */
export async function getMonthlyOverview(supabase: SupabaseClient, year: number, monthIndex0: number) {
  const cur = monthRange(year, monthIndex0);
  const prev = monthRange(year, monthIndex0 - 1);

  const [categories, allTx] = await Promise.all([
    getCategories(supabase),
    getAllTransactions(supabase),
  ]);

  const currentTx = allTx.filter((t) => inRange(t.occurred_on, cur.start, cur.end));
  const previousTx = allTx.filter((t) => inRange(t.occurred_on, prev.start, prev.end));

  return { categories, allTx, currentTx, previousTx };
}

