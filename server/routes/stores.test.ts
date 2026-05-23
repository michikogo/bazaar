import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../app"

vi.mock("../db/index", () => ({
  db: {
    select: vi.fn(),
  },
}))

import { db } from "../db/index"

const mockStore = {
  id: "s1",
  clerkUserId: "clerk_1",
  name: "The Clay Studio",
  bio: "Handcrafted ceramics.",
  location: "Cape Town, South Africa",
  createdAt: null,
}

const mockProducts = [
  { id: "1", name: "Speckled Mug", price: "18.00", storeId: "s1" },
  { id: "2", name: "Bud Vase", price: "22.00", storeId: "s1" },
]

const selectChain = (result: unknown) => ({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockResolvedValue(result),
  }),
})

describe("GET /api/stores/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns the store with its products", async () => {
    vi.mocked(db.select)
      .mockReturnValueOnce(selectChain([mockStore]) as never)
      .mockReturnValueOnce(selectChain(mockProducts) as never)

    const res = await request(app).get("/api/stores/s1")

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ name: "The Clay Studio", location: "Cape Town, South Africa" })
    expect(res.body.products).toHaveLength(2)
    expect(res.body.products[0]).toMatchObject({ name: "Speckled Mug" })
  })

  it("returns 404 when store does not exist", async () => {
    vi.mocked(db.select).mockReturnValueOnce(selectChain([]) as never)

    const res = await request(app).get("/api/stores/nonexistent")

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: "Store not found" })
  })
})
