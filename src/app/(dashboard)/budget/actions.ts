"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateCategoryBudget(categoryId: string, formData: FormData) {
  const supabase = await createClient();
  const monthlyBudget = Math.max(0, Math.abs(Number(formData.get("monthly_budget")) || 0));

  const { error } = await supabase
    .from("categories")
    .update({ monthly_budget: monthlyBudget })
    .eq("id", categoryId);
  if (error) throw new Error(error.message);

  revalidatePath("/budget");
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/parametres");
}
