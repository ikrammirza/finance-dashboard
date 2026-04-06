"use client";

import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl bg-white/80 ring-1 ring-zinc-200/80 shadow-sm backdrop-blur-sm",
        "dark:bg-zinc-950/40 dark:ring-zinc-800/80",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {subtitle}
          </div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={["px-5 pb-5", className].join(" ")}>{children}</div>;
}

