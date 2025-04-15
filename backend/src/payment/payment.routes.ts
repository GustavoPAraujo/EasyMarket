
import express from "express"
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router()

router.post("/create-checkout-session", authenticateToken)

export default router
