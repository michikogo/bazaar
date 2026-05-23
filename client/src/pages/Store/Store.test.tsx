import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Store from "./Store"

const mockStore = {
  id: "s1",
  name: "The Clay Studio",
  bio: "Handmade ceramics from the Pacific Northwest.",
  location: "Portland, OR",
  products: [
    {
      id: "1",
      name: "Speckled Mug",
      description: "A rustic 300ml mug.",
      price: "18.00",
      imageUrl: null,
      category: "Ceramics",
      stock: 12,
      storeId: "s1",
    },
    {
      id: "2",
      name: "Dinner Plate",
      description: null,
      price: "32.00",
      imageUrl: null,
      category: "Ceramics",
      stock: 5,
      storeId: "s1",
    },
  ],
}

const renderWithRouter = (id = "s1") =>
  render(
    <MemoryRouter initialEntries={[`/store/${id}`]}>
      <Routes>
        <Route path="/store/:id" element={<Store />} />
        <Route path="/product/:id" element={<div>Product page</div>} />
      </Routes>
    </MemoryRouter>
  )

describe("Store", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders store details and products after loading", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockStore,
    } as Response)

    renderWithRouter()

    expect(screen.getByText("Loading...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("The Clay Studio")).toBeInTheDocument()
    })

    expect(screen.getByText("Portland, OR")).toBeInTheDocument()
    expect(screen.getByText("Handmade ceramics from the Pacific Northwest.")).toBeInTheDocument()
    expect(screen.getByText("Speckled Mug")).toBeInTheDocument()
    expect(screen.getByText("$18.00")).toBeInTheDocument()
    expect(screen.getByText("Dinner Plate")).toBeInTheDocument()
    expect(screen.getByText("$32.00")).toBeInTheDocument()
  })

  it("renders store with no bio or location", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockStore, bio: null, location: null }),
    } as Response)

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText("The Clay Studio")).toBeInTheDocument()
    })

    expect(screen.queryByText("Portland, OR")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Handmade ceramics from the Pacific Northwest.")
    ).not.toBeInTheDocument()
  })

  it("renders empty state when store has no products", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockStore, products: [] }),
    } as Response)

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText("No products yet.")).toBeInTheDocument()
    })
  })

  it("navigates to product page when a product card is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockStore,
    } as Response)

    renderWithRouter()

    await waitFor(() => screen.getByText("Speckled Mug"))
    await userEvent.click(screen.getByText("Speckled Mug"))

    expect(screen.getByText("Product page")).toBeInTheDocument()
  })

  it("shows error message when store is not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    renderWithRouter("nonexistent")

    await waitFor(() => screen.getByText("Store not found"))
    expect(screen.getByText("Store not found")).toBeInTheDocument()
  })
})
