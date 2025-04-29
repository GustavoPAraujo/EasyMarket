"use client";

import { useStore } from "@/app/admin/store/storeContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateProductForm from "@/components/products/createProductForm";
import ProductsMap from "@/components/products/productDisplay/productsMap";
import Notification from "@/components/notification/notification";

export default function Products() {
  const [openModal, setOpenModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type?: "success" | "error" | "info" } | null>(null);

  const store = useStore(); 

  const handleCreateSuccess = () => {
    console.log("CREATE SUCCESS!");
    setOpenModal(false);
    setNotification({ message: "Produto criado com sucesso!", type: "success" });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>

      <Button onClick={() => setOpenModal(true)}>Register new product</Button>

      {openModal && (
        <CreateProductForm
          adminId={store.adminId}
          onClose={() => setOpenModal(false)}
          onSuccess={handleCreateSuccess} 
        />
      )}

      <ProductsMap products={store.products} />

      {notification && (
        <Notification
          show={true}
          message={notification.message}
          type={notification.type}
          duration={3000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
