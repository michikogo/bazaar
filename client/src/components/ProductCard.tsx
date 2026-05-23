import React from "react"
import { useNavigate } from "react-router-dom"
import { Card, Flex, Text } from "@/ds"
import type { TProduct } from "@/types"

type Props = {
  product: TProduct & { storeName?: string }
  showStoreName?: boolean
}

const ProductCard = ({ product, showStoreName = false }: Props) => {
  const navigate = useNavigate()

  return (
    <Card onClick={() => navigate(`/product/${product.id}`)}>
      <div className="aspect-square bg-secondary">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
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
        {showStoreName && (
          <Text color="muted" size="sm">
            {product.storeName}
          </Text>
        )}
        <Text weight="bold" className="mt-1">
          ${product.price}
        </Text>
      </Flex>
    </Card>
  )
}

export default ProductCard
