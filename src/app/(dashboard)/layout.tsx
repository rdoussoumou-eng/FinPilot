import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { ensureDefaultData } from "@/lib/queries";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // user_metadata.onboarded is set once, right after seeding — checking it
  // costs nothing (already have `user`), so most page loads skip the
  // categories COUNT query entirely instead of running it on every navigation.
  if (!user.user_metadata?.onboarded) {
    const supabase = await createClient();
    await ensureDefaultData(supabase, user.id);
    await supabase.auth.updateUser({ data: { onboarded: true } });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
