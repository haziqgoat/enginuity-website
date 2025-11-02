"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { UserRole, DEFAULT_ROLE, hasRole, hasPermission } from "@/lib/roles"
import type { UserWithRole } from "@/lib/roles"

export function useAuth() {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Normalize the user object so name and role are always available
  const normalizeUser = (sessionUser: any): UserWithRole => {
    return {
      ...sessionUser,
      name: sessionUser.user_metadata?.full_name || sessionUser.email,
      user_metadata: {
        ...sessionUser.user_metadata,
        role: sessionUser.user_metadata?.role || DEFAULT_ROLE,
      },
    }
  }

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user

      if (sessionUser) {
        setUser(normalizeUser(sessionUser))
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user
      if (sessionUser) {
        setUser(normalizeUser(sessionUser))
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // ✅ UPDATE USER PROFILE
  const updateUser = async (updates: any) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          phone: updates.phone,
          company_name: updates.company_name,
          company_type: updates.company_type,
          position: updates.position,
          company_address: updates.company_address,
          city: updates.city,
          state: updates.state,
          postal_code: updates.postal_code,
          project_types: updates.project_types,
          experience: updates.experience,
          notes: updates.notes,
          ...updates // Allow for additional fields
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.user) {
        const normalizedUser = normalizeUser(data.user)
        setUser(normalizedUser)
        return { success: true, user: normalizedUser }
      }

      return { success: false, error: "Failed to update user" }
    } catch (error: any) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    }
  }

  // ✅ UPLOAD PROFILE PICTURE
  const uploadProfilePicture = async (file: File) => {
    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      console.log('Starting upload for user:', user.id)

      // Create a unique filename with timestamp to bust cache
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const fileName = `${user.id}/profile.${fileExt}`
      
      console.log('Uploading to path:', fileName)

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '0', // No cache control
          upsert: true // Replace existing file
        })

      console.log('Upload result:', { uploadData, uploadError })

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          error: uploadError
        })
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get the public URL with timestamp to bust cache
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName)

      const avatarUrl = `${urlData.publicUrl}?t=${timestamp}`

      // Update user metadata with the avatar URL
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: avatarUrl
        }
      })

      if (updateError) {
        throw new Error(updateError.message)
      }

      if (updateData.user) {
        const normalizedUser = normalizeUser(updateData.user)
        setUser(normalizedUser)
        return { success: true, avatarUrl, user: normalizedUser }
      }

      return { success: false, error: 'Failed to update user with avatar URL' }
    } catch (error: any) {
      console.error('Upload profile picture error:', error)
      return { success: false, error: error.message }
    }
  }
  // ✅ UPDATE PASSWORD
  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (error: any) {
      console.error('Update password error:', error)
      return { success: false, error: error.message }
    }
  }

  // ✅ RESET PASSWORD (FORGOT PASSWORD)
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true }
    } catch (error: any) {
      console.error('Reset password error:', error)
      return { success: false, error: error.message }
    }
  }

  // ✅ VERIFY OTP
  const verifyOtp = async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ 
        email, 
        token, 
        type: 'recovery' // For password recovery
      })

      if (error) {
        throw new Error(error.message)
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Verify OTP error:', error)
      return { success: false, error: error.message }
    }
  }

  // Signup with default client role
  const signup = async (email: string, password: string, fullName?: string, company?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company,
          role: DEFAULT_ROLE, // New users get client role by default
        },
      },
    })

    if (error) return { success: false, error: error.message }
    
    // Check if email confirmation is required
    const needsEmailConfirmation = data.user && !data.session
    
    if (data.user && data.session) {
      // User is immediately logged in (email confirmation disabled)
      setUser(normalizeUser(data.user))
      setIsAuthenticated(true)
    }

    return { 
      success: true, 
      user: data.user,
      session: data.session,
      needsEmailConfirmation
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return { success: false, error: error.message }
    if (data.user) setUser(normalizeUser(data.user))

    return { success: true, user: data.user }
  }

  // Logout
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAuthenticated(false)
  }

  // Role-based helper functions
  const getUserRole = (): UserRole => {
    return user?.user_metadata?.role || DEFAULT_ROLE
  }

  const checkRole = (requiredRole: UserRole): boolean => {
    return hasRole(getUserRole(), requiredRole)
  }

  const checkPermission = (permission: string): boolean => {
    return hasPermission(getUserRole(), permission)
  }

  const isClient = (): boolean => checkRole(UserRole.CLIENT)
  const isStaff = (): boolean => checkRole(UserRole.STAFF)
  const isAdmin = (): boolean => checkRole(UserRole.ADMIN)

  return { 
    user, 
    isAuthenticated, 
    isLoading, 
    signup, 
    login, 
    logout, 
    updateUser,
    updatePassword,
    resetPassword,
    verifyOtp,
    uploadProfilePicture,
    // Role management
    getUserRole,
    checkRole,
    checkPermission,
    isClient,
    isStaff,
    isAdmin
  }
}