"use client";

import React from "react";
import { mockTransactions, normalizeTransaction } from "@/lib/finance";
import { readJson, writeJson } from "@/lib/storage";

const STORAGE_KEY = "zorvyn.financeDashboard.v1";

const DashboardContext = React.createContext(null);

const defaultState = {
  role: "viewer", // viewer | admin
  theme: "system", // system | light | dark
  transactions: [],
  filters: {
    query: "",
    type: "all", // all | income | expense
    category: "all",
    sort: "date_desc", // date_desc | date_asc | amount_desc | amount_asc
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "hydrate": {
      return { ...state, ...action.payload };
    }
    case "set_role": {
      return { ...state, role: action.role };
    }
    case "set_theme": {
      return { ...state, theme: action.theme };
    }
    case "set_filter": {
      return {
        ...state,
        filters: { ...state.filters, [action.key]: action.value },
      };
    }
    case "reset_filters": {
      return { ...state, filters: defaultState.filters };
    }
    case "set_transactions": {
      return { ...state, transactions: action.transactions };
    }
    case "add_tx": {
      const tx = normalizeTransaction(action.tx);
      return { ...state, transactions: [tx, ...state.transactions] };
    }
    case "update_tx": {
      const tx = normalizeTransaction(action.tx);
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === tx.id ? tx : t)),
      };
    }
    case "delete_tx": {
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.id) };
    }
    case "clear_all": {
      return { ...state, transactions: [] };
    }
    case "reset_demo": {
      return { ...state, transactions: mockTransactions() };
    }
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, defaultState);

  React.useEffect(() => {
    const saved = readJson(STORAGE_KEY, null);
    if (saved && typeof saved === "object") {
      dispatch({
        type: "hydrate",
        payload: {
          role: saved.role ?? defaultState.role,
          theme: saved.theme ?? defaultState.theme,
          transactions: Array.isArray(saved.transactions) ? saved.transactions.map(normalizeTransaction) : mockTransactions(),
          filters: { ...defaultState.filters, ...(saved.filters ?? {}) },
        },
      });
    } else {
      dispatch({ type: "set_transactions", transactions: mockTransactions() });
    }
  }, []);

  React.useEffect(() => {
    writeJson(STORAGE_KEY, {
      role: state.role,
      theme: state.theme,
      transactions: state.transactions,
      filters: state.filters,
    });
  }, [state.role, state.theme, state.transactions, state.filters]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

