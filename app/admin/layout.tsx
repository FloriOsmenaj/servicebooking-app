import type React from "react"
import { redirect } from "next/navigation"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerClientWithCookies()

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Check if user is an admin
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", session.user.id).single()

  if (!profile || profile.user_type !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
