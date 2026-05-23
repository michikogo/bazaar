import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Flex from "./Flex"

describe("Flex", () => {
  it("renders children", () => {
    render(<Flex>Flex content</Flex>)
    expect(screen.getByText("Flex content")).toBeInTheDocument()
  })

  it("applies className", () => {
    render(<Flex className="custom-class">Flex content</Flex>)
    expect(screen.getByText("Flex content").closest(".custom-class")).toBeInTheDocument()
  })

  it("renders as a div", () => {
    render(<Flex>Flex content</Flex>)
    expect(screen.getByText("Flex content").closest("div")).toBeInTheDocument()
  })
})
