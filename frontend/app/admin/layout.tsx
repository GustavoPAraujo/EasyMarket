
import { StoreProvider } from "./storeContext";

type Props = { children: React.ReactNode };


export default function AdminLayout({ children }: Props) {
  return (
    <StoreProvider>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-50 p-6 border-r">
          <h2 className="text-2xl font-bold mb-4">Painel Admin</h2>

          <nav className="space-y-2">
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </StoreProvider>
  );
}