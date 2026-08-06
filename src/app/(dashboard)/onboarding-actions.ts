"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markGuideSeen() {
  const supabase = await createClient();
  await supabase.auth.updateUser({ data: { guide_seen: true } });
  revalidatePath("/");
}
