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
import { CheckCircle, XCircle, Clock, Loader2, AlertTriangle, Briefcase } from "lucide-react"
import type { Gig } from "@/components/dashboard"
import { useToast } from "@/hooks/use-toast"

interface GigCardProps {
  gig: Gig
  walletAddress: string
  onReleaseFunds: (gigId: number) => void
  onRefund: (gigId: number) => void
  onAcceptGig: (gigId: number) => void
  onDisputeGig: (gigId: number) => void
}

export function GigCard({ gig, walletAddress, onReleaseFunds, onRefund, onAcceptGig, onDisputeGig }: GigCardProps) {
  const { toast } = useToast()
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
          <Badge className="bg-[oklch(0.75_0.15_80)] text-[oklch(0.15_0_0)] hover:bg-[oklch(0.75_0.15_80)] text-xs whitespace-nowrap rounded-full px-3 py-1">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-blue-500 text-white hover:bg-blue-600 text-xs whitespace-nowrap rounded-full px-3 py-1">
            <Loader2 className="mr-1 h-3 w-3 animate-spin-slow" />
            In Progress
          </Badge>
        )
      case "disputed":
        return (
          <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-xs whitespace-nowrap rounded-full px-3 py-1">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Disputed
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.65_0.18_145)] text-xs whitespace-nowrap rounded-full px-3 py-1">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "refunded":
        return (
          <Badge variant="destructive" className="text-xs whitespace-nowrap rounded-full px-3 py-1">
            <XCircle className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        )
    }
  }

  const handleAction = async (action: "release" | "refund" | "accept" | "dispute") => {
    setIsProcessing(true)
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (action === "release") {
      onReleaseFunds(gig.id)
    } else if (action === "refund") {
      onRefund(gig.id)
    } else if (action === "accept") {
      onAcceptGig(gig.id)
    } else if (action === "dispute") {
      onDisputeGig(gig.id)
    }
    setIsProcessing(false)
  }

  return (
    <Card className="border-2 hover:border-primary/50 transition-all duration-300 w-full rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Gig #{gig.id}
            </h3>
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
            <span className="font-mono bg-muted/50 px-2 py-0.5 rounded-lg">
              {truncateAddress(isClient ? gig.freelancer : gig.client)}
            </span>
          </p>
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {gig.amount} USDC
          </p>
        </div>
      </CardContent>

      {/* Client Actions */}
      {isClient && (gig.status === "pending" || gig.status === "in_progress") && (
        <CardFooter className="gap-2 flex-col sm:flex-row pt-3 sm:pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isProcessing}
                className="w-full sm:flex-1 bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.60_0.18_145)] text-sm h-10 rounded-xl shadow-md hover:shadow-lg transition-all"
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
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
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

          {gig.status === "pending" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isProcessing}
                  variant="destructive"
                  className="w-full sm:flex-1 text-sm h-10 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Request Refund
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
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
          )}
          
          {gig.status === "in_progress" && (
             <AlertDialog>
             <AlertDialogTrigger asChild>
               <Button variant="ghost" className="w-full sm:w-auto text-destructive hover:text-destructive hover:bg-destructive/10 h-10 text-xs sm:text-sm">
                 <AlertTriangle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                 Dispute
               </Button>
             </AlertDialogTrigger>
             <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
               <AlertDialogHeader>
                 <AlertDialogTitle>Raise a Dispute?</AlertDialogTitle>
                 <AlertDialogDescription>
                   This will lock the funds and alert the mediator. Use this only if there is a serious issue.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                 <AlertDialogAction 
                   onClick={() => handleAction("dispute")}
                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                 >
                   Confirm Dispute
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
          )}
        </CardFooter>
      )}

      {/* Freelancer Actions */}
      {isFreelancer && (
        <CardFooter className="pt-3 sm:pt-4 flex-col gap-3">
          {gig.status === "pending" && (
            <Button 
              onClick={() => handleAction("accept")}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Briefcase className="mr-2 h-4 w-4" />}
              Accept Gig & Start Work
            </Button>
          )}

          {gig.status === "in_progress" && (
            <div className="w-full space-y-3">
              <div className="w-full text-center text-xs sm:text-sm text-blue-600 font-medium bg-blue-50 py-2 rounded-lg">
                Work in Progress - Submit to Client when done
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-9 text-xs sm:text-sm">
                    <AlertTriangle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Report Dispute / Client Refusing to Pay
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      Report a Dispute
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 pt-2">
                      <p>
                        This will flag the gig as <strong>Disputed</strong> on the blockchain. The funds will be locked until the Arbiter resolves it.
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleAction("dispute")}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Confirm Dispute (On-Chain)
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          
          {gig.status === "pending" && (
             <div className="w-full text-center text-xs sm:text-sm text-muted-foreground">
               Waiting for you to accept...
             </div>
          )}
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
      
      {gig.status === "disputed" && (
        <CardFooter className="pt-3 sm:pt-4">
          <div className="w-full text-center text-xs sm:text-sm text-orange-600 font-medium py-2 bg-orange-50 rounded-lg border border-orange-100">
            ⚠ Under Review by Mediator
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
