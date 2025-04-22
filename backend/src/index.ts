
import express from "express";
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./auth/auth.routes"
import userRoutes from './users/user.routes';
import storeRoutes from './stores/store.routes';
import productRouter from './products/product.routes'
import cartRouter from './cart/cart.routes'
import paymentRouter from "./payment/payment.routes"

dotenv.config();

const app = express()
const port = process.env.PORT

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Authorization","Content-Type"],
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
}))

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/payments", paymentRouter)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
