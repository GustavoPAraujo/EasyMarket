"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Notification from "@/components/notification/notification"

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
    .string()
    .nonempty("Name is required."),

  description: z
    .string()
    .nonempty("Description is required."),

  quantity: z
    .coerce.number({ invalid_type_error: "Quantity must be a number." })
    .refine(val => val > 0, { message: "Quantity must be greater then zero." }),

  price: z
    .coerce.number({ invalid_type_error: "Price must be a number." })
    .refine(val => val > 0, { message: "Price must be greater then zero." }),

  category: z
    .coerce.number({ invalid_type_error: "Category must be a number." })
    .min( 0, { message: "Invalid category." }),
})


interface CreateProductFromProps {
  adminId: number
  onClose: () => void
  onSuccess: () => void;
}


export default function CreateProductFrom({ adminId, onClose, onSuccess }: CreateProductFromProps) {


  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      const result = await createProduct(adminId, values);

      if (result) {
        onClose() 
        onSuccess();
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
      quantity: 0,
      price: 0,
      category: 0
    }
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center z-50 h-full">
      <div className="border rounded-3xl shadow-lg px-10 pb-10 pt-6 bg-white ">

        <Button onClick={() => onClose()}>Close</Button>

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
                    <Input type="number" placeholder="" {...field} />
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
                    <Input type="number" placeholder="" {...field} />
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
                    <Input type="number" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-5">Create Product</Button>

          </form>
        </Form>
      </div>
    </div>
  )
}
