"use client"

import { useEffect, useState } from "react"
import { useGigs, useGig } from "@/hooks/use-gigs"
import { useWriteContract, useAccount } from "wagmi"
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constants"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Gavel, CheckCircle, XCircle, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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

// Component to display a single disputed gig for the admin
function DisputeCard({ gigId, onResolve }: { gigId: number, onResolve: () => void }) {
  const { gig, isLoading } = useGig(gigId)
  const { writeContract, isPending } = useWriteContract()
  const { toast } = useToast()

  if (isLoading) return <div className="py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
  if (!gig || !gig.isDisputed) return null

  const handleResolve = (winner: "client" | "freelancer") => {
    try {
      const winnerAddress = winner === "client" ? gig.client : gig.freelancer
      
      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: "resolveDispute",
        args: [BigInt(gig.id), winnerAddress],
      }, {
        onSuccess: () => {
          toast({
            title: "Dispute Resolved",
            description: `Funds awarded to ${winner}. Service fee collected.`,
          })
          onResolve()
        },
        onError: (error) => {
          console.error("Resolution error:", error)
          toast({
            title: "Error",
            description: "Failed to resolve dispute. Check console.",
            variant: "destructive",
          })
        }
      })
    } catch (error) {
      console.error("Resolution error:", error)
    }
  }

  return (
    <Card className="border-2 border-orange-200 bg-orange-50/30 dark:bg-orange-950/10">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Dispute #{gig.id}
            </CardTitle>
            <CardDescription>Value: {gig.amount} USDC</CardDescription>
          </div>
          <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-100">
            Action Required
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background/50 p-4 rounded-lg border">
          <h4 className="font-semibold mb-2 text-sm">Gig Description</h4>
          <p className="text-sm text-muted-foreground">{gig.description}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900">
            <span className="font-semibold text-blue-700 dark:text-blue-300 block mb-1">Client</span>
            <code className="text-xs break-all">{gig.client}</code>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-100 dark:border-purple-900">
            <span className="font-semibold text-purple-700 dark:text-purple-300 block mb-1">Freelancer</span>
            <code className="text-xs break-all">{gig.freelancer}</code>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Rule for Client (Refund)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rule in favor of Client?</AlertDialogTitle>
              <AlertDialogDescription>
                This will refund {gig.amount} USDC to the client (minus service fee). The freelancer will receive nothing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleResolve("client")}>Confirm Refund</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isPending}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Rule for Freelancer (Pay)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rule in favor of Freelancer?</AlertDialogTitle>
              <AlertDialogDescription>
                This will release {gig.amount} USDC to the freelancer (minus service fee).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleResolve("freelancer")}>Confirm Payment</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}

export default function AdminDashboard() {
  const { gigIds, isLoading } = useGigs()
  const { address } = useAccount()
  
  // In a real app, we'd check if 'address' matches the 'arbiter' from the contract
  // For this demo, we'll assume the user knows what they are doing if they visit /admin

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          Mediator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Review and resolve disputed gigs. You earn a 1% service fee on every resolution.
        </p>
      </div>

      <Alert className="mb-8 bg-primary/5 border-primary/20">
        <Gavel className="h-4 w-4 text-primary" />
        <AlertTitle>Arbiter Mode</AlertTitle>
        <AlertDescription>
          You are viewing the admin interface. Only the designated Arbiter address can successfully execute these transactions.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Active Disputes
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6">
            {gigIds.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No gigs found on the platform.</p>
            ) : (
              gigIds.map(id => (
                <DisputeCard key={id} gigId={id} onResolve={() => {}} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
