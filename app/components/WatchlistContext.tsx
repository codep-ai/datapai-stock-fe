"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface WatchlistCtx {
  items: Set<string>;
  authState: "loading" | "unauthenticated" | "authenticated";
  isWatched: (symbol: string) => boolean;
  add: (symbol: string, exchange: string, name?: string) => Promise<void>;
  remove: (symbol: string) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistCtx>({
  items: new Set(),
  authState: "loading",
  isWatched: () => false,
  add: async () => {},
  remove: async () => {},
});

export function useWatchlist() {
  return useContext(WatchlistContext);
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Set<string>>(new Set());
  const [authState, setAuthState] = useState<"loading" | "unauthenticated" | "authenticated">("loading");

  useEffect(() => {
    fetch("/api/watchlist")
      .then((r) => {
        if (r.status === 401) {
          setAuthState("unauthenticated");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setAuthState("authenticated");
        const syms = new Set((data.items ?? []).map((i: { symbol: string }) => i.symbol));
        setItems(syms);
      })
      .catch(() => setAuthState("unauthenticated"));
  }, []);

  const isWatched = useCallback((symbol: string) => items.has(symbol), [items]);

  const add = useCallback(async (symbol: string, exchange: string, name?: string) => {
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, exchange, name }),
    });
    if (res.status === 401) { window.location.href = "/login"; return; }
    setItems((prev) => new Set(prev).add(symbol));
  }, []);

  const remove = useCallback(async (symbol: string) => {
    const res = await fetch(`/api/watchlist/${symbol}`, { method: "DELETE" });
    if (res.status === 401) { window.location.href = "/login"; return; }
    setItems((prev) => { const next = new Set(prev); next.delete(symbol); return next; });
  }, []);

  return (
    <WatchlistContext.Provider value={{ items, authState, isWatched, add, remove }}>
      {children}
    </WatchlistContext.Provider>
  );
}
