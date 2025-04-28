
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

export const updateProduct = async ( 
  productId: number,
  updateData: { name?: string, description?: string, quantity?: number, price?: number, categoryId?: number} 
) =>{

  try {
    const response = await api.post(`/product/${productId}`, updateData)
    console.log("response: ", response)
    return response.data


  } catch(err) {
    console.error(err)
  }

}
