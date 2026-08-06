"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Icon } from "@/components/icon";

/** Sidebar becomes a slide-in Drawer below the `lg` breakpoint. */
export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Ouvrir le menu">
          <Icon name="menu" className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[260px] border-none bg-gradient-to-b from-navy to-[#142038] p-4 text-white"
      >
        <p className="border-b border-white/12 px-2 pb-4 pt-2 font-display text-[15px] font-bold leading-tight tracking-wide">
          TABLEAU DE BORD<br /><span className="text-gold-soft">FINANCIER PREMIUM</span>
        </p>
        <div className="mt-2" onClick={() => setOpen(false)}>
          <SidebarNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}
