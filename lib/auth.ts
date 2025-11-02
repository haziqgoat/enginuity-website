import { supabase } from "@/lib/supabaseClient"
import { DEFAULT_ROLE } from "@/lib/roles"

// Supabase's user type
import type { User } from "@supabase/supabase-js"

export const auth = {
  // Get the currently signed-in user
  getCurrentUser: async (): Promise<User | null> => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  },

  // Login with email + password
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data.user }
  },

  // Signup with email + password (+ optional metadata) and default role
  signup: async (email: string, password: string, name: string, company?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name, 
          company,
          role: DEFAULT_ROLE // New users get client role by default
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, user: data.user }
  },

  // Logout
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true }
  },
}
