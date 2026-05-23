import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Card from "./Card"

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText("Card content")).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn()
    render(<Card onClick={onClick}>Card content</Card>)
    await userEvent.click(screen.getByText("Card content"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("applies className", () => {
    render(<Card className="p-4">Card content</Card>)
    expect(screen.getByText("Card content").closest(".p-4")).toBeInTheDocument()
  })
})
