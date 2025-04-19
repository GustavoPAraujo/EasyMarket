
import Login from "@/components/auth/login"
import Link from "next/link";

export default function Auth() {


  return (
    <div className="h-full flex justify-around items-center ">
      <div className=" flex items-center justify-center">
        .
      </div>

      <div className=" flex flex-col items-center justify-center">
        <Login />
        <div className="flex flex-row mt-6">
          <p className="mr-1">Don't have an account?</p>
          <Link href="/register" className="text-primary">
            Sign Up
          </Link>
        </div>

      </div>

    </div>
  );
}
