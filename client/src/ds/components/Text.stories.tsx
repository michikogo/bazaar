import React from "react"
import Text from "./Text"

export const Sizes = () => (
  <div className="flex flex-col gap-2">
    <Text size="xs">Extra Small</Text>
    <Text size="sm">Small</Text>
    <Text size="base">Base</Text>
    <Text size="lg">Large</Text>
    <Text size="xl">Extra Large</Text>
    <Text size="2xl">2XL</Text>
  </div>
)

export const Weights = () => (
  <div className="flex flex-col gap-2">
    <Text weight="normal">Normal weight</Text>
    <Text weight="medium">Medium weight</Text>
    <Text weight="semibold">Semibold weight</Text>
    <Text weight="bold">Bold weight</Text>
  </div>
)

export const Colors = () => (
  <div className="flex flex-col gap-2">
    <Text color="default">Default</Text>
    <Text color="muted">Muted</Text>
    <Text color="warning">Warning</Text>
    <Text color="destructive">Destructive</Text>
  </div>
)
