"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Building2, Calendar, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Businesses",
      href: "/admin/businesses",
      icon: Building2,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: Calendar,
    },
  ]

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <div className="mb-8">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-booksy-400 to-salon-400 bg-clip-text text-transparent">
            Booksy Admin
          </span>
        </Link>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : isActive(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  active ? "bg-booksy-700 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  )
}
