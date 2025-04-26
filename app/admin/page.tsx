import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import { MakeAdminForm } from "@/components/admin/make-admin-form"

export default async function AdminDashboard() {
  const supabase = getSupabaseServerClientWithCookies()

  // Fetch counts for dashboard
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: businessesCount } = await supabase.from("businesses").select("*", { count: "exact", head: true })
  const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: "exact", head: true })
  const { count: servicesCount } = await supabase.from("services").select("*", { count: "exact", head: true })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-4xl">{usersCount || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Registered users on the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Businesses</CardDescription>
            <CardTitle className="text-4xl">{businessesCount || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active service providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Services</CardDescription>
            <CardTitle className="text-4xl">{servicesCount || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Available services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bookings</CardDescription>
            <CardTitle className="text-4xl">{bookingsCount || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total appointments booked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MakeAdminForm />
      </div>
    </div>
  )
}
