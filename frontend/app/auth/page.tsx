"use client"

import Login from "@/components/auth/login"
import SignUp from "@/components/auth/signup";
import { useState } from "react";

export default function Auth() {

  const [formValue, setFormValue] = useState<boolean>(true)

  return (
    <div className="h-full flex justify-around items-center ">
      <div className=" flex items-center justify-center">
        .
      </div>

      <div className=" flex items-center justify-center">
        <div className="p-5 border rounded-3xl shadow-2xl">

          <div className="w-full flex border rounded-2xl shadow-md mb-5 p-1 gap-1">
            <button 
              className="w-1/2 p-3 rounded-xl hover:bg-tertiary hover:text-white hover:opacity-90 focus:text-white focus:bg-tertiary" 
              onClick={() => setFormValue(true)}>
                Login
            </button>

            <button 
              className="w-1/2 p-3 rounded-xl hover:bg-tertiary hover:text-white hover:opacity-90 focus:text-white focus:bg-tertiary" 
              onClick={() => setFormValue(false)}>
                SignUp
            </button>
          </div>

          {
            formValue ? <Login /> : <SignUp />
          }

        </div>
      </div>

    </div>
  );
}
