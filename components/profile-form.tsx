"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, XCircle, Building2, MapPin, Phone, Briefcase } from "lucide-react"
import { UserRole } from "@/lib/roles"

interface ProfileFormProps {
  user: any
  isAdmin?: boolean
}

interface FormData {
  name: string
  email: string
  phone: string
  companyName: string
  companyType: string
  position: string
  companyAddress: string
  city: string
  state: string
  postalCode: string
  projectTypes: string
  experience: string
  notes: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfileForm({ user, isAdmin = false }: ProfileFormProps) {
  const { getUserRole, updateUser, updatePassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const userRole = getUserRole()
  const isStaff = userRole === UserRole.STAFF

  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    companyName: user?.user_metadata?.company_name || "",
    companyType: user?.user_metadata?.company_type || "",
    position: user?.user_metadata?.position || "",
    companyAddress: user?.user_metadata?.company_address || "",
    city: user?.user_metadata?.city || "",
    state: user?.user_metadata?.state || "",
    postalCode: user?.user_metadata?.postal_code || "",
    projectTypes: user?.user_metadata?.project_types || "",
    experience: user?.user_metadata?.experience || "",
    notes: user?.user_metadata?.notes || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (message) setMessage(null)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (message) setMessage(null)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const profileData = {
        name: formData.name,
        phone: formData.phone,
        company_name: formData.companyName,
        company_type: formData.companyType,
        position: formData.position,
        company_address: formData.companyAddress,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode,
        project_types: formData.projectTypes,
        experience: formData.experience,
        notes: formData.notes
      }
      const result = await updateUser(profileData)
      if (!result.success) throw new Error(result.error)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' })
      setIsLoading(false)
      return
    }

    try {
      const result = await updatePassword(formData.newPassword)
      if (!result.success) throw new Error(result.error)
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Building2 className="h-5 w-5 mr-2 text-primary" />
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <Phone className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+60 12-345 6789"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position/Title</Label>
                <div className="flex">
                  <Briefcase className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
                  <Input
                    id="position"
                    name="position"
                    type="text"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="e.g., Project Manager, CEO"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Update Personal Info
            </Button>
          </form>
        </CardContent>
      </Card>

      {!isAdmin && !isStaff && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Manage your company details for better project coordination</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Enter company name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company Type</Label>
                    <Select onValueChange={(value) => handleSelectChange('companyType', value)} value={formData.companyType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="developer">Property Developer</SelectItem>
                        <SelectItem value="contractor">Main Contractor</SelectItem>
                        <SelectItem value="subcontractor">Sub-contractor</SelectItem>
                        <SelectItem value="consultant">Engineering Consultant</SelectItem>
                        <SelectItem value="government">Government Agency</SelectItem>
                        <SelectItem value="private">Private Company</SelectItem>
                        <SelectItem value="individual">Individual Client</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <div className="flex">
                    <MapPin className="h-4 w-4 mt-3 mr-2 text-muted-foreground flex-shrink-0" />
                    <Textarea
                      id="companyAddress"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      placeholder="Enter complete company address"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Kuala Lumpur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={(value) => handleSelectChange('state', value)} value={formData.state}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="johor">Johor</SelectItem>
                        <SelectItem value="kedah">Kedah</SelectItem>
                        <SelectItem value="kelantan">Kelantan</SelectItem>
                        <SelectItem value="malacca">Malacca</SelectItem>
                        <SelectItem value="negeri-sembilan">Negeri Sembilan</SelectItem>
                        <SelectItem value="pahang">Pahang</SelectItem>
                        <SelectItem value="penang">Penang</SelectItem>
                        <SelectItem value="perak">Perak</SelectItem>
                        <SelectItem value="perlis">Perlis</SelectItem>
                        <SelectItem value="sabah">Sabah</SelectItem>
                        <SelectItem value="sarawak">Sarawak</SelectItem>
                        <SelectItem value="selangor">Selangor</SelectItem>
                        <SelectItem value="terengganu">Terengganu</SelectItem>
                        <SelectItem value="kuala-lumpur">Kuala Lumpur</SelectItem>
                        <SelectItem value="labuan">Labuan</SelectItem>
                        <SelectItem value="putrajaya">Putrajaya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g., 50450"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Company Info
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Preferences</CardTitle>
              <CardDescription>Help us understand your construction project needs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectTypes">Primary Project Types</Label>
                  <Select onValueChange={(value) => handleSelectChange('projectTypes', value)} value={formData.projectTypes}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary project types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential Buildings</SelectItem>
                      <SelectItem value="commercial">Commercial Buildings</SelectItem>
                      <SelectItem value="industrial">Industrial Facilities</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure Projects</SelectItem>
                      <SelectItem value="renovation">Renovation & Retrofitting</SelectItem>
                      <SelectItem value="high-rise">High-rise Buildings</SelectItem>
                      <SelectItem value="mixed-development">Mixed Development</SelectItem>
                      <SelectItem value="government">Government Projects</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select onValueChange={(value) => handleSelectChange('experience', value)} value={formData.experience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New to Construction (0-1 years)</SelectItem>
                      <SelectItem value="beginner">Beginner (1-3 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (3-7 years)</SelectItem>
                      <SelectItem value="experienced">Experienced (7-15 years)</SelectItem>
                      <SelectItem value="expert">Expert (15+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Tell us about your specific requirements, preferences, or any other relevant information..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Update Preferences
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password for security</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <div className={`p-4 rounded-md border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        </div>
      )}
    </>
  )
}