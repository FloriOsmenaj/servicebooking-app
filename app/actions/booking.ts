"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import type { Booking } from "@/types"

export async function createBooking(formData: FormData) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to book an appointment",
    }
  }

  const serviceId = formData.get("serviceId") as string
  const businessId = formData.get("businessId") as string
  const bookingDate = formData.get("bookingDate") as string
  const bookingTime = formData.get("bookingTime") as string
  const notes = formData.get("notes") as string

  if (!serviceId || !businessId || !bookingDate || !bookingTime) {
    return {
      success: false,
      message: "Missing required booking information",
    }
  }

  // Create the booking
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: session.user.id,
      service_id: serviceId,
      business_id: businessId,
      booking_date: bookingDate,
      booking_time: bookingTime,
      notes: notes || null,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Booking error:", error)
    return {
      success: false,
      message: error.message,
    }
  }

  // Revalidate the bookings page
  revalidatePath("/profile")

  return {
    success: true,
    message: "Booking created successfully",
    booking: data as Booking,
  }
}

export async function getAvailableTimeSlots(businessId: string, serviceId: string, date: string) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get business hours for the day
  const dayOfWeek = new Date(date).getDay() // 0 = Sunday, 6 = Saturday

  const { data: businessHours, error: hoursError } = await supabase
    .from("business_hours")
    .select("*")
    .eq("business_id", businessId)
    .eq("day_of_week", dayOfWeek)
    .single()

  if (hoursError || !businessHours || businessHours.is_closed) {
    return {
      success: false,
      message: "Business is closed on this day",
      timeSlots: [],
    }
  }

  // Get service duration
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration")
    .eq("id", serviceId)
    .single()

  if (serviceError || !service) {
    return {
      success: false,
      message: "Service not found",
      timeSlots: [],
    }
  }

  // Get existing bookings for the day
  const { data: existingBookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("booking_time, services(duration)")
    .eq("business_id", businessId)
    .eq("booking_date", date)
    .neq("status", "cancelled")

  if (bookingsError) {
    return {
      success: false,
      message: "Error fetching existing bookings",
      timeSlots: [],
    }
  }

  // Generate time slots
  const openTime = businessHours.open_time
    ? new Date(`1970-01-01T${businessHours.open_time}Z`)
    : new Date(`1970-01-01T09:00:00Z`)
  const closeTime = businessHours.close_time
    ? new Date(`1970-01-01T${businessHours.close_time}Z`)
    : new Date(`1970-01-01T17:00:00Z`)

  const serviceDuration = service.duration // in minutes
  const timeSlotInterval = 30 // minutes between slots

  const timeSlots = []
  let currentTime = new Date(openTime)

  while (currentTime < closeTime) {
    const timeString = currentTime.toISOString().substring(11, 16) // HH:MM format

    // Check if this time slot overlaps with any existing booking
    const isAvailable = !existingBookings.some((booking) => {
      const bookingTime = new Date(`1970-01-01T${booking.booking_time}Z`)
      const bookingEndTime = new Date(bookingTime.getTime() + (booking.services?.duration || 60) * 60000)

      const slotTime = new Date(`1970-01-01T${timeString}Z`)
      const slotEndTime = new Date(slotTime.getTime() + serviceDuration * 60000)

      // Check for overlap
      return (
        (slotTime >= bookingTime && slotTime < bookingEndTime) ||
        (slotEndTime > bookingTime && slotEndTime <= bookingEndTime) ||
        (slotTime <= bookingTime && slotEndTime >= bookingEndTime)
      )
    })

    timeSlots.push({
      time: timeString,
      available: isAvailable,
    })

    // Move to next slot
    currentTime = new Date(currentTime.getTime() + timeSlotInterval * 60000)
  }

  return {
    success: true,
    timeSlots,
  }
}

export async function getUserBookings() {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to view bookings",
      bookings: [],
    }
  }

  // Get user bookings with service and business details
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services(*),
      businesses(id, name, logo_url, category)
    `)
    .eq("user_id", session.user.id)
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return {
      success: false,
      message: error.message,
      bookings: [],
    }
  }

  return {
    success: true,
    bookings: data as Booking[],
  }
}

export async function getBusinessBookings(businessId: string) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to view bookings",
      bookings: [],
    }
  }

  // Verify the user owns this business or is an admin
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  const { data: business } = await supabase.from("businesses").select("owner_id").eq("id", businessId).single()

  if (!profile || (profile.user_type !== "admin" && (!business || business.owner_id !== session.user.id))) {
    return {
      success: false,
      message: "You don't have permission to view these bookings",
      bookings: [],
    }
  }

  // Get business bookings with service and user details
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services(*),
      profiles:user_id(id, first_name, last_name, avatar_url, phone)
    `)
    .eq("business_id", businessId)
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return {
      success: false,
      message: error.message,
      bookings: [],
    }
  }

  return {
    success: true,
    bookings: data as Booking[],
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed",
) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to update a booking",
    }
  }

  // Get the booking
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("business_id, user_id")
    .eq("id", bookingId)
    .single()

  if (bookingError || !booking) {
    return {
      success: false,
      message: "Booking not found",
    }
  }

  // Verify the user owns this business, is the booking user, or is an admin
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  const { data: business } = await supabase.from("businesses").select("owner_id").eq("id", booking.business_id).single()

  const isAdmin = profile?.user_type === "admin"
  const isBusinessOwner = business?.owner_id === session.user.id
  const isBookingUser = booking.user_id === session.user.id

  // Clients can only cancel their own bookings
  if (!isAdmin && !isBusinessOwner && !(isBookingUser && status === "cancelled")) {
    return {
      success: false,
      message: "You don't have permission to update this booking",
    }
  }

  // Update the booking status
  const { error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId)

  if (error) {
    console.error("Error updating booking:", error)
    return {
      success: false,
      message: error.message,
    }
  }

  // Revalidate the bookings pages
  revalidatePath("/profile")
  revalidatePath("/business/bookings")
  revalidatePath("/admin/bookings")

  return {
    success: true,
    message: `Booking ${status} successfully`,
  }
}
