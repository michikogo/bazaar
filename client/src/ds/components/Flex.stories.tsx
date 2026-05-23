import React from "react"
import Flex from "./Flex"

export const Row = () => (
  <Flex direction="row" gap="4">
    <div className="bg-gray-200 p-4 rounded">Item 1</div>
    <div className="bg-gray-200 p-4 rounded">Item 2</div>
    <div className="bg-gray-200 p-4 rounded">Item 3</div>
  </Flex>
)

export const Column = () => (
  <Flex direction="col" gap="4">
    <div className="bg-gray-200 p-4 rounded">Item 1</div>
    <div className="bg-gray-200 p-4 rounded">Item 2</div>
    <div className="bg-gray-200 p-4 rounded">Item 3</div>
  </Flex>
)

export const Centered = () => (
  <Flex direction="row" gap="4" align="center" justify="center" className="h-40 bg-gray-50">
    <div className="bg-gray-200 p-4 rounded">Centered</div>
  </Flex>
)
