"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/use-projects"
import { RoleGuard } from "@/components/role-guard"
import { UserRole } from "@/lib/roles"
import { AddEditProjectForm } from "@/components/add-project-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ProjectsGrid() {
  const [filter, setFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const { projects, loading, error, refetch } = useProjects()

  const categories = ["all", "Residential", "Commercial", "Industrial", "Heritage", "Mixed-Use", "Infrastructure"]

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  const handleFormSuccess = () => {
    setShowAddForm(false)
    refetch()
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-slate-600">Loading projects...</span>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading projects: {error}
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Featured Projects</h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-6 md:mb-8">
            Discover our successful construction projects across various sectors.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className="capitalize px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm"
                size="sm"
              >
                {category === "all" ? "All Projects" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Project Button - Top Right Below Filters */}
        <RoleGuard requiredRole={UserRole.STAFF} showUnauthorized={false}>
          <div className="flex justify-end mb-4 md:mb-6">
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="text-xs md:text-sm py-2 px-3 md:py-2 md:px-4">
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <AddEditProjectForm
                  onSuccess={handleFormSuccess}
                  onCancel={() => setShowAddForm(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </RoleGuard>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-slate-500 text-base md:text-lg">No projects found.</p>
            <RoleGuard requiredRole={UserRole.STAFF} showUnauthorized={false}>
              <p className="text-xs md:text-sm text-slate-400 mt-2">Be the first to add a project!</p>
            </RoleGuard>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group">
                <ProjectCard {...project} onUpdate={refetch} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
