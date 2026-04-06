"use client";

import React from "react";
import { Card } from "@/app/components/ui/card";
import { formatMoney, formatSignedMoney } from "@/lib/format";
import { computeSummary } from "@/lib/finance";

function MiniMetric({ label, value, hint, tone = "neutral" }) {
  const tones = {
    neutral: "text-zinc-950 dark:text-zinc-50",
    positive: "text-emerald-700 dark:text-emerald-300",
    negative: "text-rose-700 dark:text-rose-300",
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className={["text-xl font-semibold tracking-tight", tones[tone]].join(" ")}>
        {value}
      </div>
      {hint ? <div className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</div> : null}
    </div>
  );
}

export function SummaryCards({ transactions }) {
  const summary = React.useMemo(() => computeSummary(transactions), [transactions]);

  const netTone = summary.net >= 0 ? "positive" : "negative";
  const netHint =
    summary.net >= 0 ? "Net positive so far" : "You\u2019re spending more than you earn";

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card className="p-5">
        <MiniMetric
          label="Total balance"
          value={formatSignedMoney(summary.net)}
          hint={netHint}
          tone={netTone}
        />
        <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
            style={{ width: `${Math.min(100, Math.max(18, (Math.abs(summary.net) / 6000) * 100))}%` }}
          />
        </div>
      </Card>

      <Card className="p-5">
        <MiniMetric
          label="Income"
          value={formatMoney(summary.income)}
          hint="Includes salary + extra payouts"
          tone="positive"
        />
        <div className="mt-4 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/40"
              style={{ opacity: 0.35 + i * 0.06 }}
            />
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <MiniMetric
          label="Expenses"
          value={formatMoney(summary.expenses)}
          hint="Only expenses (no transfers)"
          tone="negative"
        />
        <div className="mt-4 grid grid-cols-10 gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-lg bg-rose-100 dark:bg-rose-950/40"
              style={{ opacity: 0.35 + i * 0.06 }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

