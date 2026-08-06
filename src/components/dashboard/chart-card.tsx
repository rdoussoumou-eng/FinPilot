"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ChartCard({
  title, hint, children, className,
}: { title: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className={`rounded-xl border border-border bg-card p-5 shadow-card ${className ?? ""}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13.5px] font-semibold text-foreground">{title}</h3>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </motion.div>
  );
}
