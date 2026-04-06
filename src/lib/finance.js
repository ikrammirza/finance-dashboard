const CATEGORIES = [
  { key: "rent", label: "Rent", color: "from-violet-500 to-fuchsia-500" },
  { key: "groceries", label: "Groceries", color: "from-emerald-500 to-lime-400" },
  { key: "transport", label: "Transport", color: "from-sky-500 to-cyan-400" },
  { key: "food", label: "Food & coffee", color: "from-amber-500 to-orange-400" },
  { key: "shopping", label: "Shopping", color: "from-pink-500 to-rose-400" },
  { key: "subscriptions", label: "Subscriptions", color: "from-indigo-500 to-blue-400" },
  { key: "health", label: "Health", color: "from-teal-500 to-emerald-400" },
  { key: "salary", label: "Salary", color: "from-zinc-800 to-zinc-600" },
  { key: "freelance", label: "Freelance", color: "from-slate-700 to-slate-500" },
];

export function categories() {
  return CATEGORIES.slice();
}

export function categoryMeta(key) {
  return CATEGORIES.find((c) => c.key === key) ?? { key, label: key, color: "from-zinc-500 to-zinc-400" };
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export function uid(prefix = "t") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d, delta) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

export function normalizeTransaction(tx) {
  const amount = Number(tx.amount ?? 0);
  const type = tx.type === "income" ? "income" : "expense";
  const signed = type === "income" ? Math.abs(amount) : -Math.abs(amount);
  return {
    id: tx.id ?? uid("tx"),
    date: tx.date,
    name: String(tx.name ?? "").trim() || "Untitled",
    category: tx.category ?? "misc",
    type,
    amount: Math.round(signed),
  };
}

export function computeSummary(transactions) {
  const income = transactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const expensesAbs = transactions.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);
  const net = income - expensesAbs;
  return { income, expenses: expensesAbs, net };
}

export function groupSpendingByCategory(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (t.amount >= 0) continue;
    const k = t.category ?? "misc";
    map.set(k, (map.get(k) ?? 0) + Math.abs(t.amount));
  }
  return Array.from(map.entries())
    .map(([key, value]) => ({ key, value, ...categoryMeta(key) }))
    .sort((a, b) => b.value - a.value);
}

export function buildMonthlySeries(transactions, monthsBack = 6) {
  const now = new Date();
  const start = addMonths(startOfMonth(now), -(monthsBack - 1));
  const buckets = [];
  for (let i = 0; i < monthsBack; i++) {
    const d = addMonths(start, i);
    buckets.push({
      month: new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10),
      income: 0,
      expenses: 0,
      net: 0,
    });
  }

  const indexBy = new Map(buckets.map((b, idx) => [b.month.slice(0, 7), idx]));

  for (const t of transactions) {
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const idx = indexBy.get(key);
    if (idx == null) continue;
    if (t.amount > 0) buckets[idx].income += t.amount;
    if (t.amount < 0) buckets[idx].expenses += Math.abs(t.amount);
  }
  for (const b of buckets) b.net = b.income - b.expenses;
  return buckets;
}

export function computeInsights(transactions) {
  if (!transactions.length) {
    return {
      highestSpendingCategory: null,
      monthOverMonth: null,
      streak: null,
    };
  }

  const spending = groupSpendingByCategory(transactions);
  const top = spending[0] ?? null;

  const series = buildMonthlySeries(transactions, 2);
  const prev = series[0];
  const cur = series[1];
  const prevNet = prev?.net ?? 0;
  const curNet = cur?.net ?? 0;
  const delta = curNet - prevNet;
  const pct = prevNet === 0 ? null : (delta / Math.abs(prevNet)) * 100;

  const sorted = transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recent = sorted.slice(-14);
  const streakDays = new Set(recent.filter((t) => t.amount < 0).map((t) => t.date)).size;

  return {
    highestSpendingCategory: top
      ? { key: top.key, label: top.label, value: top.value }
      : null,
    monthOverMonth: {
      prevMonth: prev?.month ?? null,
      curMonth: cur?.month ?? null,
      prevNet,
      curNet,
      delta,
      pct,
    },
    streak: { daysWithSpendLast14: streakDays },
  };
}

export function mockTransactions() {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const seed = [
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 1)), name: "Salary", category: "salary", type: "income", amount: 4200 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 2)), name: "Rent", category: "rent", type: "expense", amount: 1650 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 3)), name: "Groceries", category: "groceries", type: "expense", amount: 142 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 4)), name: "Metro card", category: "transport", type: "expense", amount: 68 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 4)), name: "Coffee", category: "food", type: "expense", amount: 7 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 6)), name: "Streaming", category: "subscriptions", type: "expense", amount: 15 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 7)), name: "Pharmacy", category: "health", type: "expense", amount: 24 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 8)), name: "Freelance payout", category: "freelance", type: "income", amount: 750 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 9)), name: "Lunch", category: "food", type: "expense", amount: 13 },
    { date: iso(new Date(today.getFullYear(), today.getMonth(), 11)), name: "Shoes", category: "shopping", type: "expense", amount: 89 },
  ];

  // add a few last-month items for insights/trend
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  seed.push(
    { date: iso(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)), name: "Salary", category: "salary", type: "income", amount: 4200 },
    { date: iso(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 2)), name: "Rent", category: "rent", type: "expense", amount: 1650 },
    { date: iso(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 5)), name: "Groceries", category: "groceries", type: "expense", amount: 131 },
    { date: iso(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 10)), name: "Dinner", category: "food", type: "expense", amount: 42 }
  );

  return seed.map(normalizeTransaction).sort((a, b) => new Date(b.date) - new Date(a.date));
}

