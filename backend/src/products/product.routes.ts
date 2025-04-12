 
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import * as productController from "./product.controller"

const router = express.Router()

router.post("/", authenticateToken, productController.createProduct)
router.get("/:productId", productController.getProductById)
router.get("/", productController.getProductsByQuery)//implementar selecao por categorias
router.patch("/:productId", authenticateToken, productController.updateProduct)
router.delete("/:productId", authenticateToken, productController.deleteProduct)

export default router
