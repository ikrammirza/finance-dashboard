"use client";

import React from "react";
import { DashboardProvider, useDashboard } from "@/store/dashboard-context";

function ThemeSync() {
  const { state } = useDashboard();

  React.useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");

    const apply = () => {
      const prefersDark = media?.matches;
      const resolved =
        state.theme === "system" ? (prefersDark ? "dark" : "light") : state.theme;

      root.classList.toggle("dark", resolved === "dark");
      root.style.colorScheme = resolved;
    };

    apply();

    if (state.theme !== "system" || !media) return;
    const onChange = () => apply();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, [state.theme]);

  return null;
}

export function Providers({ children }) {
  return (
    <DashboardProvider>
      <ThemeSync />
      {children}
    </DashboardProvider>
  );
}

