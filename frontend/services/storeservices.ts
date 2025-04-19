

import api from "./api"

export const getStoreById = async (storeId: number) => {

  try {
    const response = await api.get(`/store/:${storeId}`)
    return response.data

  } catch (err) {
    console.log(err)
  }

}