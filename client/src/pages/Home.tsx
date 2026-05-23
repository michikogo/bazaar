import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Flex, Text } from "../ds"

type Product = {
  id: string
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  category: string | null
  stock: number | null
  storeId: string
  storeName: string
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

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
          <Card key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
            <div className="aspect-square bg-secondary">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Flex justify="center" align="center" className="h-full">
                  <Text color="muted" size="sm">
                    No image
                  </Text>
                </Flex>
              )}
            </div>
            <Flex direction="col" gap="1" className="p-4">
              <Text weight="semibold">{product.name}</Text>
              <Text color="muted" size="sm">
                {product.storeName}
              </Text>
              <Text weight="bold" className="mt-1">
                ${product.price}
              </Text>
            </Flex>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Home
