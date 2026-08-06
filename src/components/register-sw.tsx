"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      // A cache-first worker over /_next/static/* is fundamentally incompatible
      // with `next dev`: those URLs keep the same path across restarts but their
      // content changes every time, so a worker registered in an earlier dev
      // session serves a stale webpack runtime — exactly the "Cannot read
      // properties of undefined (reading 'call')" crash. Actively clean up any
      // leftover registration/cache from a previous run, self-healing browsers
      // that already have the bad state cached.
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installability just degrades gracefully — the app still works without it.
    });
  }, []);
  return null;
}
