"use client"

import { StoreProvider } from "./storeContext";
import AdminSidebar from "@/components/sidebar/sidebar"
import { usePathname } from "next/navigation"

type Props = { children: React.ReactNode };


export default function AdminLayout({ children }: Props) {

  const pathname = usePathname()



  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        { pathname === "/admin/store/create" ? <></> : <AdminSidebar /> }
        <main className="flex-1 p-8">{children}</main>
      </div>
    </StoreProvider>
  );
}