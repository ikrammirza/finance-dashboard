"use client";

import { useEffect } from "react";
import { useDashboard } from "@/store/dashboard-context";

export default function ThemeHandler() {
  const { state } = useDashboard();

  useEffect(() => {
    const root = document.documentElement;

    if (state.theme === "dark") {
      root.classList.add("dark");
    } else if (state.theme === "light") {
      root.classList.remove("dark");
    } else {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDark);
    }
  }, [state.theme]);

  return null;
}