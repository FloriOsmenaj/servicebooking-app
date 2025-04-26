"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Clock, Loader2, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { createBooking, getAvailableTimeSlots } from "@/app/actions/booking"
import type { Service, Business, TimeSlot } from "@/types"
import { getSupabaseBrowserClient } from "@/lib/supabase/supabase-browser"

export default function BookingPage({ params }: { params: { serviceId: string } }) {
  const [service, setService] = useState<Service | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [timeSlot, setTimeSlot] = useState<string | undefined>()
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchServiceDetails = async () => {
      setIsLoading(true)
      try {
        // Fetch service details
        const { data: serviceData, error: serviceError } = await supabase
          .from("services")
          .select("*")
          .eq("id", params.serviceId)
          .single()

        if (serviceError || !serviceData) {
          toast({
            title: "Error",
            description: "Service not found",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setService(serviceData as Service)

        // Fetch business details
        const { data: businessData, error: businessError } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", serviceData.business_id)
          .single()

        if (businessError || !businessData) {
          toast({
            title: "Error",
            description: "Business not found",
            variant: "destructive",
          })
          router.push("/")
          return
        }

        setBusiness(businessData as Business)

        // Fetch available time slots
        if (date) {
          fetchTimeSlots(serviceData.business_id, params.serviceId, date)
        }
      } catch (error) {
        console.error("Error fetching service details:", error)
        toast({
          title: "Error",
          description: "Failed to load service details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServiceDetails()
  }, [params.serviceId, router, supabase, toast])

  const fetchTimeSlots = async (businessId: string, serviceId: string, selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]
      const result = await getAvailableTimeSlots(businessId, serviceId, formattedDate)

      if (result.success) {
        setTimeSlots(result.timeSlots)
        setTimeSlot(undefined) // Reset selected time slot
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to load time slots",
          variant: "destructive",
        })
        setTimeSlots([])
      }
    } catch (error) {
      console.error("Error fetching time slots:", error)
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive",
      })
      setTimeSlots([])
    }
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && business && service) {
      setDate(newDate)
      fetchTimeSlots(business.id, service.id, newDate)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to book an appointment",
        variant: "destructive",
      })
      router.push(`/login?redirect=/booking/${params.serviceId}`)
      return
    }

    if (!service || !business || !date || !timeSlot) {
      toast({
        title: "Missing information",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("serviceId", service.id)
      formData.append("businessId", business.id)
      formData.append("bookingDate", date.toISOString().split("T")[0])
      formData.append("bookingTime", timeSlot)
      formData.append("notes", notes)

      const result = await createBooking(formData)

      if (result.success) {
        toast({
          title: "Booking Confirmed!",
          description: `Your appointment has been booked for ${date.toLocaleDateString()} at ${timeSlot}.`,
        })
        router.push("/profile?tab=appointments")
      } else {
        toast({
          title: "Booking Failed",
          description: result.message || "There was an error processing your booking. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !service || !business) {
    return (
      <div className="container flex h-screen items-center justify-center px-4 py-8 md:px-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Loading</CardTitle>
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
      <Link
        href={`/providers/${business.id}`}
        className="inline-flex items-center gap-1 text-sm font-medium mb-6 text-booksy-600 hover:text-booksy-700"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to provider
      </Link>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Book Appointment</h1>
              <p className="text-muted-foreground mt-2">
                Complete your booking for {service.name} at {business.name}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">1. Select Date</h2>
                <Card>
                  <CardContent className="p-4">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      className="rounded-md border"
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                      }
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">2. Select Time</h2>
                <Card>
                  <CardContent className="p-4">
                    {timeSlots.length > 0 ? (
                      <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <div key={slot.time}>
                            <RadioGroupItem
                              value={slot.time}
                              id={slot.time}
                              className="peer sr-only"
                              disabled={!slot.available}
                            />
                            <Label
                              htmlFor={slot.time}
                              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-booksy-600 [&:has([data-state=checked])]:border-booksy-600 ${
                                !slot.available ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {slot.time}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No available time slots for this date</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">3. Additional Information</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Special Requests (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booksy-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Any special requests or notes for your appointment"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 bg-booksy-600 hover:bg-booksy-700"
                disabled={isSubmitting || !timeSlot}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Complete Booking
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div>
          <Card className="sticky top-24 shadow-md">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={service.image_url || "/placeholder.svg?height=80&width=80"}
                  alt={service.name}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{business.name}</p>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Clock className="h-4 w-4 text-booksy-500" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Date</span>
                  <span className="font-medium">{date ? date.toLocaleDateString() : "Not selected"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time</span>
                  <span className="font-medium">{timeSlot || "Not selected"}</span>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Service Price</span>
                  <span>${service.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>${(service.price * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-booksy-700">${(service.price * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-0">
              <Button
                className="w-full gap-2 bg-booksy-600 hover:bg-booksy-700"
                onClick={handleSubmit}
                disabled={isSubmitting || !timeSlot}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Complete Booking
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
