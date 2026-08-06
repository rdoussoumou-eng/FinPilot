import Link from "next/link";
import { signIn, signUp } from "./actions";

export const metadata = { title: "Connexion — Tableau de Bord Financier Premium" };

// Next.js 14: searchParams is a plain object, not a Promise.
// No client component here on purpose: useFormState/useFormStatus need React 19
// (this project pins React 18 for Next 14 compatibility), and a plain <form
// action={...}> + redirect-driven error/message passing needs zero client JS —
// one less thing that can break between here and a real device.
//
// The one bit of plain <script> below replaces what useFormStatus would have
// given us (disable the button while the action runs): signUp() round-trips
// to Supabase and sends the confirmation email synchronously, so it can take
// several seconds — without this, repeated clicks queue up duplicate signups
// and eventually trip Supabase's own rate limit.
export default function LoginPage({
  searchParams,
}: { searchParams: { mode?: string; error?: string; justSignedUp?: string; notice?: string; email?: string } }) {
  const mode = searchParams.mode === "signup" ? "signup" : "signin";
  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy to-[#142038] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-card">
        <p className="font-display text-lg font-bold text-foreground">
          {isSignup ? "Créer un compte" : "Se connecter"}
        </p>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          Tableau de Bord Financier Premium
        </p>

        {searchParams.justSignedUp && (
          <p className="mt-4 rounded-lg bg-success/10 px-3 py-2 text-[12.5px] text-success">
            Compte créé — vérifiez votre boîte mail et cliquez le lien de confirmation, puis connectez-vous ci-dessous.
          </p>
        )}
        {searchParams.notice && (
          <p className="mt-4 rounded-lg bg-accent px-3 py-2 text-[12.5px] text-foreground">
            {searchParams.notice}
          </p>
        )}
        {searchParams.error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-[12.5px] text-danger">
            {searchParams.error}
          </p>
        )}

        <form id="authForm" action={isSignup ? signUp : signIn} className="mt-5 flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Email
            </label>
            <input
              id="email" name="email" type="email" required autoComplete="email"
              defaultValue={searchParams.email ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Mot de passe
            </label>
            <input
              id="password" name="password" type="password" required minLength={6}
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <button
            id="authSubmit"
            type="submit"
            className="w-full rounded-full bg-gold py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSignup ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){
              var f=document.getElementById('authForm'),b=document.getElementById('authSubmit');
              if(!f||!b) return;
              f.addEventListener('submit', function(){
                if (b.disabled) return;
                b.disabled = true;
                b.textContent = 'Un instant…';
              });
            })();`,
          }}
        />

        <Link
          href={isSignup ? "/login?mode=signin" : "/login?mode=signup"}
          className="mt-4 block w-full text-center text-[12.5px] text-muted-foreground underline-offset-2 hover:underline"
        >
          {isSignup ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? En créer un"}
        </Link>
      </div>
    </div>
  );
}
