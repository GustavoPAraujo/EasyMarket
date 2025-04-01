
import express from "express";

import * as storeController from "../controllers/store.controller"

const router = express.Router()

router.post("/", storeController.createStore)

export default router