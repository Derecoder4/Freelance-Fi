"use client"

import { useEffect } from "react"
import { useGig } from "@/hooks/use-gigs"
import { GigCard } from "@/components/gig-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks, Briefcase, Users, Loader2 } from "lucide-react"
import type { Gig } from "@/components/dashboard"

interface GigsListProps {
  gigIds: number[]
  walletAddress: string
  onReleaseFunds: (gigId: number) => void
  onRefund: (gigId: number) => void
  onAcceptGig: (gigId: number) => void
  onDisputeGig: (gigId: number) => void
  searchTerm?: string
  statusFilter?: string
}

// Component to fetch and display a single gig
function GigItem({ 
  gigId, 
  walletAddress, 
  onReleaseFunds, 
  onRefund,
  onAcceptGig,
  onDisputeGig,
  searchTerm = "",
  statusFilter = "all"
}: { 
  gigId: number
  walletAddress: string
  onReleaseFunds: (gigId: number) => void
  onRefund: (gigId: number) => void
  onAcceptGig: (gigId: number) => void
  onDisputeGig: (gigId: number) => void
  searchTerm?: string
  statusFilter?: string
}) {
  const { gig, isLoading, isError } = useGig(gigId)

  if (isLoading) {
    return (
      <Card className="border-2 w-full rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading gig #{gigId}...</span>
        </CardContent>
      </Card>
    )
  }

  if (isError || !gig) {
    return (
      <Card className="border-2 border-destructive/50 w-full rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg">
        <CardContent className="py-6 text-center text-sm text-destructive">
          Failed to load gig #{gigId}
        </CardContent>
      </Card>
    )
  }

  // Filtering Logic
  const matchesSearch = 
    gig.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    gig.id.toString().includes(searchTerm)
  
  const matchesStatus = 
    statusFilter === "all" || 
    gig.status === statusFilter

  if (!matchesSearch || !matchesStatus) {
    return null
  }

  return (
    <GigCard
      gig={gig}
      walletAddress={walletAddress}
      onReleaseFunds={onReleaseFunds}
      onRefund={onRefund}
      onAcceptGig={onAcceptGig}
      onDisputeGig={onDisputeGig}
    />
  )
}

export function GigsList({ 
  gigIds, 
  walletAddress, 
  onReleaseFunds, 
  onRefund,
  onAcceptGig,
  onDisputeGig,
  searchTerm = "",
  statusFilter = "all"
}: GigsListProps) {
  // We need to fetch all gigs to filter them by client/freelancer
  // For now, we'll render all and let the tabs filter visually
  
  const renderGigsList = (filteredIds: number[], emptyMessage: string) => (
    <div className="space-y-3 sm:space-y-4">
      {filteredIds.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <p className="text-sm sm:text-base">{emptyMessage}</p>
        </div>
      ) : (
        filteredIds.map((gigId) => (
          <GigItem
            key={gigId}
            gigId={gigId}
            walletAddress={walletAddress}
            onReleaseFunds={onReleaseFunds}
            onRefund={onRefund}
            onAcceptGig={onAcceptGig}
            onDisputeGig={onDisputeGig}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        ))
      )}
    </div>
  )

  // Note: For proper filtering by client/freelancer, we'd need to fetch all gigs first
  // This is a simplified version that shows all gigs in each tab
  // To implement proper filtering, consider using a parent component that fetches all gigs

  return (
    <Card className="w-full rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg border-2">
      <CardHeader className="space-y-1 sm:space-y-1.5">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <ListChecks className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          Your Gigs
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Manage your active and completed freelance contracts
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 sm:mb-4 h-auto">
            <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <ListChecks className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span>All</span>
              <span className="text-[10px] sm:text-xs">({gigIds.length})</span>
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="hidden xs:inline">Client</span>
              <span className="xs:hidden">C</span>
            </TabsTrigger>
            <TabsTrigger value="freelancer" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="hidden xs:inline">Freelancer</span>
              <span className="xs:hidden">F</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {renderGigsList(gigIds, "No gigs yet. Create your first gig to get started!")}
          </TabsContent>

          <TabsContent value="client" className="mt-0">
            {renderGigsList(gigIds, "You haven't hired any freelancers yet.")}
          </TabsContent>

          <TabsContent value="freelancer" className="mt-0">
            {renderGigsList(gigIds, "You don't have any freelance work yet.")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
