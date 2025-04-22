"use client"

import CreateStoreFrom from "@/components/auth/createStore"
import { useStore } from "@/app/admin/store/storeContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CreateStore() {

  const router = useRouter()
  const store = useStore();

  useEffect(() => {
    if (store) {
      router.push("/admin/store")
    }  
  })
  
  
  return (
    <>
      <CreateStoreFrom />
    </>

  )
}
 