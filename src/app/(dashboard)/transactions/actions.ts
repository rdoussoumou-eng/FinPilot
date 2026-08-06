"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Every page that derives numbers from transactions — a transaction touches
// balances, budgets, category totals and yearly summaries all at once.
function revalidateTransactionDerivedPages() {
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  revalidatePath("/comptes");
  revalidatePath("/analyses");
  revalidatePath("/historique");
}

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const type = String(formData.get("type") || "out");
  const rawAmount = Math.abs(Number(formData.get("amount")) || 0);
  const amount = type === "in" ? rawAmount : -rawAmount;

  const date = formData.get("date");
  if (!date) throw new Error("La date est requise");

  const categoryId = formData.get("category_id");
  const accountId = formData.get("account_id");
  const paymentMode = formData.get("payment_mode");

  const { error } = await supabase.from("transactions").insert({
    user_id: user.id,
    occurred_on: String(date),
    label: String(formData.get("label") || "").trim() || "Nouvelle opération",
    category_id: categoryId ? String(categoryId) : null,
    account_id: accountId ? String(accountId) : null,
    amount,
    payment_mode: paymentMode ? String(paymentMode).trim() || null : null,
    status: "pending",
  });
  if (error) throw new Error(error.message);

  revalidateTransactionDerivedPages();
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateTransactionDerivedPages();
}
