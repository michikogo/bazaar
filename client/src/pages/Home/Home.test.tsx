import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Home from "./Home"

const mockProducts = [
  {
    id: "1",
    name: "Speckled Mug",
    description: "A rustic 300ml mug.",
    price: "18.00",
    imageUrl: null,
    category: "Ceramics",
    stock: 12,
    storeId: "s1",
    storeName: "The Clay Studio",
  },
  {
    id: "2",
    name: "Linen Tote",
    description: null,
    price: "35.00",
    imageUrl: null,
    category: "Bags",
    stock: 5,
    storeId: "s2",
    storeName: "Canvas Co.",
  },
]

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<div>Product page</div>} />
      </Routes>
    </MemoryRouter>
  )

describe("Home", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders product grid after loading", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    renderWithRouter()

    expect(screen.getByText("Loading...")).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("Speckled Mug")).toBeInTheDocument()
    })

    expect(screen.getByText("$18.00")).toBeInTheDocument()
    expect(screen.getByText("The Clay Studio")).toBeInTheDocument()
    expect(screen.getByText("Linen Tote")).toBeInTheDocument()
    expect(screen.getByText("$35.00")).toBeInTheDocument()
    expect(screen.getByText("Canvas Co.")).toBeInTheDocument()
  })

  it("navigates to product page when a card is clicked", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    } as Response)

    renderWithRouter()

    await waitFor(() => screen.getByText("Speckled Mug"))
    await userEvent.click(screen.getByText("Speckled Mug"))

    expect(screen.getByText("Product page")).toBeInTheDocument()
  })

  it("shows error message when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
    } as Response)

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch products")).toBeInTheDocument()
    })
  })

  it("renders empty grid when no products are returned", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText("All Products")).toBeInTheDocument()
    })

    expect(screen.queryByText("Speckled Mug")).not.toBeInTheDocument()
  })
})
