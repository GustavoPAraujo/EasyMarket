
import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.routes"
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())

app.use("/api", authRoutes)
app.use("/api", userRoutes)


app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`)
})
