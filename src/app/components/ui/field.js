"use client";

import React from "react";

export function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-medium text-zinc-600 dark:text-zinc-300"
    >
      {children}
    </label>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={[
        "h-10 w-full rounded-xl bg-white/70 px-3 text-sm text-zinc-950 ring-1 ring-zinc-200 outline-none",
        "placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/60",
        "dark:bg-zinc-900/60 dark:text-zinc-50 dark:ring-zinc-800 dark:placeholder:text-zinc-500",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Select({ className = "", ...props }) {
  return (
    <select
      className={[
        "h-10 w-full rounded-xl bg-white/70 px-3 text-sm text-zinc-950 ring-1 ring-zinc-200 outline-none",
        "focus:ring-2 focus:ring-indigo-500/60 dark:bg-zinc-900/60 dark:text-zinc-50 dark:ring-zinc-800",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

export function Help({ children }) {
  return <div className="text-xs text-zinc-500 dark:text-zinc-400">{children}</div>;
}

