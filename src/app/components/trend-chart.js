"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@/app/components/ui/card";
import { buildMonthlySeries, clamp } from "@/lib/finance";
import { formatMoney, formatMonthLabel } from "@/lib/format";

function LineChart({ points, height = 140 }) {
  if (!points.length) {
    return (
      <div className="flex h-[140px] items-center justify-center rounded-xl bg-zinc-50 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">No data yet</div>
      </div>
    );
  }

  const w = 500;
  const h = height;
  const pad = 18;
  const xs = points.map((_, i) => (pad + (i * (w - pad * 2)) / Math.max(1, points.length - 1)));
  const ysRaw = points.map((p) => p.value);
  const min = Math.min(...ysRaw);
  const max = Math.max(...ysRaw);
  const span = max - min || 1;
  const ys = ysRaw.map((v) => pad + ((max - v) / span) * (h - pad * 2));

  const d = xs
    .map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${ys[i].toFixed(2)}`)
    .join(" ");

  const area = `${d} L ${xs[xs.length - 1].toFixed(2)} ${(h - pad).toFixed(2)} L ${xs[0].toFixed(2)} ${(h - pad).toFixed(2)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="gradLine" x1="0" x2="1">
          <stop offset="0" stopColor="rgb(99,102,241)" />
          <stop offset="1" stopColor="rgb(217,70,239)" />
        </linearGradient>
        <linearGradient id="gradArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgb(99,102,241)" stopOpacity="0.25" />
          <stop offset="1" stopColor="rgb(217,70,239)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <path d={area} fill="url(#gradArea)" />
      <path d={d} fill="none" stroke="url(#gradLine)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3.5" fill="white" stroke="rgb(99,102,241)" strokeWidth="2" />
      ))}
    </svg>
  );
}

export function TrendChart({ transactions }) {
  const series = React.useMemo(() => buildMonthlySeries(transactions, 6), [transactions]);
  const points = series.map((s) => ({ label: s.month, value: s.net }));
  const latest = series[series.length - 1];
  const maxNet = Math.max(...points.map((p) => p.value), 0);
  const minNet = Math.min(...points.map((p) => p.value), 0);
  const bias = clamp((latest?.net ?? 0) / (Math.abs(maxNet - minNet) || 1), -1, 1);
  const mood =
    bias >= 0.25
      ? "Steady upward trend"
      : bias <= -0.25
        ? "Net is trending down"
        : "Mostly stable month-to-month";

  return (
    <Card>
      <CardHeader
        title="Balance trend"
        subtitle="Net income minus expenses (last 6 months)"
        right={
          latest ? (
            <div className="text-right">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Current</div>
              <div className="text-sm font-semibold">{formatMoney(latest.net)}</div>
            </div>
          ) : null
        }
      />
      <CardBody className="pt-4">
        <div className="rounded-xl bg-zinc-50 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
          <div className="px-4 pt-3 text-xs text-zinc-500 dark:text-zinc-400">{mood}</div>
          <div className="px-2 pb-2 pt-2">
            <LineChart points={points} />
          </div>
          <div className="grid grid-cols-6 gap-2 px-4 pb-4">
            {series.map((s) => (
              <div key={s.month} className="min-w-0">
                <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                  {formatMonthLabel(s.month)}
                </div>
                <div className="truncate text-xs font-medium">{formatMoney(s.net)}</div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

