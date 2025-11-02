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
import { format } from "date-fns"
import { useContactMessages } from "@/hooks/use-contact-messages"
import { ContactMessage } from "@/hooks/use-contact-messages"
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

export function ContactMessagesDashboard() {
  const { messages, isLoading, error, updateMessageStatus, deleteMessage, refreshMessages } = useContactMessages()
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [status, setStatus] = useState("")
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null)

  // Add a function to close the dialog
  const closeDialog = () => {
    setSelectedMessage(null)
  }

  useEffect(() => {
    if (selectedMessage) {
      setStatus(selectedMessage.status)
    }
  }, [selectedMessage])

  const handleStatusUpdate = async () => {
    if (!selectedMessage) return
    
    // Pass empty string for notes since we're removing the notes field
    const success = await updateMessageStatus(selectedMessage.id, status, "")
    if (success) {
      closeDialog()
      await refreshMessages()
    }
  }

  const handleDeleteClick = (id: number) => {
    setMessageToDelete(id)
    setDeleteConfirmationOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (messageToDelete === null) return
    
    const success = await deleteMessage(messageToDelete)
    if (success) {
      await refreshMessages()
      setDeleteConfirmationOpen(false)
      setMessageToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge variant="destructive">Unread</Badge>
      case "read":
        return <Badge variant="secondary">Read</Badge>
      case "replied":
        return <Badge variant="default">Replied</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading messages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Error loading messages: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No contact messages found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Inquiry Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.inquiry_type}</TableCell>
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>{format(new Date(message.created_at), "MMM d, yyyy h:mm a")}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog open={selectedMessage?.id === message.id} onOpenChange={(open) => !open && closeDialog()}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setSelectedMessage(message)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Contact Message Details</DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Name</Label>
                                  <p className="mt-1">{selectedMessage.name}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p className="mt-1">{selectedMessage.email}</p>
                                </div>
                                <div>
                                  <Label>Company</Label>
                                  <p className="mt-1">{selectedMessage.company || "N/A"}</p>
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <p className="mt-1">{selectedMessage.phone || "N/A"}</p>
                                </div>
                                <div>
                                  <Label>Inquiry Type</Label>
                                  <p className="mt-1">{selectedMessage.inquiry_type}</p>
                                </div>
                                <div>
                                  <Label>Date</Label>
                                  <p className="mt-1">{format(new Date(selectedMessage.created_at), "MMM d, yyyy h:mm a")}</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Message</Label>
                                <div className="mt-1 p-3 bg-muted rounded-md">
                                  <p>{selectedMessage.message}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="status">Status</Label>
                                  <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unread">Unread</SelectItem>
                                      <SelectItem value="read">Read</SelectItem>
                                      <SelectItem value="replied">Replied</SelectItem>
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
                      <AlertDialog open={deleteConfirmationOpen && messageToDelete === message.id} onOpenChange={setDeleteConfirmationOpen}>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the contact message.
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
      <AlertDialog open={deleteConfirmationOpen && messageToDelete === null} onOpenChange={setDeleteConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMessageToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}