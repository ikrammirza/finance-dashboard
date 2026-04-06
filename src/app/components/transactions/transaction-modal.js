"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Help, Input, Label, Select } from "@/app/components/ui/field";
import { categories, normalizeTransaction, uid } from "@/lib/finance";

const allCats = categories().filter((c) => !["salary", "freelance"].includes(c.key));

function Overlay({ onClose }) {
  return (
    <button
      aria-label="Close modal"
      onClick={onClose}
      className="fixed inset-0 z-40 cursor-default bg-zinc-950/40 backdrop-blur-sm"
    />
  );
}

export function TransactionModal({ open, mode, initialTx, onClose, onSubmit }) {
  const [form, setForm] = React.useState(() => ({
    id: initialTx?.id ?? null,
    name: initialTx?.name ?? "",
    date: initialTx?.date ?? new Date().toISOString().slice(0, 10),
    type: initialTx?.type ?? "expense",
    category: initialTx?.category ?? "groceries",
    amount: initialTx ? Math.abs(initialTx.amount) : 0,
  }));

  React.useEffect(() => {
    if (!open) return;
    setForm({
      id: initialTx?.id ?? null,
      name: initialTx?.name ?? "",
      date: initialTx?.date ?? new Date().toISOString().slice(0, 10),
      type: initialTx?.type ?? "expense",
      category: initialTx?.category ?? "groceries",
      amount: initialTx ? Math.abs(initialTx.amount) : 0,
    });
  }, [open, initialTx]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const title = mode === "edit" ? "Edit transaction" : "Add transaction";

  const canSubmit =
    form.name.trim().length >= 2 &&
    /^\d{4}-\d{2}-\d{2}$/.test(form.date) &&
    Number(form.amount) > 0;

  return (
    <>
      <Overlay onClose={onClose} />
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
        <Card className="w-full max-w-lg p-5 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{title}</div>
              <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Admin-only action. Viewer role is read-only.
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Name</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Grocery run"
                />
              </div>
              <div className="mt-1">
                <Help>Keep it short — it shows up in the list.</Help>
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <div className="mt-1">
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <div className="mt-1">
                <Select
                  id="type"
                  value={form.type}
                  onChange={(e) => {
                    const type = e.target.value;
                    setForm((f) => ({
                      ...f,
                      type,
                      category:
                        type === "income"
                          ? "salary"
                          : f.category === "salary" || f.category === "freelance"
                            ? "groceries"
                            : f.category,
                    }));
                  }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <div className="mt-1">
                <Select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {form.type === "income" ? (
                    <>
                      <option value="salary">Salary</option>
                      <option value="freelance">Freelance</option>
                    </>
                  ) : (
                    allCats.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))
                  )}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="mt-1">
                <Input
                  id="amount"
                  inputMode="numeric"
                  value={String(form.amount)}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value.replace(/[^\d]/g, "") }))}
                  placeholder="e.g., 45"
                />
              </div>
              <div className="mt-1">
                <Help>Whole numbers only (keeps the UI simple).</Help>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!canSubmit}
              onClick={() => {
                const tx = normalizeTransaction({
                  id: form.id ?? uid("tx"),
                  name: form.name,
                  date: form.date,
                  type: form.type,
                  category: form.category,
                  amount: Number(form.amount),
                });
                onSubmit?.(tx);
              }}
            >
              {mode === "edit" ? "Save changes" : "Add transaction"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}

