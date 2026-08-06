"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addGoal(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const targetDate = formData.get("target_date");

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    name: String(formData.get("name") || "").trim() || "Nouvel objectif",
    target_amount: Math.abs(Number(formData.get("target_amount")) || 0),
    current_amount: Math.abs(Number(formData.get("current_amount")) || 0),
    target_date: targetDate ? String(targetDate) : null,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/objectifs");
  revalidatePath("/");
}

export async function deleteGoal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("goals").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/objectifs");
  revalidatePath("/");
}
