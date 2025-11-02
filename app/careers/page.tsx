"use client"

import { useState } from "react"
import { Users, Award, Zap, Heart, Plus, Trash2, RefreshCw } from "lucide-react"
import { CareersHero } from "@/components/careers-hero"
import { JobCard } from "@/components/job-card"
import { ApplicationForm } from "@/components/application-form"
import { AddJobForm } from "@/components/add-job-form"
import { RoleGuard } from "@/components/role-guard"
import { AuthRequired } from "@/components/auth-required" // Added import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/footer"
import { UserRole } from "@/lib/roles"
import { useAuth } from "@/hooks/use-auth"
import { useJobOpenings, JobOpeningInput, JobOpening } from "@/hooks/use-job-openings"

const benefits = [
  {
    icon: Users,
    title: "Collaborative Team",
    description: "Work with passionate professionals in a supportive environment",
  },
  {
    icon: Award,
    title: "Career Growth",
    description: "Continuous learning opportunities and clear career progression paths",
  },
  {
    icon: Zap,
    title: "Innovation Focus",
    description: "Work on cutting-edge technology that transforms the construction industry",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "Flexible working arrangements and comprehensive benefits package",
  },
]

export default function CareersPage() {
  return (
    <AuthRequired>
      <CareersPageContent />
    </AuthRequired>
  )
}

function CareersPageContent() {
  const [selectedJob, setSelectedJob] = useState<{ title: string; id: number } | null>(null)
  const [showAddJobForm, setShowAddJobForm] = useState(false)
  const { isStaff, isAdmin } = useAuth()
  const { jobOpenings, isLoading, addJob, deleteJob, refreshJobs } = useJobOpenings()

  const canManageJobs = isStaff() || isAdmin()

  const handleApply = (jobTitle: string, jobId: number) => {
    setSelectedJob({ title: jobTitle, id: jobId })
  }

  const handleCloseApplication = () => {
    setSelectedJob(null)
  }

  const handleAddJob = async (newJob: JobOpeningInput) => {
    const success = await addJob(newJob)
    if (success) {
      setShowAddJobForm(false)
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    await deleteJob(jobId)
  }

  return (
    <div className="min-h-screen">
      <CareersHero />

      {/* Why Join Us Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Why Join HNZ Consult?</h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of a team that's revolutionizing how construction projects are managed and executed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-4 md:p-6">
                <CardHeader className="p-0 pb-4 md:pb-6">
                  <benefit.icon className="h-8 w-8 md:h-12 md:w-12 mx-auto text-primary mb-3 md:mb-4" />
                  <CardTitle className="text-base md:text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs md:text-sm">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="job-openings" className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Current Openings</h2>
            <p className="text-base md:text-xl text-muted-foreground">Find your perfect role and start your career with us</p>
          </div>
          
          {/* Add Job Button - Top Right Below Header */}
          <RoleGuard requiredRole={UserRole.STAFF} showUnauthorized={false}>
            <div className="flex justify-end mb-4 md:mb-6">
              <div className="flex gap-1.5 md:gap-2">
                <Button 
                  onClick={() => setShowAddJobForm(true)}
                  className="text-xs md:text-sm py-2 px-3"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  Add Job
                </Button>
                <Button 
                  onClick={refreshJobs}
                  variant="outline"
                  size="icon"
                  title="Refresh job openings"
                  className="h-8 w-8 md:h-9 md:w-9"
                >
                  <RefreshCw className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          </RoleGuard>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="p-4 md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    <Skeleton className="h-5 md:h-6 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-3 md:h-4 w-16 md:w-20" />
                      <Skeleton className="h-3 md:h-4 w-12 md:w-16" />
                    </div>
                    <Skeleton className="h-3 md:h-4 w-full" />
                    <Skeleton className="h-3 md:h-4 w-full" />
                    <Skeleton className="h-3 md:h-4 w-2/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Job Listings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {jobOpenings.map((job: JobOpening) => (
                  <div key={job.id} className="relative group">
                    <JobCard
                      title={job.title}
                      department={job.department}
                      location={job.location}
                      type={job.type}
                      experience={job.experience}
                      description={job.description}
                      requirements={job.requirements}
                      onApply={() => handleApply(job.title, job.id)}
                      showManagement={canManageJobs}
                    />
                    
                    {/* Management Buttons - Only visible to staff and admin */}
                    <RoleGuard requiredRole={UserRole.STAFF} showUnauthorized={false}>
                      <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex gap-1.5 md:gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                className="h-7 w-7 md:h-8 md:w-8 shadow-lg"
                                title="Delete job opening"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job Opening</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{job.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteJob(job.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </RoleGuard>
                  </div>
                ))}
              </div>
              
              {/* No jobs message */}
              {jobOpenings.length === 0 && (
                <div className="text-center py-8 md:py-12">
                  <p className="text-muted-foreground text-base md:text-lg mb-3 md:mb-4">No job openings available at the moment.</p>
                  <RoleGuard requiredRole={UserRole.STAFF} showUnauthorized={false}>
                    <Button 
                      onClick={() => setShowAddJobForm(true)}
                      className="flex items-center gap-1.5 md:gap-2 mx-auto text-sm md:text-base py-2 px-4"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                      Add First Job Opening
                    </Button>
                  </RoleGuard>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedJob && (
        <ApplicationForm 
          jobTitle={selectedJob.title} 
          jobId={selectedJob.id}
          onClose={handleCloseApplication} 
        />
      )}
      
      {/* Add Job Form Modal */}
      {showAddJobForm && (
        <AddJobForm 
          onClose={() => setShowAddJobForm(false)} 
          onSubmit={handleAddJob} 
        />
      )}

      <Footer />
    </div>
  )
}