
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signup } from "@/services/authservices";
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
  name: z
    .string({
      required_error: "Name is requiered."
    }),
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
    .min(8, { message: "Must have at least 8 characters." }),
  role: z
    .string()
})

export default function SignUp() {

  const router = useRouter()

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {

      console.log(values)
      const result = await signup(values);

      if (result) {
        form.reset()
        router.push("/")
      }

    } catch (error) {
      console.log("SignUp form", error)
    }
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CLIENT"
    }
  })

  return (
    <>
      <div className="border rounded-3xl shadow-2xl px-10 py-14 ">
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-100">

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
