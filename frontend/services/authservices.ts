
import api from "./api"

export const login = async (usarData: {email: string, password: string}) => {

  try {

    const response = await api.post("/auth/login", usarData)

    const token = response.data.token
    document.cookie = `token=${token}; Path=/; Secure; SameSite=Strict`;

    return response.data

  } catch (err) {
    console.error("Error signing up", err)
  }
}
