
import express from "express"
import { authenticateToken } from "../middlewares/auth.middleware";
import * as paymentController from "./payment.controller"

const router = express.Router()

router.post("/create-checkout-session", authenticateToken, paymentController.createCheckoutSession)

router.post("/webhook", express.raw({ type: "application/json" }), paymentController.stripeWebhook );

router.get("/success", paymentController.paymentSuccess)
router.get("/cancel", paymentController.paymentCancel)

export default router
