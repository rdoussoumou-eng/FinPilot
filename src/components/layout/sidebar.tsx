import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";

/** Fixed desktop sidebar. A Server Component — everything here is static
 *  except the active-link state, which lives in <SidebarNav>. */
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col gap-5 bg-gradient-to-b from-navy to-[#142038] px-4 py-6 text-white lg:flex">
      <Link href="/" className="border-b border-white/12 px-2 pb-4">
        <p className="font-display text-[15.5px] font-bold leading-tight tracking-wide">
          TABLEAU DE BORD<br /><span className="text-gold-soft">FINANCIER PREMIUM</span>
        </p>
      </Link>
      <SidebarNav />
      <p className="mt-auto border-t border-white/12 pt-3 text-[10.5px] leading-relaxed text-white/40">
        Espace personnel · Modèle premium
      </p>
    </aside>
  );
}
