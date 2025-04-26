export type UserType = "client" | "business" | "admin"

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  phone: string | null
  user_type: UserType
  created_at: string
  updated_at: string
}

export interface Business {
  id: string
  owner_id: string
  name: string
  description: string | null
  category: string
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  rating: number | null
  review_count: number
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  business_id: string
  name: string
  description: string | null
  price: number
  duration: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  business_id: string
  booking_date: string
  booking_time: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  service?: Service
  business?: Business
  user?: Profile
}

export interface Review {
  id: string
  user_id: string
  business_id: string
  booking_id: string | null
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export interface BusinessHours {
  id: string
  business_id: string
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  time: string
  available: boolean
}
