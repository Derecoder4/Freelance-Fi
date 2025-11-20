"use client"

import { Wallet, Shield, Zap, CheckCircle, ArrowRight, Users, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface HeroSectionProps {
  onConnect: () => void
}

export function HeroSection({ onConnect }: HeroSectionProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* More rounded alert with enhanced styling */}
        <Alert className="bg-primary/5 border-primary/20 rounded-2xl border-2">
          <Wallet className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm sm:text-base">
            <strong className="font-semibold">Connect your wallet to get started.</strong> You'll need a Web3 wallet to
            create gigs, manage payments, and interact with the platform.
          </AlertDescription>
        </Alert>

        {/* Hero Content */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground">
            Secure Freelance Payments on Arc
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Lock funds in USDC, get work done, release payment. Fast, secure, and low fees.
          </p>
        </div>

        {/* Enhanced CTA button with more rounded corners and shadow */}
        <div className="pt-4">
          <Button
            size="lg"
            onClick={onConnect}
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

        <div className="pt-8 grid sm:grid-cols-2 gap-4">
          {/* Enhanced cards with glass morphism effect and more rounded corners */}
          <Card className="p-6 text-left border-2 hover:border-primary/50 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">For Clients</h3>
                <p className="text-sm text-muted-foreground">
                  Post jobs, deposit USDC into escrow, and release payment when work is complete. Your funds are
                  protected until you approve.
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
                  Share your wallet address, complete the work, and get paid instantly when the client approves. No
                  middleman fees.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="pt-8">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Connect Wallet</h3>
                <p className="text-xs text-muted-foreground">Link your Web3 wallet to access the dashboard</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Create a Gig</h3>
                <p className="text-xs text-muted-foreground">Set terms and deposit USDC into escrow</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Release Payment</h3>
                <p className="text-xs text-muted-foreground">Approve work and funds are transferred instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced feature cards with glass morphism and rounded corners */}
        <div className="grid sm:grid-cols-3 gap-6 pt-12">
          <Card className="p-6 space-y-3 border-2 hover:border-primary/50 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-card-foreground">Secure Escrow</h3>
            <p className="text-sm text-muted-foreground">
              Smart contract protection ensures funds are safe until work is completed
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-2 hover:border-primary/50 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-card-foreground">Fast & Low Fees</h3>
            <p className="text-sm text-muted-foreground">
              Built on Arc Network for lightning-fast transactions with minimal costs
            </p>
          </Card>

          <Card className="p-6 space-y-3 border-2 hover:border-primary/50 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg text-card-foreground">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">
              Simple interface for creating gigs, tracking progress, and releasing payments
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
