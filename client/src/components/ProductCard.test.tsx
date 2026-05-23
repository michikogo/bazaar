import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import ProductCard from "./ProductCard"

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

const renderWithRouter = (ui: React.ReactElement) =>
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="/product/:id" element={<div>Product page</div>} />
      </Routes>
    </MemoryRouter>
  )

describe("ProductCard", () => {
  it("renders product name and price", () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    expect(screen.getByText("Speckled Mug")).toBeInTheDocument()
    expect(screen.getByText("$18.00")).toBeInTheDocument()
  })

  it("hides store name by default", () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    expect(screen.queryByText("The Clay Studio")).not.toBeInTheDocument()
  })

  it("shows store name when showStoreName is true", () => {
    renderWithRouter(<ProductCard product={mockProduct} showStoreName />)

    expect(screen.getByText("The Clay Studio")).toBeInTheDocument()
  })

  it("shows image when imageUrl is provided", () => {
    const product = { ...mockProduct, imageUrl: "https://example.com/mug.jpg" }
    renderWithRouter(<ProductCard product={product} />)

    expect(screen.getByRole("img", { name: "Speckled Mug" })).toBeInTheDocument()
  })

  it("shows placeholder when imageUrl is null", () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    expect(screen.getByText("No image")).toBeInTheDocument()
  })

  it("navigates to product page on click", async () => {
    renderWithRouter(<ProductCard product={mockProduct} />)

    await userEvent.click(screen.getByText("Speckled Mug"))

    expect(screen.getByText("Product page")).toBeInTheDocument()
  })
})
