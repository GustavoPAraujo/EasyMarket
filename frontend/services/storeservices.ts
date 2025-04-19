

import { Store, Product } from "@/types/store"
import api from "./api"

type Props = { children: React.ReactNode };

export const getStoreById = async (storeId: number) => {

  try {
    const response = await api.get(`/store/:${storeId}`)
    return response.data

  } catch (err) {
    console.log(err)
  }

}

export const getStoreByAdminId = async (): Promise<Store> => {

  try {

    const { data } = await api.get<{ store: any }>(`/store/me`);
    return parseStore(data.store);

  } catch (err) {
    console.log(err)
    throw err;
  }
}

function parseStore(raw: any): Store {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    adminId: raw.adminId,
    createdAt: new Date(raw.createdAt),
    products: raw.products.map((p: any) => parseProduct(p)),
  };
}
function parseProduct(raw: any): Product {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : undefined,
  };
}