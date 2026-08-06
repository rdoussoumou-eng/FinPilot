"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Icon } from "@/components/icon";
import { MobileDrawer } from "@/components/layout/mobile-drawer";
import { signOut } from "@/app/login/actions";

export function TopBar({ title, userEmail }: { title: string; userEmail?: string }) {
  const { theme, setTheme } = useTheme();
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "?";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-card/90 px-5 py-3.5 backdrop-blur supports-[backdrop-filter]:bg-card/70 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileDrawer />
        <h1 className="font-display text-[19px] font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative hidden md:block">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une transaction, une catégorie…"
            className="w-[260px] rounded-full border-border bg-secondary/60 pl-9 text-[13px]"
            aria-label="Rechercher"
          />
        </div>

        <Button asChild size="sm" className="hidden gap-1.5 rounded-full bg-gold text-navy hover:bg-gold/90 sm:flex">
          <Link href="/transactions">
            <Icon name="plus" className="h-4 w-4" />
            Nouvelle transaction
          </Link>
        </Button>
        <Button asChild size="icon" className="rounded-full bg-gold text-navy hover:bg-gold/90 sm:hidden" aria-label="Nouvelle transaction">
          <Link href="/transactions">
            <Icon name="plus" className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Icon name="bell" className="h-[18px] w-[18px]" />
          <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 justify-center rounded-full bg-danger p-0 text-[9px]">3</Badge>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Basculer le thème"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} className="h-[18px] w-[18px]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-secondary" aria-label="Menu profil">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-navy text-[12px] font-semibold text-white">{initials}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{userEmail ?? "Mon compte"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/parametres"><Icon name="settings" className="mr-2 h-4 w-4" /> Paramètres rapides</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-danger" onSelect={() => signOut()}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
