'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '../../storeContext';

export default function ProductPage() {
  const { id } = useParams();
  const store = useStore();

  const product = store.products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="">
        <p className="text-red-500">Produto não encontrado.</p>
        <Link href="/admin/store/products" className="mt-4 inline-block text-primary">
          &larr; Voltar à lista
        </Link>
      </div>
    );
  }

  const priceNumber = typeof product.price === 'number'
    ? product.price
    : parseFloat(String(product.price)) || 0;

  return (
    <div className="">
      <Link href="/admin/store/products" className="text-primary">
        &larr; Voltar à lista
      </Link>
      <h1 className="font-bold text-3xl mt-4">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.description}</p>
      <div className="mt-4 flex space-x-6">
        <p><strong>Preço:</strong> R$ {priceNumber.toFixed(2)}</p>
        <p><strong>Em estoque:</strong> {product.quantity}</p>
      </div>
      {/* {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="mt-6 w-64 h-64 object-cover rounded-lg shadow"
        />
      )} */}
    </div>
  );
}
