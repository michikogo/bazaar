import React from "react"
import Button from "./Button"

export const Variants = () => (
  <div className="flex gap-4">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
  </div>
)

export const Sizes = () => (
  <div className="flex items-center gap-4">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const Disabled = () => (
  <div className="flex gap-4">
    <Button variant="primary" disabled>Primary</Button>
    <Button variant="secondary" disabled>Secondary</Button>
    <Button variant="ghost" disabled>Ghost</Button>
  </div>
)
