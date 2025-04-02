
import express from "express";

import * as storeController from "./store.controller"
import { authenticateToken } from "../middlewares/auth.middleware";


const router = express.Router()

router.post("/", authenticateToken, storeController.createStore)
router.get("/", authenticateToken, storeController.getStore)
router.patch("/", authenticateToken, storeController.updateStore)

export default router
