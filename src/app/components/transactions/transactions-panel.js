"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input, Select } from "@/app/components/ui/field";
import { Pill } from "@/app/components/ui/pill";
import { useDashboard } from "@/store/dashboard-context";
import { categories, categoryMeta } from "@/lib/finance";
import { formatDateShort, formatSignedMoney } from "@/lib/format";
import { TransactionModal } from "@/app/components/transactions/transaction-modal";

function sortTransactions(list, sortKey) {
  const arr = list.slice();
  const byDate = (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime();
  const byAmt = (a, b) => a.amount - b.amount;
  switch (sortKey) {
    case "date_asc":
      return arr.sort(byDate);
    case "amount_desc":
      return arr.sort((a, b) => byAmt(b, a));
    case "amount_asc":
      return arr.sort(byAmt);
    case "date_desc":
    default:
      return arr.sort((a, b) => byDate(b, a));
  }
}

function applyFilters(transactions, filters) {
  const q = filters.query.trim().toLowerCase();
  return transactions.filter((t) => {
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.category !== "all" && t.category !== filters.category) return false;
    if (!q) return true;
    const hay = `${t.name} ${t.category} ${t.type} ${t.date}`.toLowerCase();
    return hay.includes(q);
  });
}

function EmptyState({ isAdmin, onAdd, onResetDemo }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
      <div className="text-sm font-semibold">No transactions</div>
      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {isAdmin
          ? "Add a transaction to populate the dashboard."
          : "Switch to Admin role to add transactions."}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="subtle" onClick={onResetDemo}>
          Reset demo data
        </Button>
        <Button disabled={!isAdmin} onClick={onAdd}>
          Add transaction
        </Button>
      </div>
    </div>
  );
}

export function TransactionsPanel() {
  const { state, dispatch } = useDashboard();
  const isAdmin = state.role === "admin";

  const [modal, setModal] = React.useState({ open: false, mode: "add", tx: null });

  const filtered = React.useMemo(
    () => applyFilters(state.transactions, state.filters),
    [state.transactions, state.filters]
  );
  const sorted = React.useMemo(
    () => sortTransactions(filtered, state.filters.sort),
    [filtered, state.filters.sort]
  );

  const cats = React.useMemo(() => categories(), []);
  const expenseCats = cats.filter((c) => !["salary", "freelance"].includes(c.key));

  return (
    <Card>
      <CardHeader
        title="Transactions"
        subtitle="Search, filter, and sort. Admin can add or edit."
        right={
          <div className="flex items-center gap-2">
            <Button
              variant="subtle"
              onClick={() => dispatch({ type: "reset_demo" })}
              title="Restore demo dataset"
            >
              Reset demo
            </Button>
            <Button
              disabled={!isAdmin}
              onClick={() => setModal({ open: true, mode: "add", tx: null })}
              title={isAdmin ? "Add transaction" : "Switch role to Admin to add"}
            >
              Add
            </Button>
          </div>
        }
      />
      <CardBody className="pt-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <Input
              value={state.filters.query}
              onChange={(e) => dispatch({ type: "set_filter", key: "query", value: e.target.value })}
              placeholder="Search by name, category, date…"
              aria-label="Search transactions"
            />
          </div>
          <div className="sm:col-span-2">
            <Select
              value={state.filters.type}
              onChange={(e) => dispatch({ type: "set_filter", key: "type", value: e.target.value })}
              aria-label="Filter by type"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>
          <div className="sm:col-span-3">
            <Select
              value={state.filters.category}
              onChange={(e) => dispatch({ type: "set_filter", key: "category", value: e.target.value })}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {expenseCats.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
              <option disabled>──────────</option>
              <option value="salary">Salary</option>
              <option value="freelance">Freelance</option>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Select
              value={state.filters.sort}
              onChange={(e) => dispatch({ type: "set_filter", key: "sort", value: e.target.value })}
              aria-label="Sort"
            >
              <option value="date_desc">Newest</option>
              <option value="date_asc">Oldest</option>
              <option value="amount_desc">Amount ↓</option>
              <option value="amount_asc">Amount ↑</option>
            </Select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-semibold text-zinc-950 dark:text-zinc-50">{sorted.length}</span> of{" "}
            <span className="font-semibold text-zinc-950 dark:text-zinc-50">{state.transactions.length}</span>
          </div>
          <Button variant="ghost" onClick={() => dispatch({ type: "reset_filters" })}>
            Clear filters
          </Button>
        </div>

        <div className="mt-4">
          {!sorted.length ? (
            <EmptyState
              isAdmin={isAdmin}
              onAdd={() => setModal({ open: true, mode: "add", tx: null })}
              onResetDemo={() => dispatch({ type: "reset_demo" })}
            />
          ) : (
            <div className="overflow-hidden rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800">
              <div className="grid grid-cols-12 gap-2 bg-zinc-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/40 dark:text-zinc-400">
                <div className="col-span-3 sm:col-span-2">Date</div>
                <div className="col-span-5 sm:col-span-6">Transaction</div>
                <div className="col-span-2 sm:col-span-2">Category</div>
                <div className="col-span-2 sm:col-span-2 text-right">Amount</div>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {sorted.map((t) => {
                  const cat = categoryMeta(t.category);
                  const tone = t.amount >= 0 ? "positive" : "negative";
                  return (
                    <button
                      key={t.id}
                      className="grid w-full grid-cols-12 gap-2 px-4 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
                      onClick={() => {
                        if (!isAdmin) return;
                        setModal({ open: true, mode: "edit", tx: t });
                      }}
                      title={isAdmin ? "Click to edit" : "Viewer role: read-only"}
                    >
                      <div className="col-span-3 sm:col-span-2 text-sm text-zinc-600 dark:text-zinc-300">
                        {formatDateShort(t.date)}
                      </div>
                      <div className="col-span-5 sm:col-span-6 min-w-0">
                        <div className="truncate text-sm font-medium">{t.name}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <Pill tone={tone}>{t.type}</Pill>
                          {!isAdmin ? <span className="text-[11px] text-zinc-400">read-only</span> : null}
                        </div>
                      </div>
                      <div className="col-span-2 sm:col-span-2 truncate text-sm text-zinc-600 dark:text-zinc-300">
                        {cat.label}
                      </div>
                      <div className="col-span-2 sm:col-span-2 text-right text-sm font-semibold tabular-nums">
                        {formatSignedMoney(t.amount)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardBody>

      <TransactionModal
        open={modal.open}
        mode={modal.mode}
        initialTx={modal.tx}
        onClose={() => setModal({ open: false, mode: "add", tx: null })}
        onSubmit={(tx) => {
          if (modal.mode === "edit") dispatch({ type: "update_tx", tx });
          else dispatch({ type: "add_tx", tx });
          setModal({ open: false, mode: "add", tx: null });
        }}
      />
    </Card>
  );
}

