"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Select } from "@/app/components/ui/field";
import { useDashboard } from "@/store/dashboard-context";

function ThemeIcon({ theme }) {
  const common = "h-4 w-4";
  if (theme === "dark") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  if (theme === "light") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M12 2v2M12 20v2M4 12H2M22 12h-2M4.9 4.9 6.3 6.3M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M7 7V5.5A2.5 2.5 0 0 1 9.5 3h5A2.5 2.5 0 0 1 17 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { state, dispatch } = useDashboard();

  return (
    <div className="sticky top-0 z-20 border-b border-zinc-200/70 bg-zinc-50/75 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-zinc-950/55">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-sm" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight">Finance Dashboard</div>
              <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">Mock data • Frontend-only • Role demo</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Select
              aria-label="Role"
              value={state.role}
              onChange={(e) => dispatch({ type: "set_role", role: e.target.value })}
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </Select>
          </div>

          <Button
            variant="subtle"
            onClick={() => {
              const next = state.theme === "system" ? "light" : state.theme === "light" ? "dark" : "system";
              dispatch({ type: "set_theme", theme: next });
            }}
            className="gap-2"
            title="Toggle theme"
          >
            <ThemeIcon theme={state.theme} />
            <span className="hidden sm:inline">{state.theme}</span>
          </Button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:hidden">
        <Select
          aria-label="Role"
          value={state.role}
          onChange={(e) => dispatch({ type: "set_role", role: e.target.value })}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </Select>
      </div>
    </div>
  );
}

