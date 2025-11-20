"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import type { Gig } from "@/components/dashboard"

interface GigCardProps {
  gig: Gig
  walletAddress: string
  onReleaseFunds: (gigId: number) => void
  onRefund: (gigId: number) => void
}

export function GigCard({ gig, walletAddress, onReleaseFunds, onRefund }: GigCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const isClient = gig.client.toLowerCase() === walletAddress.toLowerCase()
  const isFreelancer = gig.freelancer.toLowerCase() === walletAddress.toLowerCase()

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusBadge = () => {
    switch (gig.status) {
      case "pending":
        return (
          <Badge className="bg-[oklch(0.75_0.15_80)] text-[oklch(0.15_0_0)] hover:bg-[oklch(0.75_0.15_80)] text-xs whitespace-nowrap">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.65_0.18_145)] text-xs whitespace-nowrap">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="destructive" className="text-xs whitespace-nowrap">
            <XCircle className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        )
    }
  }

  const handleAction = async (action: "release" | "refund") => {
    setIsProcessing(true)
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (action === "release") {
      onReleaseFunds(gig.id)
    } else {
      onRefund(gig.id)
    }
    setIsProcessing(false)
  }

  return (
    <Card className="border-2 hover:border-primary/50 transition-colors w-full">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg">Gig #{gig.id}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isClient ? "You are the Client" : isFreelancer ? "You are the Freelancer" : "Observer"}
            </p>
          </div>
          <div className="flex-shrink-0">{getStatusBadge()}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-3 sm:pb-4">
        <p className="text-sm sm:text-base text-card-foreground break-words">{gig.description}</p>
        <div className="space-y-1.5 text-sm">
          <p className="text-muted-foreground text-xs sm:text-sm break-all">
            {isClient ? "Freelancer: " : "Client: "}
            <span className="font-mono">{truncateAddress(isClient ? gig.freelancer : gig.client)}</span>
          </p>
          <p className="text-xl sm:text-2xl font-bold text-primary">{gig.amount} USDC</p>
        </div>
      </CardContent>

      {gig.status === "pending" && isClient && (
        <CardFooter className="gap-2 flex-col sm:flex-row pt-3 sm:pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isProcessing}
                className="w-full sm:flex-1 bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.60_0.18_145)] text-sm h-10"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Release Funds
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Release Payment?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to release <strong>{gig.amount} USDC</strong> to the freelancer. This action cannot be
                  undone. Make sure the work has been completed satisfactorily.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction("release")}
                  className="bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.60_0.18_145)] m-0"
                >
                  Confirm Release
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={isProcessing} variant="destructive" className="w-full sm:flex-1 text-sm h-10">
                <XCircle className="mr-2 h-4 w-4" />
                Request Refund
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>Request Refund?</AlertDialogTitle>
                <AlertDialogDescription>
                  You are about to refund <strong>{gig.amount} USDC</strong> back to your wallet. This will cancel the
                  gig and mark it as refunded. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction("refund")}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0"
                >
                  Confirm Refund
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}

      {gig.status === "pending" && isFreelancer && (
        <CardFooter className="pt-3 sm:pt-4">
          <div className="w-full text-center text-xs sm:text-sm text-muted-foreground py-2">
            Waiting for client approval
          </div>
        </CardFooter>
      )}

      {gig.status === "completed" && (
        <CardFooter className="pt-3 sm:pt-4">
          <div className="w-full text-center text-xs sm:text-sm text-[oklch(0.65_0.18_145)] font-medium py-2">
            ✓ Payment Released
          </div>
        </CardFooter>
      )}

      {gig.status === "refunded" && (
        <CardFooter className="pt-3 sm:pt-4">
          <div className="w-full text-center text-xs sm:text-sm text-destructive font-medium py-2">
            ✗ Funds Refunded
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
