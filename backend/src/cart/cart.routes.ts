
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";

import * as cartController from "./cart.controller"
const router = express.Router()

router.post("/items", authenticateToken, cartController.addItemToCart )
router.get("/", authenticateToken, cartController.getCart )
router.patch("/:itemId", authenticateToken, cartController.updateCartItem )


export default router