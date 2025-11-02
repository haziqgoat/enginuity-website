"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle } from "lucide-react"
import { useContactMessages } from "@/hooks/use-contact-messages"

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { submitMessage } = useContactMessages()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await submitMessage({
      name: formData.name,
      email: formData.email,
      company: formData.company || undefined,
      phone: formData.phone || undefined,
      inquiryType: formData.inquiryType,
      message: formData.message,
      newsletter: false, // Always set to false since we removed the UI option
    })
    
    if (success) {
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 md:p-12 text-center">
          <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500 mx-auto mb-4 md:mb-6" />
          <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 md:mb-4">Message Sent Successfully!</h3>
          <p className="text-muted-foreground text-base md:text-lg">
            Thank you for contacting us. Our team will review your inquiry and get back to you within 24 hours.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl text-center">Send Us a Message</CardTitle>
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
              <Label htmlFor="company" className="text-sm md:text-base">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Enter your company name"
                className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
              />
            </div>
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
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="inquiryType" className="text-sm md:text-base">Inquiry Type *</Label>
            <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
              <SelectTrigger className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demo">Request Demo</SelectItem>
                <SelectItem value="pricing">Pricing Information</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="message" className="text-sm md:text-base">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell us about your project requirements or questions..."
              rows={4}
              required
              className="py-2.5 md:py-3 px-3 md:px-4 text-sm md:text-base"
            />
          </div>

          <Button type="submit" size="lg" className="w-full py-3 md:py-4 text-sm md:text-base">
            Send Message
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}