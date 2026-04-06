# Zorvyn Finance Dashboard UI

A polished **frontend-only** finance dashboard built with **Next.js (App Router)** and **Tailwind CSS** for the Zorvyn frontend evaluation assignment.

The goal is to demonstrate clean UI composition, solid state management, and thoughtful UX using mock data (no backend).

## Features (mapped to requirements)

- **Dashboard overview**
  - Summary cards: **Total Balance, Income, Expenses**
  - Time-based visualization: **Net balance trend (last 6 months)**
  - Categorical visualization: **Spending breakdown by category**
- **Transactions**
  - List/table with **date, amount, category, type**
  - **Search**, **filters** (type + category), **sorting** (date/amount)
  - Graceful **empty states** (no data / no results)
- **Basic role-based UI (simulated)**
  - **Viewer**: read-only
  - **Admin**: can **add** and **edit** transactions (modal)
  - Switch roles from the header (responsive)
- **Insights**
  - Highest spending category
  - Month-over-month net change (with % when possible)
  - Spending cadence metric (last 14 days)
- **State management**
  - Centralized store via React Context + reducer: role, theme, transactions, filters
  - **LocalStorage persistence**
- **UI/UX**
  - Responsive layout (mobile → desktop)
  - Light/dark/system theme toggle

## Tech stack

- Next.js
- React
- Tailwind CSS

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Useful controls

- **Role switcher**: Viewer/Admin in the header
- **Reset demo**: restores the default mock dataset
- **Clear filters**: resets search/filter/sort state

## Project structure (high level)

- `src/app/page.js`: dashboard composition
- `src/store/dashboard-context.js`: app state (role, filters, transactions, theme)
- `src/lib/finance.js`: derived calculations (summary, charts, insights) + mock data
- `src/app/components/*`: reusable UI + dashboard sections
