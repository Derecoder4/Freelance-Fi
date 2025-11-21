"use client"

import { usePrivy } from "@privy-io/react-auth" // 1. Import Privy
import { Wallet, Shield, Zap, CheckCircle, ArrowRight, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Removed "props" because we handle login internally now
export function HeroSection() {
  const { login } = usePrivy() // 2. Get the login function

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <Alert className="bg-primary/5 border-primary/20 rounded-2xl border-2">
          <Wallet className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm sm:text-base">
            <strong className="font-semibold">Connect your wallet to get started.</strong> You'll need a Web3 wallet to
            create gigs, manage payments, and interact with the platform.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground">
            Secure Freelance Payments on Arc
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Lock funds in USDC, get work done, release payment. Fast, secure, and low fees.
          </p>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            onClick={login} // 3. Attach the real login function
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <Wallet className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Connect Wallet to Get Started
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <p className="text-xs sm:text-sm text-muted-foreground mt-3">
            No wallet? Get started with MetaMask, Rainbow, or any Web3 wallet
          </p>
        </div>

        {/* ... The rest of the file stays the same (cards, features, etc.) ... */}
        <div className="pt-8 grid sm:grid-cols-2 gap-4">
          <Card className="p-6 text-left border-2 hover:border-primary/50 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">For Clients</h3>
                <p className="text-sm text-muted-foreground">
                  Post jobs, deposit USDC into escrow, and release payment when work is complete.
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 text-left border-2 hover:border-primary/50 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">For Freelancers</h3>
                <p className="text-sm text-muted-foreground">
                  Share your wallet address, complete the work, and get paid instantly when the client approves.
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* (Keep the rest of the original file content below this point) */}
      </div>
    </div>
  )
}