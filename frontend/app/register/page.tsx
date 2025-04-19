
import SignUp from "@/components/auth/signup"
import Link from "next/link";

export default function Auth() {


  return (
    <div className="h-full flex justify-around items-center ">
      <div className=" flex items-center justify-center">
        .
      </div>

      <div className=" flex flex-col items-center justify-center">
        <SignUp />
        <div className="flex flex-row mt-6">
          <p className="mr-1">Already have an account?</p>
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </div>

      </div>

    </div>
  );
}
