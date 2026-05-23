import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import ProductDetail from "./ProductDetail"

const mockProduct = {
  id: "1",
  name: "Speckled Mug",
  description: "A rustic 300ml mug.",
  price: "18.00",
  imageUrl: null,
  category: "Ceramics",
  stock: 12,
  storeId: "s1",
  storeName: "The Clay Studio",
}

const renderWithRouter = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/product/${id}`]}>
      <Routes>
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/store/:id" element={<div>Store page</div>} />
      </Routes>
    </MemoryRouter>
  )

describe("ProductDetail", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders product details after loading", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    } as Response)

    renderWithRouter()

    expect(screen.getByText("Loading...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("Speckled Mug")).toBeInTheDocument()
    })

    expect(screen.getByText("$18.00")).toBeInTheDocument()
    expect(screen.getByText("A rustic 300ml mug.")).toBeInTheDocument()
    expect(screen.getByText("Ceramics")).toBeInTheDocument()
    expect(screen.getByText("12 in stock")).toBeInTheDocument()
    expect(screen.getByText("The Clay Studio")).toBeInTheDocument()
  })

  it("navigates to store page when store name is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockProduct,
    } as Response)

    renderWithRouter()

    await waitFor(() => screen.getByText("The Clay Studio"))
    await userEvent.click(screen.getByText("The Clay Studio"))

    expect(screen.getByText("Store page")).toBeInTheDocument()
  })

  it("shows out of stock when stock is 0", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockProduct, stock: 0 }),
    } as Response)

    renderWithRouter()

    await waitFor(() => screen.getByText("Out of stock"))
    expect(screen.getByText("Out of stock")).toBeInTheDocument()
  })

  it("shows error message when product is not found", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    renderWithRouter("nonexistent")

    await waitFor(() => screen.getByText("Product not found"))
    expect(screen.getByText("Product not found")).toBeInTheDocument()
  })
})
