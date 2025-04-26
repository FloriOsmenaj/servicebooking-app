import Link from "next/link"
import { format } from "date-fns"
import { getSupabaseServerClientWithCookies } from "@/lib/supabase/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AdminUsersPage() {
  const supabase = getSupabaseServerClientWithCookies()

  // Fetch users with their profiles
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*, auth_users:id(email)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button className="bg-booksy-600 hover:bg-booksy-700">Add User</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.auth_users?.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.user_type === "admin"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : user.user_type === "business"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {user.user_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(user.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Link href={`/admin/users/${user.id}`}>
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
