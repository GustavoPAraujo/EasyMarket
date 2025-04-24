"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createStore } from "@/services/storeServices"
import { useRouter } from "next/navigation"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createProduct } from "@/services/productServices";


const productSchema = z.object({
  name: z
    .string({
      required_error: "Name is requiered."
    }),
  description: z
    .string({
      required_error: "Store's description is requiered."
    }),
  quantity: z
    .number(),
  price: z
    .number(),
  category: z
    .number(),
})

interface CreateProductFromProps {
  adminId: number
}


export default function CreateProductFrom({ adminId }: CreateProductFromProps) {

    
    const onSubmit = async (values: z.infer<typeof productSchema>) => {
      try {
        console.log("values:", values)
        const result = await createProduct(adminId, values);

        if (result.data) {
          console.log(result.data)
        }
  
      } catch (error) {
        console.log("Login form", error)
      }
    }
  
    const form = useForm<z.infer<typeof productSchema>>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: "",
        description: "",
        quantity: undefined,
        price: undefined,
        category: undefined
      }
    })

  return (
    <>
      <div className="border rounded-3xl shadow-lg px-10 pb-10 pt-6 ">
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-200">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="name" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input type="description" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="quantity" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="price" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input type="category" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-5">Create Store</Button>

          </form>
        </Form>
      </div>
    </>
  )
}
