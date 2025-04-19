"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/services/authservices";
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
    .min(8, { message: "Must have at least 8 characters." })
})

export default function Login() {

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {

      const result = await login(values);

      if (result) {
        form.reset()
        router.push("/")
      }

    } catch (error) {
      console.log("Login form", error)
    }
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
      <div className="border rounded-3xl shadow-2xl px-10 py-14 ">
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

            <Button type="submit" className="mt-5">Login</Button>

          </form>
        </Form>
      </div>
    </>
  )
}
