'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link';
import Image from "next/image"

const tabs = [
  { label: "Over View", href: "/admin/store" },
  { label: "Products", href: "/admin/store/products" },
  { label: "Orders", href: "/admin/store/orders" },
  { label: "Edit Store", href: "/admin/store/edit" },
];

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="px-10 py-5 bg-primary h-screen">

      <div className='pb-8'>
        <Link href="/admin/store">
          <Image src="/Logo.png" alt="logo" width={250} height={300} />
        </Link>

      </div>

      <nav>
        <ul className="flex flex-col pl-2 space-y-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`pb-2 ${isActive
                    ? "border-b-2 border-light-2 text-white font-bold text-lg"
                    : "text-gray-200 hover:text-white font-semibold text-lg"
                    }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  )
}