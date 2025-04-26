import Link from "next/link"
import { format } from "date-fns"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminBusinessesPage() {
  const supabase = getSupabaseServerClientWithCookies()

  // Fetch businesses with owner info
  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("*, profiles:owner_id(first_name, last_name)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching businesses:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Businesses</h1>
        <Button className="bg-booksy-600 hover:bg-booksy-700">Add Business</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses?.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{business.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {business.profiles?.first_name} {business.profiles?.last_name}
                  </TableCell>
                  <TableCell>{business.rating ? `${business.rating}/5` : "No ratings"}</TableCell>
                  <TableCell>{format(new Date(business.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Link href={`/admin/businesses/${business.id}`}>
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
