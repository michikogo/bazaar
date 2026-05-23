import express from "express"
import cors from "cors"
import "dotenv/config"
import productsRouter from "./routes/products"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use("/api/products", productsRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
