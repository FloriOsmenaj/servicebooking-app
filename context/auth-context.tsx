"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/supabase-browser"
import type { Profile, UserType } from "@/types"

type AuthContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  userType: UserType | null
  isAdmin: boolean
  isBusiness: boolean
  isClient: boolean
  signUp: (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; user_type?: UserType },
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: any | null
    data: any | null
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: any | null
    data: any | null
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<UserType | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // Helper function to determine user type from profile or metadata
  const determineUserType = (profileData: any, userData: User | null): UserType => {
    // First check if profile has user_type
    if (profileData && profileData.user_type) {
      return profileData.user_type as UserType
    }

    // Then check if profile has type (alternative column name)
    if (profileData && profileData.type) {
      return profileData.type as UserType
    }

    // Fall back to user metadata if available
    if (userData && userData.user_metadata && userData.user_metadata.user_type) {
      return userData.user_metadata.user_type as UserType
    }

    // Default to client if nothing else is available
    return "client"
  }

  // Helper function to fetch profile safely
  const fetchProfile = async (userId: string) => {
    try {
      // Fetch the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (profileError) {
        console.error("Profile fetch error:", profileError)
        return null
      }

      return profileData
    } catch (err) {
      console.error("Error in fetchProfile:", err)
      return null
    }
  }

  // Helper function to create a profile safely
  const createProfile = async (userId: string, userData: User) => {
    try {
      // Create a base profile with minimal fields to avoid schema issues
      const profileData: any = {
        id: userId,
      }

      // Add user metadata if available
      if (userData.user_metadata) {
        if (userData.user_metadata.first_name) {
          profileData.first_name = userData.user_metadata.first_name
        }

        if (userData.user_metadata.last_name) {
          profileData.last_name = userData.user_metadata.last_name
        }

        // Try both column names for user type
        try {
          profileData.user_type = userData.user_metadata.user_type || "client"
        } catch (e) {
          // If user_type column doesn't exist, try type
          try {
            profileData.type = userData.user_metadata.user_type || "client"
          } catch (e) {
            // If neither column exists, just continue
            console.log("Neither user_type nor type column exists in profiles table")
          }
        }
      }

      // Insert the profile
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert([profileData])
        .select()
        .single()

      if (createError) {
        console.error("Error creating profile:", createError)
        return null
      }

      return newProfile
    } catch (err) {
      console.error("Error in createProfile:", err)
      return null
    }
  }

  // Helper function to handle auth errors
  const handleAuthError = async (error: any) => {
    console.error("Auth error:", error)

    // Check if it's a refresh token error
    if (error.code === "refresh_token_not_found" || error.message?.includes("refresh token")) {
      console.log("Refresh token error detected, signing out")

      // Clear the session state
      setUser(null)
      setSession(null)
      setProfile(null)
      setUserType(null)

      // Sign out to clear any invalid tokens
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError)
      }
    }
  }

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          await handleAuthError(error)
          setIsLoading(false)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile
          const profileData = await fetchProfile(session.user.id)

          if (profileData) {
            setProfile(profileData as Profile)
            const userTypeValue = determineUserType(profileData, session.user)
            setUserType(userTypeValue)
          } else {
            // Profile doesn't exist, create one
            console.log("Profile not found, creating default profile")
            const newProfile = await createProfile(session.user.id, session.user)

            if (newProfile) {
              setProfile(newProfile as Profile)
              const userTypeValue = determineUserType(newProfile, session.user)
              setUserType(userTypeValue)
            }
          }
        } else {
          setProfile(null)
          setUserType(null)
        }
      } catch (err) {
        console.error("Error in setData:", err)
        if (err && typeof err === "object" && "code" in err) {
          await handleAuthError(err)
        }
      } finally {
        setIsLoading(false)
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Fetch user profile
          const profileData = await fetchProfile(session.user.id)

          if (profileData) {
            setProfile(profileData as Profile)
            const userTypeValue = determineUserType(profileData, session.user)
            setUserType(userTypeValue)
          } else {
            // Profile doesn't exist, create one
            console.log("Profile not found, creating default profile")
            const newProfile = await createProfile(session.user.id, session.user)

            if (newProfile) {
              setProfile(newProfile as Profile)
              const userTypeValue = determineUserType(newProfile, session.user)
              setUserType(userTypeValue)
            }
          }
        } else {
          setProfile(null)
          setUserType(null)
        }

        // Force a router refresh to update server components
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          router.refresh()
        }
      } catch (err) {
        console.error("Error in auth state change:", err)
        if (err && typeof err === "object" && "code" in err) {
          await handleAuthError(err)
        }
      } finally {
        setIsLoading(false)
      }
    })

    setData()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; user_type?: UserType },
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            user_type: metadata?.user_type || "client",
          },
        },
      })

      return { data, error }
    } catch (err) {
      console.error("Error in signUp:", err)
      if (err && typeof err === "object" && "code" in err) {
        await handleAuthError(err)
      }
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { data, error }
    } catch (err) {
      console.error("Error in signIn:", err)
      if (err && typeof err === "object" && "code" in err) {
        await handleAuthError(err)
      }
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (err) {
      console.error("Error in signOut:", err)
      // Even if sign out fails, clear the local state
      setUser(null)
      setSession(null)
      setProfile(null)
      setUserType(null)
      router.push("/")
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      return { data, error }
    } catch (err) {
      console.error("Error in resetPassword:", err)
      if (err && typeof err === "object" && "code" in err) {
        await handleAuthError(err)
      }
      return { data: null, error: err }
    }
  }

  const isAdmin = userType === "admin"
  const isBusiness = userType === "business"
  const isClient = userType === "client" || (!isAdmin && !isBusiness)

  const value = {
    user,
    session,
    profile,
    isLoading,
    userType,
    isAdmin,
    isBusiness,
    isClient,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
