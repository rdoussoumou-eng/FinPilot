"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  });
  if (error) {
    redirect(`/login?mode=signin&error=${encodeURIComponent(error.message)}`);
  }
  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const { error } = await supabase.auth.signUp({ email, password: String(formData.get("password") || "") });

  if (error) {
    // Supabase returns a generic-looking signUp response for an existing,
    // *unconfirmed* address (to avoid leaking which emails are registered) —
    // but for an already-confirmed one it errors outright. Route that specific
    // case straight to sign-in instead of showing a dead-end error.
    const alreadyExists = error.code === "user_already_exists" || error.code === "email_exists"
      || /already registered/i.test(error.message);
    if (alreadyExists) {
      redirect(`/login?mode=signin&email=${encodeURIComponent(email)}&notice=${encodeURIComponent("Un compte existe déjà avec cet email — connectez-vous ci-dessous.")}`);
    }
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`);
  }
  redirect(`/login?mode=signin&email=${encodeURIComponent(email)}&justSignedUp=1`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
