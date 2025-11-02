"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/lib/supabaseClient"
import { useToast } from "@/hooks/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus, Upload, Link, X, Image } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects, Project } from "@/hooks/use-projects"

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required").max(255, "Location too long"),
  category: z.string().min(1, "Category is required").max(100, "Category too long"),
  image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  client_name: z.string().max(255, "Client name too long").optional(),
  // Removed duration, budget, team_size, status, start_date, end_date
})

interface ProjectFormValues {
  title: string
  description: string
  location: string
  category: string
  image_url?: string
  client_name?: string
  // Removed duration, budget, team_size, status, start_date, end_date
}

interface AddEditProjectFormProps {
  project?: Project | null
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddEditProjectForm({ project, onSuccess, onCancel }: AddEditProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [features, setFeatures] = useState<string[]>(project?.features || [])
  const [newFeature, setNewFeature] = useState("")
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url')
  
  // ---------- STATE ----------
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const { createProject, updateProject } = useProjects()
  const { toast } = useToast()
  
  const isEditing = !!project

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      location: project?.location || "",
      category: project?.category || "",
      image_url: project?.image_url || "",
      client_name: project?.client_name || "",
      // Removed duration, budget, team_size, status, start_date, end_date
    },
  })

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFeature()
    }
  }

  // ---------- IMAGE UPLOAD FUNCTION ----------
  const uploadProjectImage = async (file: File): Promise<string> => {
    try {
      setUploadingImage(true)

      const { data: { session }, error: authError } = await supabase.auth.getSession()
      if (authError || !session?.user) throw new Error('Authentication required for image upload')

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `projects/${fileName}`

      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw new Error(`Upload failed: ${error.message}`)

      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      return `${urlData.publicUrl}?t=${Date.now()}`
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  // ---------- FILE INPUT HANDLER ----------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setSelectedFile(file)

    try {
      const uploadedUrl = await uploadProjectImage(file)
      setPreviewUrl(uploadedUrl)
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload image",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true)
      
      let finalImageUrl = values.image_url
      
      // Handle image upload if a file is selected
      if (imageMode === 'upload' && previewUrl) {
        finalImageUrl = previewUrl
      } else if (imageMode === 'url') {
        finalImageUrl = values.image_url
      }
      
      const projectData = {
        ...values,
        features,
        client_name: values.client_name || undefined,
        image_url: finalImageUrl || undefined,
        // Removed duration, budget, team_size, status, start_date, end_date
      }

      if (isEditing && project) {
        await updateProject({ id: project.id, ...projectData })
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      } else {
        await createProject(projectData)
        toast({
          title: "Success", 
          description: "Project created successfully",
        })
      }

      form.reset()
      setFeatures([])
      setSelectedFile(null)
      setPreviewUrl(null)
      setImageMode('url')
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    "Residential",
    "Commercial", 
    "Industrial",
    "Infrastructure",
    "Heritage",
    "Mixed-Use",
    "Public",
    "Healthcare",
    "Education",
    "Hospitality"
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Project" : "Add New Project"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update project information" : "Create a new project entry for the portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter project description"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter client name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Section */}
            <div className="space-y-4">
              <FormLabel>Project Image</FormLabel>
              
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
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder="Enter image URL (e.g., https://example.com/image.jpg)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                
                <TabsContent value="upload" className="space-y-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {selectedFile ? (
                            <>
                              <Image className="w-8 h-8 mb-2 text-green-500" />
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
                          onClick={() => {
                            setSelectedFile(null)
                            setPreviewUrl(null)
                          }}
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
              
              {/* ---------- IMAGE PREVIEW ---------- */}
              <div className="mt-4">
                {uploadingImage ? (
                  <p className="text-sm text-gray-500">Uploading image...</p>
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded Preview"
                    className="w-full max-w-sm rounded-xl shadow-md border"
                  />
                ) : (
                  <p className="text-sm text-gray-400">No image uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <FormLabel>Key Features</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a key feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addFeature}
                  disabled={!newFeature.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Project" : "Create Project"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}