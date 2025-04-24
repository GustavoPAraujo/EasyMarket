
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
    console.log("admin ID:", adminId)
    console.log("Product data:", productData)


    const response = await api.post("/product")
    console.log("response: ", response.data)

    return response.data
     
  } catch (err) {
    console.error(err)
  }

}