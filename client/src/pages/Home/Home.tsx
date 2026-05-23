import React, { useEffect, useState } from "react"
import { Flex, Text } from "@/ds"
import type { TProductWithStore } from "@/types"
import ProductCard from "@/components/ProductCard"

const Home = () => {
  const [products, setProducts] = useState<TProductWithStore[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products")
        return res.json()
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-64">
        <Text color="muted">Loading...</Text>
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex justify="center" align="center" className="h-64">
        <Text color="destructive">{error}</Text>
      </Flex>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Text size="2xl" weight="bold" as="h1" className="mb-8">
        All Products
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showStoreName />
        ))}
      </div>
    </div>
  )
}

export default Home
