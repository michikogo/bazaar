import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../app"

vi.mock("../db/index", () => ({
  db: {
    select: vi.fn(),
  },
}))

import { db } from "../db/index"

const mockProducts = [
  {
    id: "1",
    name: "Speckled Mug",
    description: "A rustic mug.",
    price: "18.00",
    imageUrl: null,
    category: "Ceramics",
    stock: 12,
    storeId: "s1",
    storeName: "The Clay Studio",
  },
  {
    id: "2",
    name: "Market Tote",
    description: "A woven tote bag.",
    price: "34.00",
    imageUrl: null,
    category: "Bags",
    stock: 15,
    storeId: "s2",
    storeName: "Woven Roots",
  },
]

const buildChain = (result: unknown) => ({
  from: vi.fn().mockReturnValue({
    innerJoin: vi.fn().mockResolvedValue(result),
  }),
})

describe("GET /api/products", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns all products with store name", async () => {
    vi.mocked(db.select).mockReturnValue(buildChain(mockProducts) as never)

    const res = await request(app).get("/api/products")

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0]).toMatchObject({ name: "Speckled Mug", storeName: "The Clay Studio" })
    expect(res.body[1]).toMatchObject({ name: "Market Tote", storeName: "Woven Roots" })
  })

  it("returns an empty array when there are no products", async () => {
    vi.mocked(db.select).mockReturnValue(buildChain([]) as never)

    const res = await request(app).get("/api/products")

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
})
