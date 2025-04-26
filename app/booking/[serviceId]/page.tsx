"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Clock, CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"

export default function BookingPage({ params }: { params: { serviceId: string } }) {
  // In a real app, you would fetch the service data based on the serviceId
  const service = {
    id: params.serviceId,
    title: "Haircut & Styling",
    provider: "Style Studio",
    price: 45,
    duration: 60,
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  }

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [timeSlot, setTimeSlot] = useState<string | undefined>()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"

    if (!date) newErrors.date = "Please select a date"
    if (!timeSlot) newErrors.timeSlot = "Please select a time"

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Card number must be 16 digits"
    }

    if (!formData.expiry.trim()) {
      newErrors.expiry = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = "Expiry date must be in MM/YY format"
    }

    if (!formData.cvc.trim()) {
      newErrors.cvc = "CVC is required"
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = "CVC must be 3 or 4 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Successful booking
      toast({
        title: "Booking Confirmed!",
        description: `Your appointment has been booked for ${date?.toLocaleDateString()} at ${timeSlot}.`,
      })

      // In a real app, you would redirect to a confirmation page
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Link
        href={`/providers/style-studio`}
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
                Complete your booking for {service.title} at {service.provider}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">1. Select Date</h2>
                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                      }
                    />
                    {errors.date && <p className="text-sm text-red-500 mt-2">{errors.date}</p>}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">2. Select Time</h2>
                <Card>
                  <CardContent className="p-4">
                    <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <div key={time}>
                          <RadioGroupItem value={time} id={time} className="peer sr-only" />
                          <Label
                            htmlFor={time}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-booksy-600 [&:has([data-state=checked])]:border-booksy-600"
                          >
                            {time}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.timeSlot && <p className="text-sm text-red-500 mt-2">{errors.timeSlot}</p>}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">3. Your Information</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                          {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                          {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className={errors.phone ? "border-red-500" : ""}
                        />
                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="notes">Special Requests (Optional)</Label>
                        <textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-booksy-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Any special requests or notes for your appointment"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">4. Payment Information</h2>
                <Card>
                  <CardContent className="p-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="0000 0000 0000 0000"
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            value={formData.expiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={errors.expiry ? "border-red-500" : ""}
                          />
                          {errors.expiry && <p className="text-sm text-red-500">{errors.expiry}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            name="cvc"
                            value={formData.cvc}
                            onChange={handleInputChange}
                            placeholder="CVC"
                            className={errors.cvc ? "border-red-500" : ""}
                          />
                          {errors.cvc && <p className="text-sm text-red-500">{errors.cvc}</p>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button type="submit" className="w-full gap-2 bg-booksy-600 hover:bg-booksy-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
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
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  width={80}
                  height={80}
                  className="rounded-md object-cover"
                />
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.provider}</p>
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
                  <span>${service.price}</span>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
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
