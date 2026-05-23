export type TProduct = {
  id: string
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  category: string | null
  stock: number | null
  storeId: string
}

export type TProductWithStore = TProduct & {
  storeName: string
}

export type TStore = {
  id: string
  name: string
  bio: string | null
  location: string | null
  products: TProduct[]
}
