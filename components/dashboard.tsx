
"use client"

import { useEffect, useState } from "react"
import { CreateGigForm } from "@/components/create-gig-form"
import { GigsList } from "@/components/gigs-list"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Loader2, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useGigs, useGig, type Gig } from "@/hooks/use-gigs"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"

interface DashboardProps {
  walletAddress: string
}

export type { Gig }

export function Dashboard({ walletAddress }: DashboardProps) {
  const { toast } = useToast()
  const { gigIds, totalGigs, isLoading: isLoadingCounter, refetch: refetchGigs } = useGigs()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [isLoadingGigs, setIsLoadingGigs] = useState(false)
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch all gigs when gigIds change
  useEffect(() => {
    async function fetchAllGigs() {
      if (gigIds.length === 0) {
        setGigs([])
        return
      }

      setIsLoadingGigs(true)
      
      // Note: This is a simple approach. For better performance with many gigs,
      // consider using wagmi's multicall or a subgraph
      const fetchedGigs: Gig[] = []
      
      // We'll fetch gigs using the useGig hook in a component wrapper
      // For now, we'll keep the structure ready
      
      setIsLoadingGigs(false)
    }

    fetchAllGigs()
  }, [gigIds])

  // Handlers for contract writes
  const { writeContract: writeRelease } = useWriteContract()
  const { writeContract: writeRefund } = useWriteContract()
  const { writeContract: writeAccept } = useWriteContract()
  const { writeContract: writeDispute } = useWriteContract()

  const handleReleaseFunds = (gigId: number) => {
    try {
      writeRelease({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "releaseFunds",
        args: [BigInt(gigId)],
      })

      toast({
        title: "Transaction Submitted",
        description: "Releasing funds to freelancer. Please wait for confirmation.",
      })

      // Refetch gigs after a delay to allow blockchain to update
      setTimeout(() => {
        refetchGigs()
      }, 3000)
    } catch (error) {
      console.error("Release funds error:", error)
      toast({
        title: "Error",
        description: "Failed to release funds. Check console.",
        variant: "destructive",
      })
    }
  }

  const handleRefund = (gigId: number) => {
    try {
      writeRefund({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "refund",
        args: [BigInt(gigId)],
      })

      toast({
        title: "Transaction Submitted",
        description: "Processing refund. Please wait for confirmation.",
      })

      // Refetch gigs after a delay
      setTimeout(() => {
        refetchGigs()
      }, 3000)
    } catch (error) {
      console.error("Refund error:", error)
      toast({
        title: "Error",
        description: "Failed to process refund. Check console.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptGig = (gigId: number) => {
    try {
      writeAccept({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "acceptGig",
        args: [BigInt(gigId)],
      })

      toast({
        title: "Transaction Submitted",
        description: "Accepting gig. Please wait for confirmation.",
      })

      setTimeout(() => {
        refetchGigs()
      }, 3000)
    } catch (error) {
      console.error("Accept gig error:", error)
      toast({
        title: "Error",
        description: "Failed to accept gig. Check console.",
        variant: "destructive",
      })
    }
  }

  const handleDisputeGig = (gigId: number) => {
    try {
      writeDispute({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "disputeGig",
        args: [BigInt(gigId)],
      })

      toast({
        title: "Transaction Submitted",
        description: "Raising dispute. An arbiter will review the case.",
      })

      setTimeout(() => {
        refetchGigs()
      }, 3000)
    } catch (error) {
      console.error("Dispute gig error:", error)
      toast({
        title: "Error",
        description: "Failed to raise dispute. Check console.",
        variant: "destructive",
      })
    }
  }

  const handleGigCreated = () => {
    // Refetch gigs when a new one is created
    setTimeout(() => {
      refetchGigs()
    }, 3000)
  }

  if (isLoadingCounter) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading gigs from blockchain...</span>
        </div>
      </div>
    )
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

      {totalGigs === 0 && (
        <Alert className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-blue-100">
            No gigs found on the blockchain yet. Create your first gig to get started!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="w-full">
          <CreateGigForm onGigCreated={handleGigCreated} />
        </div>
        <div className="w-full space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search gigs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-card/50 backdrop-blur-sm"
              />
            </div>
            <div className="relative w-full sm:w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-card/50 backdrop-blur-sm px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="disputed">Disputed</option>
                <option value="completed">Completed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <GigsList
            gigIds={gigIds}
            walletAddress={walletAddress}
            onReleaseFunds={handleReleaseFunds}
            onRefund={handleRefund}
            onAcceptGig={handleAcceptGig}
            onDisputeGig={handleDisputeGig}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        </div>
      </div>
    </div>
  )
}
