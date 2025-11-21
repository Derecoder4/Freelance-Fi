"use client"

import { useState, useEffect } from "react"
import { Briefcase, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

// Blockchain imports
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain } from "wagmi"
import { parseUnits } from "viem"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"

const ARC_TESTNET_CHAIN_ID = 5042002

interface CreateGigFormProps {
  onGigCreated?: () => void
}

export function CreateGigForm({ onGigCreated }: CreateGigFormProps) {
  const { toast } = useToast()
  
  const [freelancerAddress, setFreelancerAddress] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  // Check current chain
  const { chain } = useAccount()
  const { switchChain } = useSwitchChain()

  const { data: hash, writeContract, isPending: isWritePending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Check if on wrong network
  const isWrongNetwork = chain && chain.id !== ARC_TESTNET_CHAIN_ID

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Gig Created!",
        description: "Your transaction has been confirmed on the blockchain.",
      })
      setFreelancerAddress("")
      setDescription("")
      setAmount("")
      onGigCreated?.()
    }
  }, [isSuccess, toast, onGigCreated])

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: ARC_TESTNET_CHAIN_ID })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!freelancerAddress || !description || !amount) return

    // Check network before submitting
    if (isWrongNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Arc Testnet to create a gig.",
        variant: "destructive",
      })
      return
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createGig",
        args: [freelancerAddress as `0x${string}`, description],
        value: parseUnits(amount, 18),
      })
    } catch (error) {
      console.error("Transaction failed:", error)
      toast({
        title: "Error",
        description: "Failed to send transaction. Check console.",
        variant: "destructive",
      })
    }
  }

  const isFormValid = freelancerAddress && description && amount && Number.parseFloat(amount) > 0
  const isLoading = isWritePending || isConfirming

  return (
    <Card className="h-fit rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          Hire a Freelancer
        </CardTitle>
        <CardDescription>Create a new gig and deposit USDC into escrow</CardDescription>
      </CardHeader>
      <CardContent>
        {isWrongNetwork && (
          <Alert className="mb-4 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-sm">
              <strong>Wrong Network!</strong> You're on {chain?.name || "an unsupported network"}. 
              <Button
                variant="link"
                className="p-0 h-auto ml-1 text-destructive underline"
                onClick={handleSwitchNetwork}
              >
                Switch to Arc Testnet
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="freelancer-address">Freelancer Address</Label>
            <Input
              id="freelancer-address"
              placeholder="0x..."
              value={freelancerAddress}
              onChange={(e) => setFreelancerAddress(e.target.value)}
              className="font-mono text-sm rounded-xl"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="e.g., Fix my website's landing page"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-xl"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="150"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              className="rounded-xl"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.60_0.18_145)] disabled:opacity-50 rounded-xl h-11 shadow-md hover:shadow-lg transition-all"
            disabled={!isFormValid || isLoading || isWrongNetwork}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isConfirming ? "Confirming on-chain..." : "Check Wallet..."}
              </>
            ) : isWrongNetwork ? (
              "Switch to Arc Testnet First"
            ) : (
              "Create & Deposit Funds"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}