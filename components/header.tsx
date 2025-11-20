"use client"

import Image from "next/image"
import { Wallet, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  isConnected: boolean
  walletAddress: string
  onConnect: () => void
  onDisconnect: () => void
}

export function Header({ isConnected, walletAddress, onConnect, onDisconnect }: HeaderProps) {
  const truncateAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Image
              src="/images/creat-a-professional-logo-for-a-feelance-csr5jyl-q0gmk8l4x-ai0a-yaeaxig5rpytcsdtj8ioda.jpeg"
              alt="Freelance-Fi"
              width={40}
              height={40}
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 object-cover"
            />
            <span className="text-base sm:text-xl font-bold text-foreground truncate">Freelance-Fi</span>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            {isConnected && (
              <Badge variant="outline" className="hidden sm:flex bg-green-500/10 text-green-600 border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                Connected
              </Badge>
            )}

            {isConnected ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDisconnect}
                  className="text-muted-foreground hover:text-foreground"
                  title="Disconnect Wallet"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Disconnect</span>
                </Button>
                <Button
                  variant="outline"
                  className="font-mono text-xs sm:text-sm bg-transparent px-2 sm:px-4 pointer-events-none"
                >
                  <Wallet className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{truncateAddress(walletAddress)}</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={onConnect}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm px-3 sm:px-4"
              >
                <Wallet className="h-4 w-4 sm:mr-2" />
                <span className="hidden xs:inline sm:inline">Connect</span>
                <span className="hidden sm:inline">&nbsp;Wallet</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
