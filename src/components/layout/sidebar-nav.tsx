"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home, LayoutDashboard, Wallet, PieChart, Landmark, Target, LineChart, CalendarClock, SlidersHorizontal,
} from "lucide-react";

const NAV = [
  { group: null, items: [
    { href: "/", label: "Accueil", icon: Home },
  ]},
  { group: "Suivi", items: [
    { href: "/transactions", label: "Transactions", icon: Wallet },
    { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/budget", label: "Budget mensuel", icon: PieChart },
    { href: "/comptes", label: "Comptes", icon: Landmark },
  ]},
  { group: "Pilotage", items: [
    { href: "/objectifs", label: "Objectifs", icon: Target },
    { href: "/analyses", label: "Analyses", icon: LineChart },
    { href: "/historique", label: "Historique annuel", icon: CalendarClock },
    { href: "/parametres", label: "Paramètres", icon: SlidersHorizontal },
  ]},
];

/** Needs usePathname (for the active-link highlight) — the only reason this
 *  piece of the sidebar has to be a client component. */
export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((section) => (
        <div key={section.group ?? "root"} className="mb-2">
          {section.group && (
            <p className="px-3 pb-2 pt-4 text-[10px] font-semibold uppercase tracking-[.12em] text-white/40">
              {section.group}
            </p>
          )}
          {section.items.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] text-white/80 transition-colors",
                  "hover:bg-white/8 hover:text-white",
                  active && "bg-gold/15 text-white shadow-[inset_3px_0_0_hsl(var(--brand-gold))]"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
