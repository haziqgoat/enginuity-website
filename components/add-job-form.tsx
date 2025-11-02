import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { JobOpeningInput } from "@/hooks/use-job-openings"

interface AddJobFormProps {
  onClose: () => void
  onSubmit: (job: JobOpeningInput) => void
}

export function AddJobForm({ onClose, onSubmit }: AddJobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "",
    description: "",
    requirements: [""] // Start with one empty requirement
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const departments = ["Engineering", "Operations", "Commercial", "Technology", "Management"]
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]
  const experienceLevels = [
    "Fresh Graduate",
    "Fresh Graduate - 1 Year",
    "Fresh Graduate - 2 Years",
    "1-3 Years",
    "3-5 Years",
    "5+ Years"
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "Job title is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.experience) newErrors.experience = "Experience level is required"
    if (!formData.description.trim()) newErrors.description = "Job description is required"
    
    const validRequirements = formData.requirements.filter(req => req.trim())
    if (validRequirements.length === 0) {
      newErrors.requirements = "At least one requirement is needed"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // Filter out empty requirements
    const validRequirements = formData.requirements.filter(req => req.trim())
    
    onSubmit({
      ...formData,
      requirements: validRequirements
    })
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, ""]
    }))
  }

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData(prev => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index)
      }))
    }
  }

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Job Opening</CardTitle>
              <CardDescription>Create a new job posting for the careers page</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Civil Engineer - Project Management"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Department and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                >
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Job Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location and Experience Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Kuala Lumpur, Malaysia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level *</Label>
                <Select 
                  value={formData.experience} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experience && <p className="text-sm text-red-500">{errors.experience}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                rows={4}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Requirements *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Requirement
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                      className="flex-1"
                    />
                    {formData.requirements.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.requirements && <p className="text-sm text-red-500">{errors.requirements}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Job Opening
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}