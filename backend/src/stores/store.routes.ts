
import express from "express";

import * as storeController from "./store.controller"
import { authenticateToken } from "../middlewares/auth.middleware";


const router = express.Router()

router.post("/", authenticateToken, storeController.createStore)
router.get("/", storeController.getAllStores)
router.get("/search", storeController.searchStoresByName)
router.get("/:storeId", storeController.getStoreById)
router.patch("/", authenticateToken, storeController.updateStore)
router.get("/:storeId/products", authenticateToken, storeController.getStoreProducts)

export default router
