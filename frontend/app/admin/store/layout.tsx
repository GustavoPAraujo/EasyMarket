"use client"

import { StoreProvider } from "./storeContext"
import AdminSidebar from "@/components/sidebar/sidebar"
import { usePathname } from "next/navigation"

type Props = { children: React.ReactNode };


export default function StoreLayout({ children }: Props) {

  const pathname = usePathname()

  if (pathname === "/admin/store/create") {
    return (
      <div className="flex min-h-screen">
        <main className="flex-1 p-8">{children}</main>
      </div>
    );
  }

  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </StoreProvider>
  );
}