"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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


const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is requiered."
    })
    .email({
      message: "Must be a valid email."
    }),
  password: z
    .string({
      required_error: "Password is requiered."
    })
    .min(4, { message: "Must have at least 4 characters." })
})

export default function Login() {

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log(values)
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })


  return (
    <>
      <div className="">
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-100">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-5">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-5">Sign Up</Button>

          </form>
        </Form>

      </div>

    </>
  )
}
