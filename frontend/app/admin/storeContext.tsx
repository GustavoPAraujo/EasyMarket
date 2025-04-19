"use client";

import { Store } from "@/types/store"

import { createContext, ReactNode, useContext } from "react";


const StoreContext = createContext<Store | null>(null);

export function StoreProvider({
  children,
  store,
}: {
  children: ReactNode;
  store: Store;
}) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore precisa estar dentro de StoreProvider");
  }
  return context;
}
