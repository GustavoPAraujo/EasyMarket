
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Header() {

  

  return (
    <header className="flex flex-row px-10 py-8 w-screen justify-between
                        bg-gradient-to-l from-tertiary via-primary to-secondary shadow-xl shadow-light-2 ">
      <div>
        <Link href="/">
          <Image src="/Logo.png" alt="logo" width={250} height={300}/>
        </Link>
      </div>


      <div className="pr-20 flex items-center">
        <nav className="flex flex-row gap-6">
          <h1 className="text-white">teste</h1>
          <h1 className="text-white">teste</h1>

          <Link href="/auth">
            <h1 className="text-white hover:overline">carrinho</h1>
          </Link>

        </nav>
      </div>

    </header>
  )
}
