
import express from "express";
import { authenticateToken } from "../services/middlewares/auth.middleware";

import * as cartController from "./cart.controller"
const router = express.Router()

router.post("/items", authenticateToken, cartController.addItemToCart )
router.post("/checkout", authenticateToken, cartController.checkout )
router.get("/", authenticateToken, cartController.getCart )
router.get("/summary", authenticateToken, cartController.getCartSummary )
router.patch("/:itemId", authenticateToken, cartController.updateCartItem )
router.delete("/clear/", authenticateToken, cartController.deleteAllItems )
router.delete("/:itemId", authenticateToken, cartController.deleteCartItem )


export default router
