"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Dashboard } from "@/components/dashboard"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  // Mock wallet connection state - replace with RainbowKit integration
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnect = () => {
    // This will be replaced with RainbowKit connection
    setIsConnected(true)
    setWalletAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isConnected={isConnected}
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <main className="flex-1">
        {isConnected ? <Dashboard walletAddress={walletAddress} /> : <HeroSection onConnect={handleConnect} />}
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}
