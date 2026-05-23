import { Router } from "express"
import { eq } from "drizzle-orm"
import { db } from "../db/index"
import { stores, products } from "../db/schema"

const router = Router()

router.get("/:id", async (req, res) => {
  const store = await db.select().from(stores).where(eq(stores.id, req.params.id))

  if (store.length === 0) {
    res.status(404).json({ error: "Store not found" })
    return
  }

  const storeProducts = await db.select().from(products).where(eq(products.storeId, req.params.id))

  res.json({ ...store[0], products: storeProducts })
})

export default router
