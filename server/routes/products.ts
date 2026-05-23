import { Router } from "express"
import { eq } from "drizzle-orm"
import { db } from "../db/index"
import { products, stores } from "../db/schema"

const router = Router()

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products with store name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductWithStore'
 */
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

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product UUID
 *     responses:
 *       200:
 *         description: Product with store name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductWithStore'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Product not found
 */
router.get("/:id", async (req, res) => {
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
    .where(eq(products.id, req.params.id))

  if (rows.length === 0) {
    res.status(404).json({ error: "Product not found" })
    return
  }

  res.json(rows[0])
})

export default router
