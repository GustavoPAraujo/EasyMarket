import Link from "next/link";



export default function ProductCard({ product }: any) {


  return (
    <Link href={`/admin/store/products/${product.id}`}>
    <div key={product.id} className="bg-light-1 w-66 h-20 p-2 m-2 rounded-xl shadow-lg" >
      <h1>
        {product.name}
      </h1>
      <div className="flex flex-row">
        <p className="w-1/2">R$ {product.price}</p>
        <p className="w-1/2">In stock: {product.quantity}</p>

      </div>
    </div>
    </Link>
  )
}