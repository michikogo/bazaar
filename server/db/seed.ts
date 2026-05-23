import { db, pool } from "./index.ts"
import { stores, products } from "./schema.ts"

const run = async () => {
  console.log("Seeding database...")

  const [storeA, storeB] = await db
    .insert(stores)
    .values([
      {
        clerkUserId: "seed_clerk_user_1",
        name: "The Clay Studio",
        bio: "Handcrafted ceramics made with love in Cape Town.",
        location: "Cape Town, South Africa",
      },
      {
        clerkUserId: "seed_clerk_user_2",
        name: "Woven Roots",
        bio: "Sustainable woven goods from locally sourced materials.",
        location: "Nairobi, Kenya",
      },
    ])
    .returning()

  await db.insert(products).values([
    {
      storeId: storeA.id,
      name: "Speckled Mug",
      description: "A rustic 300ml mug with a speckled glaze finish.",
      price: "18.00",
      category: "Ceramics",
      stock: 12,
    },
    {
      storeId: storeA.id,
      name: "Ceramic Bowl Set",
      description: "Set of 4 hand-thrown bowls, perfect for everyday use.",
      price: "65.00",
      category: "Ceramics",
      stock: 6,
    },
    {
      storeId: storeA.id,
      name: "Bud Vase",
      description: "Slim bud vase with a matte white glaze.",
      price: "22.00",
      category: "Ceramics",
      stock: 20,
    },
    {
      storeId: storeB.id,
      name: "Market Tote",
      description: "Large woven tote bag made from natural sisal.",
      price: "34.00",
      category: "Bags",
      stock: 15,
    },
    {
      storeId: storeB.id,
      name: "Table Runner",
      description: "Hand-woven cotton table runner, 180cm long.",
      price: "48.00",
      category: "Home",
      stock: 8,
    },
    {
      storeId: storeB.id,
      name: "Woven Wall Hanging",
      description: "Decorative wall hanging in earth tones, approx 60x40cm.",
      price: "75.00",
      category: "Home",
      stock: 5,
    },
  ])

  console.log("Done — 2 stores, 6 products seeded.")
  await pool.end()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
