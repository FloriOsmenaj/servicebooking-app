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

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error(error)
        setIsLoading(false)
        return
      }

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error(profileError)
        } else if (profileData) {
          setProfile(profileData)
          setUserType(profileData.user_type as UserType)
        }
      }

      setIsLoading(false)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error(profileError)
        } else if (profileData) {
          setProfile(profileData)
          setUserType(profileData.user_type as UserType)
        }
      } else {
        setProfile(null)
        setUserType(null)
      }

      setIsLoading(false)

      // Force a router refresh to update server components
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh()
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
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { data, error }
  }

  const isAdmin = userType === "admin"
  const isBusiness = userType === "business"
  const isClient = userType === "client"

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
