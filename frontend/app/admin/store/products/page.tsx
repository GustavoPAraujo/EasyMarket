"use client"

import { useStore } from "@/app/admin/store/storeContext"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import CreateProductFrom from "@/components/products/createProductForm"
import ProductsMap from "@/components/products/productsMap"

export default function Products() {
  const [OpenModal, setOpenModal] = useState<boolean>(false)
  
  const store = useStore()

  const handleModal = () => {
    
    if (OpenModal) {
      setOpenModal(false)
      return
    }
    setOpenModal(true)

  }

  return (
    <div className="space-y-6">

      <div className="">
      <h1 className="text-3xl font-bold">Products</h1>
      </div>

      <div>
        <Button onClick={handleModal}>Register new product</Button>
        {
          OpenModal && <CreateProductFrom adminId={store.adminId}  onClose={() => setOpenModal(false)} />
        }
      </div>

      <div>
        {
          <ProductsMap products={store.products} />
        }
        
      </div>

    </div>
  )
}
