
"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoreByAdminId } from "@/services/storeservices"
import type { Store } from "@/types/store";


const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();  

  useEffect(() => {
    getStoreByAdminId()
      .then((data) => {
        if(data === null){
          router.push("/admin/store/create");
        } else {
          setStore(data);
        }
      })
      .catch((err) => {
        console.error("Erro ao obter minha loja:", err);
        if (err.response?.status === 400) {
          router.push("/login");
        } else {
          router.push("/admin/store/create");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return <div className="flex h-screen justify-center items-center text-primary">Carregando loja do admin…</div>;
  }
  
  if (!store) {
    return null;
  }

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore deve ser usado dentro de um StoreProvider");
  }
  return ctx;
}
