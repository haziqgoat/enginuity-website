"use client"

import { StaffOnly } from "@/components/role-guard"
import { ContactMessagesDashboard } from "@/components/contact-messages-dashboard"
import { AppointmentsDashboard } from "@/components/appointments-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useContactMessagesCount } from "@/hooks/use-contact-messages-count"
import { useAppointmentCount } from "@/hooks/use-appointment-count"

export default function ContactMessagesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"messages" | "appointments">("messages")
  const { unreadCount: contactMessagesCount } = useContactMessagesCount()
  const { count: pendingAppointmentsCount } = useAppointmentCount('pending')

  return (
    <StaffOnly>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.push('/staff')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Staff Panel
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-b mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("messages")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                      activeTab === "messages"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Contact Messages
                    {contactMessagesCount > 0 && (
                      <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full bg-red-500 text-[0.6rem] text-white font-bold h-4 w-4">
                          {contactMessagesCount > 99 ? '99+' : contactMessagesCount}
                        </span>
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                      activeTab === "appointments"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Appointment Details
                    {pendingAppointmentsCount > 0 && (
                      <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full bg-red-500 text-[0.6rem] text-white font-bold h-4 w-4">
                          {pendingAppointmentsCount > 99 ? '99+' : pendingAppointmentsCount}
                        </span>
                      </span>
                    )}
                  </button>
                </nav>
              </div>
              
              {activeTab === "messages" ? <ContactMessagesDashboard /> : <AppointmentsDashboard />}
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffOnly>
  )
}