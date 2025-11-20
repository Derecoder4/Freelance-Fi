"use client"

import { useState } from "react"
import { CreateGigForm } from "@/components/create-gig-form"
import { GigsList } from "@/components/gigs-list"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface DashboardProps {
  walletAddress: string
}

// Mock gig data type
export interface Gig {
  id: number
  client: string
  freelancer: string
  description: string
  amount: number
  status: "pending" | "completed" | "refunded"
}

export function Dashboard({ walletAddress }: DashboardProps) {
  const { toast } = useToast()

  // Mock gigs - replace with smart contract data
  const [gigs, setGigs] = useState<Gig[]>([
    {
      id: 1,
      client: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      freelancer: "0x1234567890abcdef1234567890abcdef12345678",
      description: "Fix my website's landing page",
      amount: 150,
      status: "pending",
    },
    {
      id: 2,
      client: "0xabcdef1234567890abcdef1234567890abcdef12",
      freelancer: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      description: "Design a logo for my startup",
      amount: 300,
      status: "pending",
    },
    {
      id: 3,
      client: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      freelancer: "0x9876543210fedcba9876543210fedcba98765432",
      description: "Write technical documentation",
      amount: 250,
      status: "completed",
    },
  ])

  const handleCreateGig = (freelancerAddress: string, description: string, amount: number) => {
    const newGig: Gig = {
      id: gigs.length + 1,
      client: walletAddress,
      freelancer: freelancerAddress,
      description,
      amount,
      status: "pending",
    }
    setGigs([newGig, ...gigs])

    toast({
      title: "Gig Created Successfully!",
      description: `Created gig for ${amount} USDC. Funds are now in escrow.`,
    })
  }

  const handleReleaseFunds = (gigId: number) => {
    setGigs(gigs.map((gig) => (gig.id === gigId ? { ...gig, status: "completed" as const } : gig)))

    toast({
      title: "Funds Released",
      description: "Payment has been successfully released to the freelancer.",
    })
  }

  const handleRefund = (gigId: number) => {
    setGigs(gigs.map((gig) => (gig.id === gigId ? { ...gig, status: "refunded" as const } : gig)))

    toast({
      title: "Refund Processed",
      description: "Funds have been refunded to your wallet.",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      <Alert className="mb-6 bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>For Clients:</strong> Create a gig by entering the freelancer's wallet address, job details, and
          payment amount.
          <strong className="ml-2">For Freelancers:</strong> Share your wallet address with clients to receive work
          opportunities.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="w-full">
          <CreateGigForm onCreateGig={handleCreateGig} />
        </div>
        <div className="w-full">
          <GigsList
            gigs={gigs}
            walletAddress={walletAddress}
            onReleaseFunds={handleReleaseFunds}
            onRefund={handleRefund}
          />
        </div>
      </div>
    </div>
  )
}
