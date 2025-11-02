"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabaseClient"
import { Upload, Link, Image as ImageIcon, X, Loader2 } from "lucide-react"
import { TeamMember } from '@/hooks/use-team-members'

interface TeamMemberFormProps {
  teamMember?: TeamMember
  onSave: (teamMember: Omit<TeamMember, 'id'> | Partial<TeamMember>) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export function TeamMemberForm({ teamMember, onSave, onCancel, isEditing = false }: TeamMemberFormProps) {
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'> | Partial<TeamMember>>({
    name: teamMember?.name || '',
    position: teamMember?.position || '',
    company: teamMember?.company || '',
    bio: teamMember?.bio || '',
    image_url: teamMember?.image_url || '',
    linkedin_url: teamMember?.linkedin_url || '',
    email: teamMember?.email || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageMode, setImageMode] = useState<'url' | 'upload'>(teamMember?.image_url ? 'url' : 'upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Upload image to Supabase storage
  const uploadTeamMemberImage = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true)
      
      // Get current user session
      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session?.user) {
        throw new Error('Authentication required for image upload')
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `team-members/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('team-member-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get the public URL with timestamp to bust cache
      const { data: urlData } = supabase.storage
        .from('team-member-images')
        .getPublicUrl(filePath)

      // Add timestamp to URL to prevent caching issues
      const imageUrl = `${urlData.publicUrl}?t=${Date.now()}`

      return imageUrl
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      let finalImageUrl = formData.image_url
      
      // Handle image upload if a file is selected
      if (imageMode === 'upload' && selectedFile) {
        try {
          finalImageUrl = await uploadTeamMemberImage(selectedFile)
        } catch (error) {
          toast({
            title: "Image Upload Failed",
            description: error instanceof Error ? error.message : "Failed to upload image",
            variant: "destructive",
          })
          return // Don't proceed with form submission if image upload fails
        }
      }
      
      // Update form data with final image URL
      const finalData = {
        ...formData,
        image_url: finalImageUrl || undefined
      }
      
      await onSave(finalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2 text-sm text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
            <Input
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium">Position *</label>
            <Input
              id="position"
              name="position"
              value={formData.position || ''}
              onChange={handleChange}
              required
              placeholder="Enter position"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">Company *</label>
            <Input
              id="company"
              name="company"
              value={formData.company || ''}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">Bio *</label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              required
              placeholder="Enter bio"
              rows={3}
            />
          </div>
          
          {/* Image Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Profile Image</label>
            
            <Tabs value={imageMode} onValueChange={(value) => setImageMode(value as 'url' | 'upload')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Image URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Image
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="space-y-2">
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url || ''}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {selectedFile ? (
                          <>
                            <ImageIcon className="w-8 h-8 mb-2 text-green-500" />
                            <p className="text-sm text-gray-600 font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">Image ready for upload</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  {uploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading image...
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="linkedin_url" className="text-sm font-medium">LinkedIn URL</label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={handleChange}
              placeholder="Enter LinkedIn URL"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}