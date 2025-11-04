"use client"

import { useAuth } from "@/hooks/use-auth"
import { ProfileForm } from "@/components/profile-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Mail, Calendar, ArrowLeft, Camera, Building2, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getRoleDisplayName, getRoleBadgeColor } from "@/lib/roles"

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, uploadProfilePicture, getUserRole } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Initialize profile image from user metadata
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setProfileImage(user.user_metadata.avatar_url)
    }
  }, [user])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadMessage({ type: 'error', text: 'Please select a valid image file.' })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage({ type: 'error', text: 'Image size must be less than 5MB.' })
      return
    }

    setIsUploading(true)
    setUploadMessage(null)

    try {
      const result = await uploadProfilePicture(file)
      
      if (result.success && result.avatarUrl) {
        setProfileImage(result.avatarUrl)
        setUploadMessage({ type: 'success', text: 'Profile picture updated successfully!' })
        
        // Clear success message after 3 seconds
        setTimeout(() => setUploadMessage(null), 3000)
      } else {
        throw new Error(result.error || 'Failed to upload image')
      }
    } catch (error: any) {
      setUploadMessage({ type: 'error', text: error.message || 'Failed to upload image. Please try again.' })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAdmin = getUserRole() === 'admin';

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto w-24 h-24 mb-4">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-primary" />
                      )}
                    </div>
                    <label className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all ${
                      isUploading 
                        ? 'bg-primary/50 cursor-not-allowed' 
                        : 'bg-primary text-primary-foreground hover:bg-primary/80'
                    }`}>
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                  
                  {/* Upload Message */}
                  {uploadMessage && (
                    <div className={`mb-4 p-2 rounded-md text-sm ${
                      uploadMessage.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {uploadMessage.text}
                    </div>
                  )}
                  <CardTitle className="text-lg">{user?.user_metadata?.full_name || "User"}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge className={getRoleBadgeColor(getUserRole())}>
                      {getRoleDisplayName(getUserRole())}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}</span>
                  </div>
                </CardContent>
              </Card>

            </div>

            <div className="md:col-span-2 space-y-6">
              <ProfileForm user={user} isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}