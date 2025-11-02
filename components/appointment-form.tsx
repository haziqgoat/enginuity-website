"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { useAppointments } from "@/hooks/use-appointments"
import { format } from "date-fns"

export function AppointmentForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { submitAppointment } = useAppointments()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    serviceType: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await submitAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      serviceType: formData.serviceType,
      notes: formData.notes,
    })
    
    if (success) {
      setIsSubmitted(true)
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        appointmentDate: "",
        appointmentTime: "",
        serviceType: "",
        notes: "",
      })
      setTimeout(() => setIsSubmitted(false), 5000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateTimeOptions = () => {
    const times = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    return times
  }

  // Get tomorrow's date as minimum date
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 md:p-12 text-center">
          <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-4 md:mb-6" />
          <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 md:mb-4">Appointment Booked Successfully!</h3>
          <p className="text-muted-foreground text-base md:text-lg">
            ✅ Your appointment has been booked successfully! Our team will reach out to confirm your slot.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl text-center">Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="name" className="text-sm md:text-base">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
                className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="email" className="text-sm md:text-base">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
                className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="phone" className="text-sm md:text-base">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="serviceType" className="text-sm md:text-base">Service Type *</Label>
              <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                <SelectTrigger className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="site-visit">Site Visit</SelectItem>
                  <SelectItem value="design-review">Design Review</SelectItem>
                  <SelectItem value="project-discussion">Project Discussion</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="appointmentDate" className="text-sm md:text-base">Appointment Date *</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={formData.appointmentDate}
                onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                min={getMinDate()}
                required
                className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label htmlFor="appointmentTime" className="text-sm md:text-base">Appointment Time *</Label>
              <Select value={formData.appointmentTime} onValueChange={(value) => handleInputChange("appointmentTime", value)}>
                <SelectTrigger className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeOptions().map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="notes" className="text-sm md:text-base">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information or special requests..."
              rows={3}
              className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
            />
          </div>

          <Button type="submit" size="lg" className="w-full py-3 md:py-4 text-sm md:text-base">
            Book Appointment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}