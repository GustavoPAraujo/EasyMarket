 
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import * as productController from "./product.controller"

const router = express.Router()

router.post("/", authenticateToken, productController.createProduct)
router.patch("/:productId", authenticateToken, productController.updateProduct)

export default router
