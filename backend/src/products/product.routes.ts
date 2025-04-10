 
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import * as productController from "./product.controller"

const router = express.Router()

router.post("/", authenticateToken, productController.createProduct)
router.get("/:productId", authenticateToken, productController.getProductById)
router.get("/", authenticateToken, productController.getProductsByQuery)
router.patch("/:productId", authenticateToken, productController.updateProduct)
router.delete("/:productId", authenticateToken, productController.deleteProduct)

export default router
