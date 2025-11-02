"use client"

import { useState } from 'react'
import { useTeamMembers } from '@/hooks/use-team-members'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Linkedin, Mail, Plus, Edit, Trash2 } from "lucide-react"
import { TeamMemberForm } from '@/components/team-member-form'
import { TeamMember } from '@/hooks/use-team-members'

export function TeamSection() {
  const { teamMembers, loading, error, canEdit, createTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  const handleAddNew = () => {
    setEditingMember(null)
    setShowForm(true)
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember(id)
      } catch (err) {
        console.error('Error deleting team member:', err)
        alert('Failed to delete team member')
      }
    }
  }

  const handleSave = async (teamMemberData: Omit<TeamMember, 'id'> | Partial<TeamMember>) => {
    try {
      if (editingMember) {
        // Update existing team member
        await updateTeamMember(editingMember.id!, teamMemberData)
      } else {
        // Create new team member
        await createTeamMember(teamMemberData as Omit<TeamMember, 'id'>)
      }
      setShowForm(false)
      setEditingMember(null)
    } catch (err) {
      console.error('Error saving team member:', err)
      alert('Failed to save team member')
    }
  }

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-card-foreground mb-2">Meet Our Team</h2>
            <p className="text-base text-muted-foreground">Loading team members...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-card-foreground mb-2">Meet Our Team</h2>
            <p className="text-base text-red-500">Error loading team members: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl lg:text-2xl font-bold text-card-foreground mb-2">Meet Our Team</h2>
            <p className="text-base text-muted-foreground max-w-xl">
              Our diverse team combines deep construction industry expertise with cutting-edge technology skills to
              deliver innovative solutions.
            </p>
            {canEdit && (
              <div className="mt-4">
                <Dialog open={showForm} onOpenChange={setShowForm}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                    </DialogHeader>
                    <TeamMemberForm
                      teamMember={editingMember || undefined}
                      onSave={handleSave}
                      onCancel={() => {
                        setShowForm(false)
                        setEditingMember(null)
                      }}
                      isEditing={!!editingMember}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border pt-0 pb-6 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
              <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {canEdit && (
                  <>
                    <Dialog open={showForm && editingMember?.id === member.id} onOpenChange={(open) => {
                      if (open) {
                        handleEdit(member)
                      } else {
                        setShowForm(false)
                        setEditingMember(null)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 transition-all duration-200 hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Team Member</DialogTitle>
                        </DialogHeader>
                        <TeamMemberForm
                          teamMember={member}
                          onSave={handleSave}
                          onCancel={() => {
                            setShowForm(false)
                            setEditingMember(null)
                          }}
                          isEditing={true}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0 transition-all duration-200 hover:scale-105"
                      onClick={() => member.id && handleDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="h-[400px] bg-muted flex items-center justify-center">
                <img
                  src={member.image_url || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>
              <CardContent className="p-3 flex-1">
                <h3 className="text-base font-bold text-card-foreground mb-0.5">{member.name}</h3>
                <p className="text-accent font-medium text-xs mb-0.5">{member.position}</p>
                <p className="text-[0.65rem] text-muted-foreground mb-2">{member.company}</p>
                <p className="text-[0.65rem] text-muted-foreground line-clamp-2">{member.bio}</p>
                <div className="flex space-x-2 mt-3">
                  {member.linkedin_url && (
                    <a 
                      href={member.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-primary rounded-full hover:bg-primary/80 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 text-primary-foreground" />
                    </a>
                  )}
                  {member.email && (
                    <a 
                      href={`mailto:${member.email}`}
                      className="p-2 bg-accent rounded-full hover:bg-accent/80 transition-colors"
                    >
                      <Mail className="h-4 w-4 text-accent-foreground" />
                    </a>
                  )}
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}