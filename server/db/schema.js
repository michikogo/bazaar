const { pgTable, uuid, text, numeric, integer, timestamp, pgEnum } = require("drizzle-orm/pg-core")

const orderStatusEnum = pgEnum("order_status", ["new", "processing", "shipped", "completed"])

const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique().notNull(),
  name: text("name").notNull(),
  bio: text("bio"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
})

const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  storeId: uuid("store_id")
    .references(() => stores.id)
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  stock: integer("stock").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

const buyers = pgTable("buyers", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  buyerId: uuid("buyer_id")
    .references(() => buyers.id)
    .notNull(),
  status: orderStatusEnum("status").default("new"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
})

module.exports = { stores, products, buyers, orders, orderItems, orderStatusEnum }
