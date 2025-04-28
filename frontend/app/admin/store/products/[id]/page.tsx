'use client'

import { useParams } from 'next/navigation'
import { useStore } from '../../storeContext'

export default function ProductDetailClient() {

  const { id } = useParams()
  const store = useStore()

  const product = store.products.find((product) => product.id === Number(id) )
  console.log(product)


  return( 
    <p>Produto selecionado: {id}</p>
  )
}
