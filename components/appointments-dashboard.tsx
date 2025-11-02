"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { useAppointments } from "@/hooks/use-appointments"
import { Appointment } from "@/hooks/use-appointments"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export function AppointmentsDashboard() {
  const { appointments, isLoading, error, updateAppointmentStatus, deleteAppointment, refreshAppointments } = useAppointments()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [status, setStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null)

  // Add a function to close the dialog
  const closeDialog = () => {
    setSelectedAppointment(null)
  }

  useEffect(() => {
    if (selectedAppointment) {
      setStatus(selectedAppointment.status)
    }
  }, [selectedAppointment])

  const handleStatusUpdate = async () => {
    if (!selectedAppointment) return
    
    // Pass empty string for notes since we're removing the notes field
    const success = await updateAppointmentStatus(selectedAppointment.id, status, "")
    if (success) {
      closeDialog()
      await refreshAppointments()
    }
  }

  const handleDeleteClick = (id: number) => {
    setAppointmentToDelete(id)
    setDeleteConfirmationOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete === null) return
    
    const success = await deleteAppointment(appointmentToDelete)
    if (success) {
      await refreshAppointments()
      setDeleteConfirmationOpen(false)
      setAppointmentToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">Pending</Badge>
      case "confirmed":
        return <Badge variant="default">Confirmed</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      appointment.name.toLowerCase().includes(term) ||
      appointment.email.toLowerCase().includes(term)
    )
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading appointments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading appointments: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.name}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{format(new Date(appointment.appointment_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>{format(new Date(appointment.created_at), "MMM d, yyyy")}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog open={selectedAppointment?.id === appointment.id} onOpenChange={(open) => !open && closeDialog()}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Appointment Details</DialogTitle>
                          </DialogHeader>
                          {selectedAppointment && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <p className="mt-1">{selectedAppointment.name}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="mt-1">{selectedAppointment.email}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="mt-1">{selectedAppointment.phone || "N/A"}</p>
                                </div>
                                <div>
                                  <Label>Service Type</Label>
                                  <p className="mt-1">{selectedAppointment.service_type}</p>
                                </div>
                                <div>
                                  <Label>Appointment Date</Label>
                                  <p className="mt-1">{format(new Date(selectedAppointment.appointment_date), "MMM d, yyyy")}</p>
                                </div>
                                <div>
                                  <Label>Appointment Time</Label>
                                  <p className="mt-1">{selectedAppointment.appointment_time}</p>
                                </div>
                                <div>
                                  <Label>Submitted On</Label>
                                  <p className="mt-1">{format(new Date(selectedAppointment.created_at), "MMM d, yyyy h:mm a")}</p>
                                </div>
                                <div>
                                  <Label>Status</Label>
                                  <p className="mt-1">{getStatusBadge(selectedAppointment.status)}</p>
                                </div>
                              </div>
                              
                              {selectedAppointment.notes && (
                                <div>
                                  <Label>Notes</Label>
                                  <div className="mt-1 p-3 bg-muted rounded-md">
                                    <p>{selectedAppointment.notes}</p>
                                  </div>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="status">Status</Label>
                                  <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  onClick={closeDialog}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleStatusUpdate}>
                                  Update Status
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog open={deleteConfirmationOpen && appointmentToDelete === appointment.id} onOpenChange={setDeleteConfirmationOpen}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(appointment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the appointment.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Hidden dialog for delete confirmation when not tied to a specific row */}
      <AlertDialog open={deleteConfirmationOpen && appointmentToDelete === null} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAppointmentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}