
import { Store, Product } from "@/types/store"
import api from "./api"

type MeResponse = {
  needsCreation?: boolean;
  message: string;
  store?: Store;
};

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


export const getStoreById = async (storeId: number) => {

  try {
    const response = await api.get(`/store/:${storeId}`)
    return response.data

  } catch (err) {
    console.log(err)
  }

}

export const getStoreByAdminId = async (): Promise<Store | null> => {

  try {
    const { data } = await api.get<MeResponse>(`/store/me`);
    console.log("data", data)

    if (data.needsCreation === true) {
      return null;
    }
    return parseStore(data.store);

  } catch (err) {
    console.log(err)
    throw err;
  }
}

export const createStore = async (storeData: {name: string, description: string}) => {
   
  try {
    const response = await api.post("/store", storeData)
    console.log("Fetch Response: ", response.data)
    return response

  } catch (err) {
    console.log(err)
    throw err;
  }
}
