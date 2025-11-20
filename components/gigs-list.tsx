"use client"
import { GigCard } from "@/components/gig-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks, Briefcase, Users } from "lucide-react"
import type { Gig } from "@/components/dashboard"

interface GigsListProps {
  gigs: Gig[]
  walletAddress: string
  onReleaseFunds: (gigId: number) => void
  onRefund: (gigId: number) => void
}

export function GigsList({ gigs, walletAddress, onReleaseFunds, onRefund }: GigsListProps) {
  const clientGigs = gigs.filter((gig) => gig.client.toLowerCase() === walletAddress.toLowerCase())
  const freelancerGigs = gigs.filter((gig) => gig.freelancer.toLowerCase() === walletAddress.toLowerCase())

  const renderGigsList = (filteredGigs: Gig[], emptyMessage: string) => (
    <div className="space-y-3 sm:space-y-4">
      {filteredGigs.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-muted-foreground">
          <p className="text-sm sm:text-base">{emptyMessage}</p>
        </div>
      ) : (
        filteredGigs.map((gig) => (
          <GigCard
            key={gig.id}
            gig={gig}
            walletAddress={walletAddress}
            onReleaseFunds={onReleaseFunds}
            onRefund={onRefund}
          />
        ))
      )}
    </div>
  )

  return (
    <Card className="w-full">
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
              <span className="text-[10px] sm:text-xs">({gigs.length})</span>
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="hidden xs:inline">Client</span>
              <span className="xs:hidden">C</span>
              <span className="text-[10px] sm:text-xs">({clientGigs.length})</span>
            </TabsTrigger>
            <TabsTrigger value="freelancer" className="flex items-center gap-1 text-xs sm:text-sm px-2 py-2">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="hidden xs:inline">Freelancer</span>
              <span className="xs:hidden">F</span>
              <span className="text-[10px] sm:text-xs">({freelancerGigs.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {renderGigsList(gigs, "No gigs yet. Create your first gig to get started!")}
          </TabsContent>

          <TabsContent value="client" className="mt-0">
            {renderGigsList(clientGigs, "You haven't hired any freelancers yet.")}
          </TabsContent>

          <TabsContent value="freelancer" className="mt-0">
            {renderGigsList(freelancerGigs, "You don't have any freelance work yet.")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
