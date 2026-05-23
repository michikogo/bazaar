import React from "react"
import Card from "./Card"
import Text from "./Text"

export const Default = () => (
  <Card className="p-4 w-64">
    <Text weight="semibold">Card title</Text>
    <Text color="muted" size="sm">
      Some content inside the card.
    </Text>
  </Card>
)

export const Clickable = () => (
  <Card onClick={() => alert("clicked")} className="p-4 w-64">
    <Text weight="semibold">Clickable card</Text>
    <Text color="muted" size="sm">
      Hover to see the shadow.
    </Text>
  </Card>
)
