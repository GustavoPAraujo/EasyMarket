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


const storeSchema = z.object({
  name: z
    .string({
      required_error: "Name is requiered."
    }),
  description: z
    .string({
      required_error: "Store's description is requiered."
    })
})


export default function CreateStoreFrom() {

  
    const router = useRouter()
  
    const onSubmit = async (values: z.infer<typeof storeSchema>) => {
      try {
        const result = await createStore(values);

        if (result.data) {
          router.push("/admin/store")
        }
  
      } catch (error) {
        console.log("Login form", error)
      }
    }
  
    const form = useForm<z.infer<typeof storeSchema>>({
      resolver: zodResolver(storeSchema),
      defaultValues: {
        name: "",
        description: ""
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

            <Button type="submit" className="mt-5">Create Store</Button>

          </form>
        </Form>
      </div>
    </>
  )
}
