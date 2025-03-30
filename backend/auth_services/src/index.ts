
import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import router from "./routes/auth.routes"

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())

app.use("/api", router)


app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`)
})
