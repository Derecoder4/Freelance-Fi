import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Changed from Geist for stability in Next 14
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Freelance-Fi | Secure Payments on Arc Network",
  description: "Lock funds in USDC, get work done, release payment.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}