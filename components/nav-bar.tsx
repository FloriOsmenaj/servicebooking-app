"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-booksy-600 to-salon-600 bg-clip-text text-transparent">
            Booksy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-6 md:flex">
          <Link
            href="/categories"
            className={`text-sm font-medium transition-colors hover:text-booksy-600 ${
              pathname?.startsWith("/categories") ? "text-booksy-600" : ""
            }`}
          >
            Explore
          </Link>
          <Link
            href="/providers"
            className={`text-sm font-medium transition-colors hover:text-booksy-600 ${
              pathname?.startsWith("/providers") ? "text-booksy-600" : ""
            }`}
          >
            Providers
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-booksy-600 ${
              pathname === "/about" ? "text-booksy-600" : ""
            }`}
          >
            About
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:text-booksy-600">
                  <User className="h-4 w-4" />
                  {user.user_metadata?.first_name || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile?tab=appointments">My Appointments</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hover:text-booksy-600">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-booksy-600 hover:bg-booksy-700">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 px-4 space-y-4">
            <Link
              href="/categories"
              className={`block py-2 text-sm font-medium ${
                pathname?.startsWith("/categories") ? "text-booksy-600" : ""
              }`}
              onClick={toggleMenu}
            >
              Explore
            </Link>
            <Link
              href="/providers"
              className={`block py-2 text-sm font-medium ${
                pathname?.startsWith("/providers") ? "text-booksy-600" : ""
              }`}
              onClick={toggleMenu}
            >
              Providers
            </Link>
            <Link
              href="/about"
              className={`block py-2 text-sm font-medium ${pathname === "/about" ? "text-booksy-600" : ""}`}
              onClick={toggleMenu}
            >
              About
            </Link>

            {user && (
              <>
                <div className="h-px bg-border my-2"></div>
                <Link href="/profile" className="block py-2 text-sm font-medium" onClick={toggleMenu}>
                  Profile
                </Link>
                <Link href="/profile?tab=appointments" className="block py-2 text-sm font-medium" onClick={toggleMenu}>
                  My Appointments
                </Link>
                <button
                  className="block py-2 text-sm font-medium text-red-600 w-full text-left"
                  onClick={() => {
                    signOut()
                    toggleMenu()
                  }}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
