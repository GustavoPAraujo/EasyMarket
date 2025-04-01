
import express from "express";

import * as storeController from "./store.controller"

const router = express.Router()

router.post("/", storeController.createStore)

export default router