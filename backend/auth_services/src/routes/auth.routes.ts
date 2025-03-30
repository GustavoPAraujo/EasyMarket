
import express from "express";

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Easy Market - Auth Service')
})

router.post('/register', (req, res) => {
  const {name, email, password} =   req.body
  console.log(email)
  res.send(`Easy Market - Auth Service: ${name} ${email} ${password}`)
})

export default router