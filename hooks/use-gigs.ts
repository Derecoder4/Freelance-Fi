import { useReadContract } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"
import { useEffect, useState } from "react"
import { formatUnits } from "viem"

export interface Gig {
  id: number
  client: string
  freelancer: string
  amount: number // In USDC (already converted from wei)
  status: "pending" | "in_progress" | "disputed" | "completed" | "refunded"
  description: string
  isAccepted: boolean
  isDisputed: boolean
}

export function useGigs() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [gigIds, setGigIds] = useState<number[]>([])

  // 1. Get the total number of gigs from the contract
  const { data: gigCounter, isError, isLoading, refetch: refetchCounter } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "gigCounter",
  })

  // 2. When gigCounter changes, create array of IDs to fetch
  useEffect(() => {
    if (gigCounter) {
      const total = Number(gigCounter)
      const ids = Array.from({ length: total }, (_, i) => i + 1)
      setGigIds(ids)
    }
  }, [gigCounter])

  // 3. Fetch each gig (we'll need to do this in the component for now)
  // This is a simplified version - in production you'd use wagmi's batch reading

  const refetch = () => {
    refetchCounter()
  }

  return {
    gigs,
    gigIds, // Export this so components can fetch individual gigs
    totalGigs: gigCounter ? Number(gigCounter) : 0,
    isLoading,
    isError,
    refetch,
    setGigs, // Allow manual setting for now
  }
}

// Hook to read a single gig
export function useGig(gigId: number) {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "gigs",
    args: [BigInt(gigId)],
  })

  const [gig, setGig] = useState<Gig | null>(null)

  useEffect(() => {
    if (data && Array.isArray(data)) {
      // data is a tuple: [id, client, freelancer, amount, description, isAccepted, isDisputed, isComplete, isRefunded]
      const [id, client, freelancer, amount, description, isAccepted, isDisputed, isComplete, isRefunded] = data

      let status: Gig["status"] = "pending"
      if (isRefunded) status = "refunded"
      else if (isComplete) status = "completed"
      else if (isDisputed) status = "disputed"
      else if (isAccepted) status = "in_progress"

      setGig({
        id: Number(id),
        client: client as string,
        freelancer: freelancer as string,
        amount: Number(formatUnits(amount as bigint, 18)), // Convert from wei to USDC
        status,
        description: description as string,
        isAccepted: isAccepted as boolean,
        isDisputed: isDisputed as boolean,
      })
    }
  }, [data])

  return {
    gig,
    isLoading,
    isError,
    refetch,
  }
}
