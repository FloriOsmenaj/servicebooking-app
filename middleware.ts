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

  // Get the user's session from the request cookie
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    // Redirect to the login page
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

// Define which routes are protected
function isProtectedRoute(pathname: string) {
  const protectedRoutes = ["/profile", "/booking"]
  return protectedRoutes.some((route) => pathname.startsWith(route))
}

export const config = {
  matcher: ["/profile/:path*", "/booking/:path*"],
}
