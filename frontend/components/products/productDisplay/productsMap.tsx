
import { Product } from "@/types/store"
import ProductCard from "./productCard"

interface ProductsMapProps {
  products: Product[]
}

export default function ProductsMap({ products }: ProductsMapProps) {

  return (
    <div>
      <h1>My products</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-6">
        {products.map((product) =>
          <ProductCard key={product.id} product={product} />
        )}
      </div>
    </div>
  )
}
