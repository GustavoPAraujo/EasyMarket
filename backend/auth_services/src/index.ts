
import express from "express";

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Easy Market - Auth Service')
})

app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`)
})