import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import productsRouter from "./routes/products"
import storesRouter from "./routes/stores"
import { swaggerSpec } from "./swagger"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/products", productsRouter)
app.use("/api/stores", storesRouter)

if (process.env.NODE_ENV !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

export default app
