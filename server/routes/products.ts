import { Router } from "express"
import { eq } from "drizzle-orm"
import { db } from "../db/index"
import { products, stores } from "../db/schema"

const router = Router()

router.get("/", async (_req, res) => {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      imageUrl: products.imageUrl,
      category: products.category,
      stock: products.stock,
      storeId: products.storeId,
      storeName: stores.name,
    })
    .from(products)
    .innerJoin(stores, eq(stores.id, products.storeId))

  res.json(rows)
})

export default router
