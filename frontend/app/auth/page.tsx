
import Login from "@/components/auth/login"
import SignUp from "@/components/auth/signup";

export default function Auth() {
  
  return (
    <div className="h-full flex justify-around items-center ">
      <div className=" flex items-center justify-center">
        <SignUp />
      </div>

      <div className=" flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
