
import api from "./api"

export const getMe = async () => {

  try {
    const response = await api.get("/user/me")
    return response.data

  } catch (err) {
    console.log(err)
  }
}
