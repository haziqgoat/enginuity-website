"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { format, addMonths, subMonths, isSameDay, isSameMonth } from "date-fns"
import { StaffOnly } from "@/components/role-guard"
import { useRouter } from "next/navigation"
import { useEvents } from "@/hooks/use-events"
import { Event } from "@/hooks/use-events"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    location: ""
  })
  
  const router = useRouter()
  const { events, loading, error, createEvent, deleteEvent, fetchEvents } = useEvents()
  
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }
  
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }
  
  // Get events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    isSameDay(new Date(event.start_time), selectedDate)
  )
  
  // Get event dates for the current month to mark on the calendar
  const eventDates = events
    .filter(event => isSameMonth(new Date(event.start_time), currentDate))
    .map(event => new Date(event.start_time))
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }
  
  // Handle adding a new event
  const handleAddEvent = async () => {
    try {
      // Combine selected date with time
      const startDateTime = new Date(selectedDate)
      const endDateTime = new Date(selectedDate)
      
      // Set default times if not provided
      startDateTime.setHours(9, 0, 0, 0)
      endDateTime.setHours(10, 0, 0, 0)
      
      await createEvent({
        title: newEvent.title || "New Event",
        description: newEvent.description,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location: newEvent.location
      })
      
      // Reset form and close modal
      setNewEvent({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        location: ""
      })
      setShowAddEventModal(false)
    } catch (err) {
      console.error("Failed to create event:", err)
    }
  }
  
  // Handle deleting an event
  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId)
      setShowEventDetailsModal(false)
    } catch (err) {
      console.error("Failed to delete event:", err)
    }
  }
  
  // Open event details modal
  const openEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setShowEventDetailsModal(true)
  }
  
  return (
    <StaffOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          </div>
          <p className="text-gray-600">Manage your schedule and appointments</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Schedule</CardTitle>
                    <CardDescription>View and manage your appointments</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="ml-2 font-medium">
                      {format(currentDate, "MMMM yyyy")}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    modifiers={{
                      hasEvent: eventDates
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Events</CardTitle>
                    <CardDescription>{format(selectedDate, "MMMM d, yyyy")}</CardDescription>
                  </div>
                  <Dialog open={showAddEventModal} onOpenChange={setShowAddEventModal}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setShowAddEventModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                            placeholder="Event title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            placeholder="Event description"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                            placeholder="Event location"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddEventModal(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddEvent}>
                            Add Event
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-4">
                    Error loading events: {error}
                  </div>
                ) : eventsForSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No events scheduled for this day</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setShowAddEventModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventsForSelectedDate.map((event) => (
                      <div 
                        key={event.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => openEventDetails(event)}
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium">{event.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(event.start_time), "h:mm a")}
                          </span>
                        </div>
                        {event.location && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Event Details Modal */}
      <Dialog open={showEventDetailsModal} onOpenChange={setShowEventDetailsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Time</h4>
                <p>
                  {format(new Date(selectedEvent.start_time), "MMMM d, yyyy h:mm a")} -{" "}
                  {format(new Date(selectedEvent.end_time), "h:mm a")}
                </p>
              </div>
              {selectedEvent.location && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
                  <p>{selectedEvent.location}</p>
                </div>
              )}
              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </StaffOnly>
  )
}