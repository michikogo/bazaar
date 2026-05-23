import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Flex, Text, Button } from "../ds"

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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Product not found")
        if (!res.ok) throw new Error("Failed to fetch product")
        return res.json()
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-64">
        <Text color="muted">Loading...</Text>
      </Flex>
    )
  }

  if (error || !product) {
    return (
      <Flex justify="center" align="center" className="h-64">
        <Text color="destructive">{error ?? "Product not found"}</Text>
      </Flex>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Flex justify="center" align="center" className="h-full">
              <Text color="muted">No image</Text>
            </Flex>
          )}
        </div>
        <Flex direction="col" gap="4">
          <div>
            <Text size="2xl" weight="bold" as="h1">
              {product.name}
            </Text>
            <button
              onClick={() => navigate(`/store/${product.storeId}`)}
              className="text-primary text-sm hover:underline mt-1"
            >
              {product.storeName}
            </button>
          </div>
          <Text size="xl" weight="bold">
            ${product.price}
          </Text>
          {product.description && <Text color="muted">{product.description}</Text>}
          <Flex gap="4">
            {product.category && (
              <span className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
            {product.stock !== null && (
              <Text size="sm" color="muted">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Text>
            )}
          </Flex>
        </Flex>
      </div>
    </div>
  )
}

export default ProductDetail
