"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid" | "saving" | "done">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    // The recovery link's tokens are consumed by the SDK from the URL as
    // soon as it initializes — by the time onAuthStateChange fires (or a
    // session already exists), it's safe to show the form.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setStatus("ready");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("ready");
      else setTimeout(() => setStatus((s) => (s === "checking" ? "invalid" : s)), 1500);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const password = String(new FormData(form).get("password") || "");
    const confirm = String(new FormData(form).get("confirm") || "");
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setError(null);
    setStatus("saving");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setStatus("ready");
      return;
    }
    setStatus("done");
    setTimeout(() => router.push("/"), 1500);
  }

  if (status === "checking") {
    return <p className="text-[13px] text-muted-foreground">Vérification du lien…</p>;
  }

  if (status === "invalid") {
    return (
      <div className="flex flex-col gap-3">
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-[12.5px] text-danger">
          Ce lien de réinitialisation est invalide ou a expiré.
        </p>
        <Link
          href="/login?mode=reset"
          className="text-center text-[12.5px] text-muted-foreground underline-offset-2 hover:underline"
        >
          Redemander un lien
        </Link>
      </div>
    );
  }

  if (status === "done") {
    return (
      <p className="rounded-lg bg-success/10 px-3 py-2 text-[12.5px] text-success">
        Mot de passe mis à jour — redirection…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {error && (
        <p className="rounded-lg bg-danger/10 px-3 py-2 text-[12.5px] text-danger">{error}</p>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Nouveau mot de passe
        </label>
        <input
          id="password" name="password" type="password" required minLength={6} autoComplete="new-password"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Confirmer le mot de passe
        </label>
        <input
          id="confirm" name="confirm" type="password" required minLength={6} autoComplete="new-password"
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
        />
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-full bg-gold py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "saving" ? "Un instant…" : "Mettre à jour le mot de passe"}
      </button>
    </form>
  );
}
