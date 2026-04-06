"use client";

import React from "react";

export function Button({
  children,
  variant = "primary", // primary | ghost | subtle | danger
  size = "md", // sm | md
  disabled,
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };
  const variants = {
    primary:
      "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200",
    subtle:
      "bg-white/70 text-zinc-900 ring-1 ring-zinc-200 hover:bg-white dark:bg-zinc-900/60 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900",
    ghost:
      "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900/70",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600",
  };

  return (
    <button
      className={[base, sizes[size], variants[variant], className].join(" ")}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

