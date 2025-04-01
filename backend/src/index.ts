
import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./auth/auth.routes"
import userRoutes from './users/user.routes';

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)


app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`)
})
