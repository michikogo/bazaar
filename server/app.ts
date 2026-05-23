import express from "express"
import cors from "cors"
import productsRouter from "./routes/products"
import storesRouter from "./routes/stores"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/products", productsRouter)
app.use("/api/stores", storesRouter)

export default app
