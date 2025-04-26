import Link from "next/link"
import { format } from "date-fns"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminBookingsPage() {
  const supabase = getSupabaseServerClientWithCookies()

  // Fetch bookings with related info
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      services(name, price),
      businesses(name),
      profiles:user_id(first_name, last_name)
    `)
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.services?.name}</TableCell>
                  <TableCell>{booking.businesses?.name}</TableCell>
                  <TableCell>
                    {booking.profiles?.first_name} {booking.profiles?.last_name}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.booking_date), "MMM d, yyyy")} at {booking.booking_time.substring(0, 5)}
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/bookings/${booking.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
