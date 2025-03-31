
import express from "express";

import * as authController from "../controllers/auth.controller"

const router = express.Router()


router.post('/register', authController.register)
router.get('/login', authController.login)

export default router
