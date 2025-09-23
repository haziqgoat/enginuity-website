"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/supabase-js"

// Small wrapper around Supabase auth functions
export const auth = {
  getCurrentUser: async (): Promise<User | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) return { success: false, error: error.message }
    return { success: true, user: data.user }
  },

  signup: async (email: string, password: string, name?: string, company?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, company },
      },
    })
    if (error) return { success: false, error: error.message }
    return { success: true, user: data.user }
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return { success: false, error: error.message }
    return { success: true }
  },
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await auth.getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }
    loadUser()

    // ✅ Listen for auth state changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
  }
}
