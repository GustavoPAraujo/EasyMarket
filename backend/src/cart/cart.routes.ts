
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";

import * as cartController from "./cart.controller"
const router = express.Router()

router.post("/items", authenticateToken, cartController.addItemToCart )
router.get("/", authenticateToken, cartController.getCart )


export default router