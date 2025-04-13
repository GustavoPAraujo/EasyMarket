
import express from "express";
import { authenticateToken } from "../middlewares/auth.middleware";

import * as cartController from "./cart.controller"
const router = express.Router()

router.post("/", authenticateToken, cartController.addItemToCart )


export default router