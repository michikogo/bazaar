import React from "react"
import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Button from "./Button"

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick} disabled>Click me</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("renders the correct type attribute", () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit")
  })

  it.each(["primary", "secondary", "ghost", "warning", "destructive"] as const)(
    "renders %s variant without errors",
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>)
      expect(screen.getByRole("button", { name: variant })).toBeInTheDocument()
    }
  )

  it.each(["sm", "md", "lg"] as const)("renders %s size without errors", (size) => {
    render(<Button size={size}>{size}</Button>)
    expect(screen.getByRole("button", { name: size })).toBeInTheDocument()
  })
})
