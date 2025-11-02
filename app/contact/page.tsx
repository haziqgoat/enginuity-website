"use client"

import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { MapSection } from "@/components/map-section"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { AppointmentForm } from "@/components/appointment-form"
import { Mail, Calendar } from "lucide-react"

export default function ContactPage() {
  const [activeForm, setActiveForm] = useState<"contact" | "appointment" | null>(null)

  return (
    <div className="min-h-screen">
      <main>
        <ContactHero />
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-12">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant={activeForm === "contact" ? "default" : "outline"}
                      className="flex-1 py-6 text-lg"
                      onClick={() => setActiveForm("contact")}
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Send Us a Message
                    </Button>
                    <Button
                      variant={activeForm === "appointment" ? "default" : "outline"}
                      className="flex-1 py-6 text-lg"
                      onClick={() => setActiveForm("appointment")}
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Book an Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {activeForm === "contact" && <ContactForm />}
            {activeForm === "appointment" && <AppointmentForm />}
          </div>
        </section>
        <MapSection />
      </main>
      <Footer />
    </div>
  )
}