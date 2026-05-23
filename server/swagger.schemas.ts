/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         storeId:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         price:
 *           type: string
 *           description: Numeric string (e.g. "18.00")
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           nullable: true
 *         stock:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ProductWithStore:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         storeId:
 *           type: string
 *           format: uuid
 *         storeName:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         price:
 *           type: string
 *           description: Numeric string (e.g. "18.00")
 *         imageUrl:
 *           type: string
 *           nullable: true
 *         category:
 *           type: string
 *           nullable: true
 *         stock:
 *           type: integer
 *     Store:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *           nullable: true
 *         location:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 */
