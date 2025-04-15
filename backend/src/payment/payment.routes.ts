
import express from "express"
import { authenticateToken } from "../middlewares/auth.middleware";
import * as paymentController from "./payment.controller"

const router = express.Router()

router.post("/create-checkout-session", authenticateToken, paymentController.createCheckoutSession)

router.get("/success", paymentController.paymentSuccess)
router.get("/cancel", paymentController.paymentCancel)

export default router
