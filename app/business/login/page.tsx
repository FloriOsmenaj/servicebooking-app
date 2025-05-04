"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Loader2, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"

export default function BusinessLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { signIn, signOut, userType } = useAuth() // Moved useAuth here to prevent conditional hook call
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirectTo") || "/business/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Check if the user is a business
      // const { user, userType } = useAuth() // Removed this line as userType is already destructured above

      if (userType !== "business") {
        toast({
          title: "Access denied",
          description: "This login is only for business accounts. Please use the client login.",
          variant: "destructive",
        })
        // Sign out the user
        await signOut()
        setIsLoading(false)
        return
      }

      toast({
        title: "Login successful",
        description: "Welcome to your business dashboard!",
      })

      router.push(redirectTo)
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center px-4 py-8 md:px-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <div className="rounded-full bg-salon-100 p-3">
              <Building2 className="h-6 w-6 text-salon-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Business Login</CardTitle>
          <CardDescription className="text-center">
            Access your business dashboard to manage appointments and services
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/business/forgot-password" className="text-sm text-salon-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                className="focus-visible:ring-salon-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-salon-600 hover:bg-salon-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in to Dashboard"
              )}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Don't have a business account?{" "}
            <Link href="/business/signup" className="text-salon-600 hover:underline inline-flex items-center gap-1">
              Register your business <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            <Link href="/client/login" className="text-booksy-600 hover:underline">
              Client Login
            </Link>
            {" • "}
            <Link href="/admin/login" className="text-purple-600 hover:underline">
              Admin Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
