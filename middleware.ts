import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  })

  try {
    // Get the user's session from the request cookie
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // If there's an auth error, redirect to appropriate login
    if (error) {
      console.error("Auth error in middleware:", error)

      // If it's a protected route, redirect to login
      if (isProtectedRoute(request.nextUrl.pathname)) {
        const loginRoute = getLoginRouteForPath(request.nextUrl.pathname)
        const redirectUrl = new URL(loginRoute, request.url)
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // For non-protected routes, just continue
      return NextResponse.next()
    }

    // If there's no session and the user is trying to access a protected route
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
      // Redirect to the appropriate login page
      const loginRoute = getLoginRouteForPath(request.nextUrl.pathname)
      const redirectUrl = new URL(loginRoute, request.url)
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is trying to access a route they don't have permission for
    if (session && !hasPermissionForRoute(request.nextUrl.pathname, session.user)) {
      // Redirect to the appropriate dashboard
      const dashboardRoute = getDashboardForUserType(session.user)
      return NextResponse.redirect(new URL(dashboardRoute, request.url))
    }

    return NextResponse.next()
  } catch (err) {
    console.error("Unexpected error in middleware:", err)

    // If it's a protected route, redirect to login
    if (isProtectedRoute(request.nextUrl.pathname)) {
      const loginRoute = getLoginRouteForPath(request.nextUrl.pathname)
      const redirectUrl = new URL(loginRoute, request.url)
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // For non-protected routes, just continue
    return NextResponse.next()
  }
}

// Define which routes are protected
function isProtectedRoute(pathname: string) {
  const protectedRoutes = ["/profile", "/booking", "/admin", "/business"]
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

// Get the appropriate login route based on the path
function getLoginRouteForPath(pathname: string) {
  if (pathname.startsWith("/admin")) {
    return "/admin/login"
  } else if (pathname.startsWith("/business")) {
    return "/business/login"
  } else {
    return "/client/login"
  }
}

// Check if user has permission for a route
function hasPermissionForRoute(pathname: string, user: any) {
  // Get user type from metadata
  const userType = user.user_metadata?.user_type || "client"

  // Admin routes require admin user type
  if (pathname.startsWith("/admin") && userType !== "admin") {
    return false
  }

  // Business routes require business user type
  if (pathname.startsWith("/business") && userType !== "business") {
    return false
  }

  return true
}

// Get the appropriate dashboard for user type
function getDashboardForUserType(user: any) {
  const userType = user.user_metadata?.user_type || "client"

  if (userType === "admin") {
    return "/admin"
  } else if (userType === "business") {
    return "/business/dashboard"
  } else {
    return "/profile"
  }
}

export const config = {
  matcher: ["/profile/:path*", "/booking/:path*", "/admin/:path*", "/business/:path*"],
}
