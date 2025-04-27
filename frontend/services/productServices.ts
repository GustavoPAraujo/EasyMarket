
import api from "./api"

type createProduct = {
  name: string
  description: string
  quantity: number
  price: number
  categoryId?: number
}

export const createProduct = async (adminId: number, productData: createProduct) => {

  try {
    const response = await api.post("/product", productData)

    return response.data
     
  } catch (err) {
    console.error(err)
  }

}