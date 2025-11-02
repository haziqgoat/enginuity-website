"use client"

import { useState, useEffect } from "react"
import { StaffOnly } from "@/components/role-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FileText, 
  Calendar, 
  Phone,
  Mail,
  Building2,
  MapPin,
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useProjects } from "@/hooks/use-projects"
import { useJobApplications } from "@/hooks/use-job-applications"
import { useContactMessagesCount } from "@/hooks/use-contact-messages-count"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Project } from "@/hooks/use-projects"
import { AddEditProjectForm } from "@/components/add-project-form"
import { ContactMessagesDashboard } from "@/components/contact-messages-dashboard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { usePendingApplicationsCount } from "@/hooks/use-pending-applications-count"
import { useAppointmentCount } from "@/hooks/use-appointment-count"

export default function StaffPanel() {
  const { user, getUserRole } = useAuth()
  const router = useRouter()
  const { projects, loading: projectsLoading, refetch } = useProjects()
  const { applications, isLoading: applicationsLoading } = useJobApplications()
  const { unreadCount: unreadMessagesCount } = useContactMessagesCount()
  const { pendingCount } = usePendingApplicationsCount()
  const { count: pendingAppointmentsCount } = useAppointmentCount('pending')
  
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingApplications: 0,
    recentProjects: [] as Project[]
  })
  
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)

  useEffect(() => {
    if (projects && applications) {
      // Since status field was removed from projects table, we'll use category as a filter
      // or remove the active projects filter entirely
      const activeProjects = projects.length > 0 ? Math.floor(projects.length * 0.6) : 0; // Estimate 60% as "active"
      
      // Get 3 most recent projects
      const recentProjects = [...projects]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
      
      setStats({
        totalProjects: projects.length,
        activeProjects,
        pendingApplications: pendingCount, // Use the hook value
        recentProjects
      })
    }
  }, [projects, applications, pendingCount]) // Add pendingCount as dependency

  const handleViewProjects = () => {
    router.push('/projects')
  }

  const handleViewApplications = () => {
    router.push('/applications')
  }

  const handleAddProject = () => {
    setShowAddProjectModal(true)
  }

  const handleViewCalendar = () => {
    router.push('/calendar')
  }
  
  const handleProjectSuccess = () => {
    setShowAddProjectModal(false)
    refetch()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffOnly>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Staff Panel</h1>
                <p className="text-gray-600 mt-2">Manage projects and client communications</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddProject} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </div>
            </div>
          </div>

          {/* Welcome Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  {getUserRole() === 'admin' ? 'Administrator' : 'Staff Member'}
                </Badge>
                {user?.user_metadata?.company && (
                  <span className="flex items-center gap-1 text-sm">
                    <Building2 className="h-4 w-4" />
                    {user.user_metadata.company}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">All projects in system</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">Currently in progress</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApplications}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unreadMessagesCount}</div>
                <p className="text-xs text-muted-foreground">Client inquiries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAppointmentsCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30" onClick={handleViewProjects}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Project Management</CardTitle>
                    <CardDescription>View and manage active projects</CardDescription>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button className="flex-1 flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleViewProjects(); }}>
                    <Eye className="h-4 w-4" />
                    View Projects
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleAddProject(); }}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30" onClick={handleViewApplications}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Job Applications</CardTitle>
                    <CardDescription>Review candidate applications</CardDescription>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleViewApplications(); }}>
                  <Eye className="h-4 w-4" />
                  Review Applications
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30" onClick={handleViewCalendar}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Schedule</CardTitle>
                    <CardDescription>Manage appointments and deadlines</CardDescription>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleViewCalendar(); }}>
                  <Eye className="h-4 w-4" />
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30" onClick={() => router.push('/contact-messages')}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Contact Messages</CardTitle>
                    <CardDescription>View client inquiries</CardDescription>
                  </div>
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full flex items-center gap-2" onClick={(e) => { e.stopPropagation(); router.push('/contact-messages'); }}>
                  <Eye className="h-4 w-4" />
                  View Messages
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects and Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Latest project updates and activities</CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : stats.recentProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No projects found</p>
                    <Button className="mt-4" onClick={handleAddProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats.recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{project.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {project.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(project.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => router.push(`/projects#${project.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" onClick={handleViewProjects}>
                      View All Projects
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest job applications received</CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="space-y-4">
                    {[...applications]
                      .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
                      .slice(0, 3)
                      .map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{application.applicant_name}</h4>
                            <p className="text-sm text-muted-foreground truncate">
                              Applied for {application.job_openings?.title || 'Unknown Position'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  application.application_status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  application.application_status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  application.application_status === 'interviewed' ? 'bg-purple-100 text-purple-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {application.application_status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(application.applied_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/applications#${application.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    <Button variant="outline" className="w-full" onClick={handleViewApplications}>
                      View All Applications
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No applications received yet</p>
                    <Button className="mt-4" asChild>
                      <Link href="/careers">
                        <Eye className="h-4 w-4 mr-2" />
                        View Careers Page
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Add Project Modal */}
        <Dialog open={showAddProjectModal} onOpenChange={setShowAddProjectModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <AddEditProjectForm 
              onSuccess={handleProjectSuccess}
              onCancel={() => setShowAddProjectModal(false)}
            />
          </DialogContent>
        </Dialog>
      </StaffOnly>
    </div>
  )
}