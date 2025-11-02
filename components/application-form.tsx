"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useJobApplications, JobApplicationInput } from "@/hooks/use-job-applications"

interface ApplicationFormProps {
  jobTitle: string
  jobId: number // Add job ID prop
  onClose: () => void
}

export function ApplicationForm({ jobTitle, jobId, onClose }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { submitApplication } = useJobApplications()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    degree: "",
    graduationYear: "",
    experience: "",
    coverLetter: "",
    resume: null as File | null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.university.trim()) newErrors.university = "University is required"
    if (!formData.degree.trim()) newErrors.degree = "Degree is required"
    if (!formData.graduationYear) newErrors.graduationYear = "Graduation year is required"
    if (!formData.experience) newErrors.experience = "Experience level is required"
    if (!formData.resume) newErrors.resume = "Resume is required"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsSubmitting(true)

    try {
      const applicationData: JobApplicationInput = {
        job_opening_id: jobId,
        applicant_name: formData.fullName,
        applicant_email: formData.email,
        phone: formData.phone,
        university: formData.university,
        degree: formData.degree,
        graduation_year: formData.graduationYear,
        experience_level: formData.experience,
        cover_letter: formData.coverLetter || undefined,
        resume: formData.resume!
      }

      const success = await submitApplication(applicationData)
      if (success) {
        setIsSubmitted(true)
      }
    } catch (error) {
      console.error('Application submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }))
    }
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-green-600">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for your interest in the {jobTitle} position. We'll review your application and get back to you
              soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="w-full flex justify-center min-h-full py-4 sm:py-8">
        <Card className="w-full max-w-2xl max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Apply for {jobTitle}</CardTitle>
              <CardDescription>Fill out the form below to submit your application</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="university">University *</Label>
                <Input
                  id="university"
                  required
                  value={formData.university}
                  onChange={(e) => setFormData((prev) => ({ ...prev, university: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  required
                  placeholder="e.g., Bachelor of Engineering"
                  value={formData.degree}
                  onChange={(e) => setFormData((prev) => ({ ...prev, degree: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, graduationYear: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Experience Level *</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh-graduate">Fresh Graduate</SelectItem>
                  <SelectItem value="0-1-years">0-1 Years</SelectItem>
                  <SelectItem value="1-2-years">1-2 Years</SelectItem>
                  <SelectItem value="2-3-years">2-3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resume">Resume/CV *</Label>
              <div className="mt-2">
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${
                  errors.resume ? 'border-red-500' : 'border-muted-foreground/25'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      {formData.resume ? formData.resume.name : "Click to upload your resume"}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX (MAX. 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                </label>
                {errors.resume && <p className="text-sm text-red-500 mt-1">{errors.resume}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                className="min-h-[120px]"
                value={formData.coverLetter}
                onChange={(e) => setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
