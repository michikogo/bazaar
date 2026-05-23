import { Router } from "express"
import { eq } from "drizzle-orm"
import { db } from "../db/index"
import { stores, products } from "../db/schema"

const router = Router()

/**
 * @openapi
 * /stores/{id}:
 *   get:
 *     summary: Get a store by ID with its products
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Store UUID
 *     responses:
 *       200:
 *         description: Store details with product list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Store not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Store not found
 */
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
