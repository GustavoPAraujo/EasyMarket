// app/admin/storeContext.tsx
"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { getStoreByAdminId } from "@/services/storeservices"
import type { Store } from "@/types/store";

// 1️⃣ Cria o contexto
const StoreContext = createContext<Store | null>(null);

// 2️⃣ Provider que faz o fetch internamente
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getStoreByAdminId()
      .then((data) => {
        setStore(data);
      })
      .catch((err) => {
        console.error("Erro ao obter minha loja:", err);
        // Se 401 ou 404, redireciona pra criar loja ou login:
        router.push("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div>Carregando loja do admin…</div>;
  }
  if (!store) {
    // Se quer um fallback diferente, coloque aqui
    return <div>Não foi possível carregar sua loja.</div>;
  }

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

// hook pra consumir em qualquer filho
export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return ctx;
}
