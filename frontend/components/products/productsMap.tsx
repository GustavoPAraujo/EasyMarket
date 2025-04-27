
import { Product } from "@/types/store"

interface ProductsMapProps {
  products: Product[]
}

export default function ProductsMap({ products }: ProductsMapProps) {

  return (
    <div>
      <h1>My products</h1>
      <div>
        {products.map((product) =>
          <div key={product.id} className="bg-light-1 w-66 h-20 p-2 m-2 " >
            <h1>
              {product.name}
            </h1>
            <div className="flex flex-row">
            <p className="w-1/2">R$ {product.price}</p>
            <p className="w-1/2">In stock: {product.quantity}</p>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}
