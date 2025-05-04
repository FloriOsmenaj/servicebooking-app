"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/supabase-browser"

export default function BusinessSignupPage() {
  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { signUp } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const categories = [
    "Hair Salon",
    "Barber Shop",
    "Nail Salon",
    "Spa & Massage",
    "Beauty Salon",
    "Tattoo Studio",
    "Fitness",
    "Medical",
    "Other",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms of service and privacy policy.",
        variant: "destructive",
      })
      return
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a business category.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // 1. Create the user account with business user type
      const { data, error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        user_type: "business",
      })

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // 2. Create the business record
      if (data?.user) {
        const { error: businessError } = await supabase.from("businesses").insert([
          {
            owner_id: data.user.id,
            name: businessName,
            category: category,
            email: email,
            phone: phone || null,
          },
        ])

        if (businessError) {
          toast({
            title: "Business creation failed",
            description: businessError.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      toast({
        title: "Business account created",
        description: "Please check your email to confirm your account.",
      })

      router.push("/business/login")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center px-4 py-8 md:px-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="rounded-full bg-salon-100 p-3">
              <Building2 className="h-6 w-6 text-salon-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Register Your Business</CardTitle>
          <CardDescription className="text-center">
            Create a business account to offer your services on our platform
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                placeholder="Your Business Name"
                className="focus-visible:ring-salon-500"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Business Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="focus-visible:ring-salon-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Owner First Name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  className="focus-visible:ring-salon-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Owner Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  className="focus-visible:ring-salon-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="business@example.com"
                className="focus-visible:ring-salon-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Business Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                className="focus-visible:ring-salon-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="focus-visible:ring-salon-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                className="focus-visible:ring-salon-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="data-[state=checked]:bg-salon-600 data-[state=checked]:border-salon-600"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-salon-600 hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-salon-600 hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full bg-salon-600 hover:bg-salon-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering business...
                </>
              ) : (
                "Register Business"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Already have a business account?{" "}
            <Link href="/business/login" className="text-salon-600 hover:underline inline-flex items-center gap-1">
              Log in <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <Link href="/client/signup" className="text-booksy-600 hover:underline">
              Client Signup
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
