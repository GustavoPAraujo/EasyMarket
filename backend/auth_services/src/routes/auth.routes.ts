
import express from "express";

import * as authController from "../controllers/auth.controllers"

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Easy Market - Auth Service')
})

router.post('/register', authController.register)

export default router
