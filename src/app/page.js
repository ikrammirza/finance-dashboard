"use client";

import { Header } from "@/app/components/header";
import { SummaryCards } from "@/app/components/summary-cards";
import { TrendChart } from "@/app/components/trend-chart";
import { CategoryBreakdown } from "@/app/components/category-breakdown";
import { TransactionsPanel } from "@/app/components/transactions/transactions-panel";
import { Insights } from "@/app/components/insights";
import { useDashboard } from "@/store/dashboard-context";

export default function Home() {
  const { state } = useDashboard();
  return (
    <div className="min-h-full">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/10 to-amber-500/10 p-6 ring-1 ring-zinc-200/70 dark:ring-zinc-800/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.16),transparent_50%)]" />
          <div className="relative">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  {state.role === "admin" ? "Admin" : "Viewer"} mode
                </div>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Understand your money at a glance
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
                  A focused dashboard for summary, patterns, and a searchable transaction feed. No backend — state is managed client-side.
                </p>
              </div>

              <div className="mt-2 rounded-2xl bg-white/60 px-4 py-3 text-xs text-zinc-600 ring-1 ring-zinc-200/70 backdrop-blur-sm dark:bg-zinc-950/40 dark:text-zinc-300 dark:ring-zinc-800/70">
                Tip: Switch to <span className="font-semibold">Admin</span> to add/edit transactions.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <SummaryCards transactions={state.transactions} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TrendChart transactions={state.transactions} />
          <CategoryBreakdown transactions={state.transactions} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionsPanel />
          </div>
          <div className="lg:col-span-1">
            <Insights transactions={state.transactions} />
          </div>
        </div>

        <footer className="mt-8 border-t border-zinc-200/70 pt-5 text-xs text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-400">
          Built for the Zorvyn frontend evaluation — mock data, role-based UI simulation, responsive Tailwind layout.
        </footer>
      </main>
    </div>
  );
}
