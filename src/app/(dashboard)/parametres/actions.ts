"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Categories/accounts feed the dropdowns and derived numbers on nearly every
// page (Transactions, Budget, Dashboard, Comptes, Analyses, Accueil) — a
// rename or deletion here needs to invalidate all of them, not just this page.
function revalidateEverywhere() {
  revalidatePath("/parametres");
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budget");
  revalidatePath("/comptes");
  revalidatePath("/analyses");
}

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Le nom de la catégorie est requis");

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    monthly_budget: Math.max(0, Math.abs(Number(formData.get("monthly_budget")) || 0)),
  });
  if (error) throw new Error(error.message);
  revalidateEverywhere();
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateEverywhere();
}

export async function addAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Le nom du compte est requis");

  const { error } = await supabase.from("accounts").insert({ user_id: user.id, name });
  if (error) throw new Error(error.message);
  revalidateEverywhere();
}

export async function deleteAccount(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateEverywhere();
}

export async function addAllowedEmail(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) throw new Error("L'adresse email est requise");

  const { error } = await supabase.from("allowed_emails").insert({ email });
  if (error) throw new Error(error.message);
  revalidatePath("/parametres");
}

export async function removeAllowedEmail(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("allowed_emails").delete().eq("email", email);
  if (error) throw new Error(error.message);
  revalidatePath("/parametres");
}
