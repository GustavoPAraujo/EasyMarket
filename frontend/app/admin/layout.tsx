
import { StoreProvider } from "./storeContext";
import AdminSidebar from "@/components/sidebar/sidebar"

type Props = { children: React.ReactNode };


export default function AdminLayout({ children }: Props) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </StoreProvider>
  );
}