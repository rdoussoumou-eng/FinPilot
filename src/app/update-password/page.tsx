import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata = { title: "Nouveau mot de passe — Tableau de Bord Financier Premium" };

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy to-[#142038] p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 shadow-card">
        <p className="font-display text-lg font-bold text-foreground">Nouveau mot de passe</p>
        <p className="mt-1 text-[12.5px] text-muted-foreground">
          Tableau de Bord Financier Premium
        </p>
        <div className="mt-5">
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
