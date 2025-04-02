
import express from "express";

import * as storeController from "./store.controller"
import { authenticateToken } from "../middlewares/auth.middleware";


const router = express.Router()

router.post("/", authenticateToken, storeController.createStore)

export default router
