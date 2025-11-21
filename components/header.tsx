"use client"

import Image from "next/image"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { LogOut, Wallet } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { login, authenticated, user, logout } = usePrivy()

  const truncateAddress = (address: string | undefined) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
               <Image
                src="/icon.svg" 
                alt="Freelance-Fi"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold text-foreground truncate">
                Freelance-Fi
              </span>
              <Link href="/admin" className="text-[10px] text-muted-foreground hover:text-primary transition-colors">
                Mediator Dashboard
              </Link>
            </div>
          </div>

          {/* Connect Button */}
          <div className="flex-shrink-0 flex gap-2">
            {authenticated ? (
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-muted rounded-md text-sm font-mono">
                  {truncateAddress(user?.wallet?.address)}
                </div>
                <Button variant="outline" size="icon" onClick={logout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={login} className="gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}