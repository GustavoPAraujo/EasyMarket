
import { Store } from "@/types/store"
import { StoreProvider } from "./storeContext"
import { getStoreById } from "@/services/storeservices"



type Props = { children: React.ReactNode };



export default async function AdminLayout({ children }: Props) {

  let store: Store;
  let storeId = 1
  try {
    store = await getStoreById(storeId)

  } catch (err) {
    console.log(err)
  }


  return (
    <StoreProvider store={store}>
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-50 p-6 border-r">
        <h2 className="text-xl font-bold mb-4">Painel Admin</h2>
        <p className="mb-6">Loja: <strong>{store.name}</strong></p>

      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  </StoreProvider>
  );

}