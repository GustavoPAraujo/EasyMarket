"use client"

import "./globals.css";
import Header from "@/components/header/header";
import { usePathname } from "next/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body className="flex flex-col h-screen overflow-x-hidden ">
      {!isAdmin && <Header />}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
