"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@/app/components/ui/card";
import { groupSpendingByCategory } from "@/lib/finance";
import { formatMoney } from "@/lib/format";

function Donut({ slices }) {
  if (!slices.length) {
    return (
      <div className="flex h-44 items-center justify-center rounded-xl bg-zinc-50 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">No spending yet</div>
      </div>
    );
  }

  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 140 140" className="h-44 w-44">
      <defs>
        {slices.map((s) => (
          <linearGradient key={s.key} id={`g_${s.key}`} x1="0" x2="1">
            <stop offset="0" stopColor="rgba(99,102,241,1)" stopOpacity="0" />
            <stop offset="1" stopColor="rgba(217,70,239,1)" stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id="ring" x1="0" x2="1">
          <stop offset="0" stopColor="rgb(99,102,241)" />
          <stop offset="1" stopColor="rgb(217,70,239)" />
        </linearGradient>
      </defs>

      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="18" />

      {slices.map((s) => {
        const len = (s.value / total) * c;
        const dash = `${len} ${c - len}`;
        const style = {
          strokeDasharray: dash,
          strokeDashoffset: -offset,
        };
        offset += len;
        return (
          <circle
            key={s.key}
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={`url(#ring)`}
            strokeWidth="18"
            strokeLinecap="round"
            style={style}
            opacity={0.25 + Math.min(0.65, (s.value / total) * 1.2)}
          />
        );
      })}

      <circle cx="70" cy="70" r="36" fill="white" opacity="0.85" />
      <text x="70" y="66" textAnchor="middle" fontSize="11" fill="rgb(113,113,122)">
        Spending
      </text>
      <text x="70" y="86" textAnchor="middle" fontSize="14" fontWeight="600" fill="rgb(24,24,27)">
        {formatMoney(total)}
      </text>
    </svg>
  );
}

export function CategoryBreakdown({ transactions }) {
  const spending = React.useMemo(() => groupSpendingByCategory(transactions), [transactions]);
  const top = spending.slice(0, 5);
  const total = top.reduce((a, s) => a + s.value, 0);

  return (
    <Card>
      <CardHeader title="Spending breakdown" subtitle="Top categories (expenses only)" />
      <CardBody className="pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Donut slices={top} />
          <div className="flex-1">
            {!top.length ? (
              <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-400 dark:ring-zinc-800">
                Add an expense (Admin role) to see category patterns.
              </div>
            ) : (
              <div className="space-y-3">
                {top.map((s) => {
                  const pct = total ? Math.round((s.value / total) * 100) : 0;
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.color} opacity-90`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="truncate text-sm font-medium">{s.label}</div>
                          <div className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">{pct}%</div>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-900">
                          <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${s.color}`}
                            style={{ width: `${Math.max(6, pct)}%` }}
                          />
                        </div>
                      </div>
                      <div className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatMoney(s.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

