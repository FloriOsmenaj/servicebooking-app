"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import type { UserType } from "@/types"

export async function updateUserRole(userId: string, userType: UserType) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to perform this action",
    }
  }

  // Check if the current user is an admin
  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", session.user.id)
    .single()

  if (!currentUserProfile || currentUserProfile.user_type !== "admin") {
    return {
      success: false,
      message: "You don't have permission to perform this action",
    }
  }

  // Update the user's role
  const { error } = await supabase
    .from("profiles")
    .update({ user_type: userType, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      message: error.message,
    }
  }

  // Revalidate the users page
  revalidatePath("/admin/users")

  return {
    success: true,
    message: `User role updated to ${userType} successfully`,
  }
}

export async function makeUserAdmin(email: string) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      success: false,
      message: "You must be logged in to perform this action",
    }
  }

  // Find the user by email
  const { data: user, error: userError } = await supabase.auth.admin.getUserByEmail(email)

  if (userError || !user) {
    return {
      success: false,
      message: userError?.message || "User not found",
    }
  }

  // Update the user's role
  const { error } = await supabase
    .from("profiles")
    .update({ user_type: "admin", updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (error) {
    console.error("Error updating user role:", error)
    return {
      success: false,
      message: error.message,
    }
  }

  return {
    success: true,
    message: `User ${email} has been made an admin`,
  }
}
