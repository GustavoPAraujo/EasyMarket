"use client"


import { useStore } from "@/app/admin/store/storeContext"
import { format } from "date-fns";

export default function Store() {
  const store = useStore();


  return (
<div className="space-y-6">
      <h1 className="text-3xl font-bold">{store.name}</h1>
      <p className="text-gray-700">{store.description}</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-sm text-gray-500">Created At</h2>
          <p className="mt-1">{format(new Date(store.createdAt), "dd/MM/yyyy")}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-sm text-gray-500">Products</h2>
          <p className="mt-1">{store.products.length}</p>
        </div>

      </div>
    </div>
  )
}