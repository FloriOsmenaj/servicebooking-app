"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, User, Calendar, LogOut, Clock, MapPin, Building, X, Check, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/supabase-browser"
import { getUserBookings, updateBookingStatus } from "@/app/actions/booking"
import type { Booking } from "@/types"

export default function ProfilePage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams?.get("tab") || "profile"

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

    // Load bookings
    fetchBookings()
  }, [user, router])

  const fetchBookings = async () => {
    if (!user) return

    setIsLoadingBookings(true)
    try {
      const result = await getUserBookings()
      if (result.success) {
        setBookings(result.bookings)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load bookings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive",
      })
    } finally {
      setIsLoadingBookings(false)
    }
  }

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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const result = await updateBookingStatus(bookingId, "cancelled")

      if (result.success) {
        toast({
          title: "Booking cancelled",
          description: "Your booking has been cancelled successfully.",
        })
        fetchBookings()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to cancel booking",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel your booking",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Confirmed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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

        <Tabs defaultValue={defaultTab} className="w-full">
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
                {isLoadingBookings ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-booksy-600" />
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className="p-4 md:w-2/3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg">{booking.service?.name}</h3>
                                  <p className="text-sm text-muted-foreground">{booking.business?.name}</p>

                                  <div className="flex flex-col gap-1 mt-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar className="h-4 w-4 text-booksy-500" />
                                      <span>
                                        {new Date(booking.booking_date).toLocaleDateString()} at{" "}
                                        {booking.booking_time.substring(0, 5)}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock className="h-4 w-4 text-booksy-500" />
                                      <span>{booking.service?.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building className="h-4 w-4 text-booksy-500" />
                                      <span>{booking.business?.category}</span>
                                    </div>
                                    {booking.business?.address && (
                                      <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-booksy-500" />
                                        <span>{booking.business.address}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  {getStatusBadge(booking.status)}
                                  <span className="text-sm font-medium">${booking.service?.price.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-muted p-4 md:w-1/3 flex flex-col justify-between">
                              <div>
                                <h4 className="font-medium text-sm">Booking Status</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {booking.status === "pending" && (
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  )}
                                  {booking.status === "confirmed" && <Check className="h-4 w-4 text-green-500" />}
                                  {booking.status === "cancelled" && <X className="h-4 w-4 text-red-500" />}
                                  <span className="text-sm">
                                    {booking.status === "pending" && "Awaiting confirmation"}
                                    {booking.status === "confirmed" && "Appointment confirmed"}
                                    {booking.status === "cancelled" && "Appointment cancelled"}
                                    {booking.status === "completed" && "Appointment completed"}
                                  </span>
                                </div>
                              </div>

                              {(booking.status === "pending" || booking.status === "confirmed") && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="mt-4"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Cancel Booking
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md bg-muted p-8 text-center">
                    <h3 className="text-lg font-medium">No appointments yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You haven't booked any appointments yet. Browse services to book your first appointment.
                    </p>
                    <Button className="mt-4 bg-booksy-600 hover:bg-booksy-700" onClick={() => router.push("/")}>
                      Browse services
                    </Button>
                  </div>
                )}
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
