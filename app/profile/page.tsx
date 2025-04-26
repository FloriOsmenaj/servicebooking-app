"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User, Calendar, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load user data
    if (user.user_metadata) {
      setFirstName(user.user_metadata.first_name || "")
      setLastName(user.user_metadata.last_name || "")
    }
    setEmail(user.email || "")
  }, [user, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      })

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="container flex h-screen items-center justify-center px-4 py-8 md:px-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <CardDescription>Loading your profile information...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-booksy-600" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-booksy-600 data-[state=active]:text-white">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-booksy-600 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-booksy-600 data-[state=active]:text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information here.</CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="John"
                        className="focus-visible:ring-booksy-500"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Doe"
                        className="focus-visible:ring-booksy-500"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      className="focus-visible:ring-booksy-500 bg-muted"
                      value={email}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-booksy-600 hover:bg-booksy-700" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your upcoming and past appointments.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-8 text-center">
                  <h3 className="text-lg font-medium">No appointments yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't booked any appointments yet. Browse services to book your first appointment.
                  </p>
                  <Button className="mt-4 bg-booksy-600 hover:bg-booksy-700" onClick={() => router.push("/")}>
                    Browse services
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your password to keep your account secure.
                  </p>
                  <Button
                    variant="outline"
                    className="border-booksy-600 text-booksy-600 hover:bg-booksy-50"
                    onClick={() => router.push("/forgot-password")}
                  >
                    Change password
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" onClick={handleLogout}>
                    Log out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
