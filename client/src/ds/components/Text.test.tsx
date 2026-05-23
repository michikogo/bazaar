import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Text from "./Text"

describe("Text", () => {
  it("renders children", () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("renders as a p tag by default", () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText("Hello").tagName).toBe("P")
  })

  it.each(["h1", "h2", "h3", "h4", "span"] as const)("renders as %s when specified", (tag) => {
    render(<Text as={tag}>Hello</Text>)
    expect(screen.getByText("Hello").tagName).toBe(tag.toUpperCase())
  })

  it("applies className", () => {
    render(<Text className="custom-class">Hello</Text>)
    expect(screen.getByText("Hello")).toHaveClass("custom-class")
  })
})
