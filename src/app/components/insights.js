"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@/app/components/ui/card";
import { Pill } from "@/app/components/ui/pill";
import { computeInsights } from "@/lib/finance";
import { formatMoney, formatMonthLabel, formatSignedMoney } from "@/lib/format";

function InsightRow({ title, value, detail, tone = "neutral" }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        {detail ? <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{detail}</div> : null}
      </div>
      <div className="shrink-0 text-right">
        <Pill tone={tone}>{value}</Pill>
      </div>
    </div>
  );
}

export function Insights({ transactions }) {
  const insights = React.useMemo(() => computeInsights(transactions), [transactions]);

  if (!transactions.length) {
    return (
      <Card>
        <CardHeader title="Insights" subtitle="Highlights derived from your activity" />
        <CardBody className="pt-4">
          <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-400 dark:ring-zinc-800">
            No insights yet. Add transactions (Admin role) or reset demo data.
          </div>
        </CardBody>
      </Card>
    );
  }

  const top = insights.highestSpendingCategory;
  const mom = insights.monthOverMonth;
  const streak = insights.streak;

  const deltaTone = (mom?.delta ?? 0) >= 0 ? "positive" : "negative";
  const deltaLabel = mom?.delta != null ? formatSignedMoney(mom.delta) : "—";
  const pctLabel = mom?.pct == null ? "n/a" : `${Math.round(mom.pct)}%`;

  return (
    <Card>
      <CardHeader title="Insights" subtitle="Small, useful observations from the data" />
      <CardBody className="pt-4">
        <div className="space-y-3">
          <InsightRow
            title="Highest spending category"
            value={top ? `${top.label}: ${formatMoney(top.value)}` : "—"}
            detail="Based on expenses only."
            tone="negative"
          />

          <InsightRow
            title="Month-over-month net change"
            value={`${deltaLabel} (${pctLabel})`}
            detail={
              mom?.curMonth && mom?.prevMonth
                ? `${formatMonthLabel(mom.prevMonth)} → ${formatMonthLabel(mom.curMonth)}`
                : "Last 2 months"
            }
            tone={deltaTone}
          />

          <InsightRow
            title="Spending cadence (last 14 days)"
            value={`${streak?.daysWithSpendLast14 ?? 0} days`}
            detail="Counts distinct days with at least one expense."
            tone="neutral"
          />
        </div>
      </CardBody>
    </Card>
  );
}

