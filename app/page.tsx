"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Dashboard } from "@/components/dashboard"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  // Hook into Privy's authentication state
  const { authenticated, user } = usePrivy()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {authenticated && user?.wallet ? (
          <Dashboard walletAddress={user.wallet.address} />
        ) : (
          <HeroSection />
        )}
      </main>
      
      <Footer />
      <Toaster />
    </div>
  )
}