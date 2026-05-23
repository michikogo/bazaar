import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Flex, Text, Button, Card } from "../../ds"

type Product = {
  id: string
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  category: string | null
  stock: number | null
  storeId: string
}

type TStore = {
  id: string
  name: string
  bio: string | null
  location: string | null
  products: Product[]
}

const Store = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [store, setStore] = useState<TStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/stores/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Store not found")
        if (!res.ok) throw new Error("Failed to fetch store")
        return res.json()
      })
      .then((data) => setStore(data))
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

  if (error || !store) {
    return (
      <Flex justify="center" align="center" className="h-64">
        <Text color="destructive">{error ?? "Store not found"}</Text>
      </Flex>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>
      <div className="mb-8">
        <Text size="2xl" weight="bold" as="h1">
          {store.name}
        </Text>
        {store.location && (
          <Text color="muted" size="sm" className="mt-1">
            {store.location}
          </Text>
        )}
        {store.bio && (
          <Text color="muted" className="mt-3">
            {store.bio}
          </Text>
        )}
      </div>
      <Text size="xl" weight="semibold" className="mb-6">
        Products
      </Text>
      {store.products.length === 0 ? (
        <Text color="muted">No products yet.</Text>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {store.products.map((product) => (
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
                <Text weight="bold" className="mt-1">
                  ${product.price}
                </Text>
              </Flex>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Store
