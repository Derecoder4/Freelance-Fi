"use client"

import type React from "react"

import { useState } from "react"
import { Briefcase, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CreateGigFormProps {
  onCreateGig: (freelancerAddress: string, description: string, amount: number) => void
}

export function CreateGigForm({ onCreateGig }: CreateGigFormProps) {
  const [freelancerAddress, setFreelancerAddress] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    freelancerAddress: "",
    description: "",
    amount: "",
  })

  const validateForm = () => {
    const newErrors = {
      freelancerAddress: "",
      description: "",
      amount: "",
    }

    if (!freelancerAddress) {
      newErrors.freelancerAddress = "Freelancer address is required"
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(freelancerAddress)) {
      newErrors.freelancerAddress = "Invalid Ethereum address format"
    }

    if (!description || description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0"
    }

    setErrors(newErrors)
    return !newErrors.freelancerAddress && !newErrors.description && !newErrors.amount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onCreateGig(freelancerAddress, description, Number.parseFloat(amount))

    // Reset form
    setFreelancerAddress("")
    setDescription("")
    setAmount("")
    setErrors({ freelancerAddress: "", description: "", amount: "" })
    setIsLoading(false)
  }

  const isFormValid = freelancerAddress && description && amount && Number.parseFloat(amount) > 0

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          Hire a Freelancer
        </CardTitle>
        <CardDescription>Create a new gig and deposit USDC into escrow</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="freelancer-address">Freelancer Address</Label>
            <Input
              id="freelancer-address"
              placeholder="0x..."
              value={freelancerAddress}
              onChange={(e) => {
                setFreelancerAddress(e.target.value)
                setErrors((prev) => ({ ...prev, freelancerAddress: "" }))
              }}
              className="font-mono text-sm"
              disabled={isLoading}
            />
            {errors.freelancerAddress && <p className="text-xs text-destructive">{errors.freelancerAddress}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="e.g., Fix my website's landing page"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setErrors((prev) => ({ ...prev, description: "" }))
              }}
              rows={4}
              disabled={isLoading}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="150"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setErrors((prev) => ({ ...prev, amount: "" }))
              }}
              min="0"
              step="0.01"
              disabled={isLoading}
            />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-[oklch(0.65_0.18_145)] text-[oklch(0.99_0_0)] hover:bg-[oklch(0.60_0.18_145)] disabled:opacity-50"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Gig...
              </>
            ) : (
              "Create & Deposit Funds"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
