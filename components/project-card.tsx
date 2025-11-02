import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, ExternalLink, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { RoleGuard } from "@/components/role-guard"
import { UserRole } from "@/lib/roles"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddEditProjectForm } from "@/components/add-project-form"
import { useProjects, Project } from "@/hooks/use-projects"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface ProjectCardProps {
  id: number
  title: string
  description: string
  location: string
  category: string
  image_url?: string
  features: string[]
  client_name?: string
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  onUpdate?: () => void
}

export function ProjectCard({
  id,
  title,
  description,
  location,
  category,
  image_url,
  features,
  client_name,
  created_at,
  updated_at,
  created_by,
  updated_by,
  onUpdate,
}: ProjectCardProps) {
  const [showEditForm, setShowEditForm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { deleteProject } = useProjects()
  const { toast } = useToast()

  const handleEditSuccess = () => {
    setShowEditForm(false)
    onUpdate?.()
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteProject(id)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      onUpdate?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const project: Project = {
    id,
    title,
    description,
    location,
    category,
    image_url,
    features,
    client_name,
    created_at,
    updated_at,
    created_by,
    updated_by,
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 border border-slate-200 bg-white h-full flex flex-col gap-0 py-0 ${
      isExpanded ? 'shadow-xl scale-[1.02]' : 'hover:shadow-lg hover:scale-[1.01]'
    }`}>
      {/* Project Image */}
      <div className="h-40 md:h-48 bg-slate-100 relative overflow-hidden flex-shrink-0">
        <img 
          src={image_url || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-2 right-2 md:top-3 md:right-3">
          <Badge variant="secondary" className="text-[0.65rem] md:text-xs">{category}</Badge>
        </div>
      </div>
      
      {/* Project Header */}
      <CardContent className="p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 flex-1 pr-1 md:pr-2">{title}</h3>
          
          {/* Admin Controls in Header */}
          <RoleGuard requiredRole={UserRole.STAFF} showUnauthorized={false}>
            <div className="flex gap-1 flex-shrink-0">
              <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 md:h-7 md:w-7">
                    <Edit className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                  </DialogHeader>
                  <AddEditProjectForm
                    project={project}
                    onSuccess={handleEditSuccess}
                    onCancel={() => setShowEditForm(false)}
                  />
                </DialogContent>
              </Dialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 md:h-7 md:w-7 text-red-600 hover:text-red-700 hover:bg-red-50" disabled={isDeleting}>
                    <Trash2 className="h-2.5 w-2.5 md:h-3 md:w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </RoleGuard>
        </div>
        
        <p className="text-slate-600 mb-3 md:mb-4 text-xs md:text-sm line-clamp-2">{description}</p>

        {/* Basic Project Details - Always Visible */}
        <div className="grid grid-cols-1 gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="flex items-center text-[0.65rem] md:text-xs text-slate-500">
            <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 text-blue-600 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Key Features Preview - Always Visible */}
        <div className="mb-3 md:mb-4 flex-1">
          <h4 className="font-medium text-slate-900 mb-1.5 md:mb-2 text-xs md:text-sm">Key Features:</h4>
          <ul className="space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start text-[0.65rem] md:text-xs">
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 mr-1.5 md:mr-2 flex-shrink-0"></div>
                <span className="text-slate-600 line-clamp-1">{feature}</span>
              </li>
            ))}
            {features.length > 3 && !isExpanded && (
              <li className="text-[0.65rem] md:text-xs text-slate-400 italic">+{features.length - 3} more features...</li>
            )}
          </ul>
        </div>

        {/* Expandable Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100 mb-3 md:mb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-slate-200 pt-3 md:pt-4">
            {/* Full Description */}
            <div className="mb-3 md:mb-4">
              <h4 className="font-medium text-slate-900 mb-1.5 md:mb-2 text-xs md:text-sm">Full Description:</h4>
              <p className="text-slate-600 text-[0.65rem] md:text-xs leading-relaxed">{description}</p>
            </div>

            {/* All Features */}
            {features.length > 3 && (
              <div className="mb-3 md:mb-4">
                <h4 className="font-medium text-slate-900 mb-1.5 md:mb-2 text-xs md:text-sm">All Features:</h4>
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start text-[0.65rem] md:text-xs">
                      <div className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 mr-1.5 md:mr-2 flex-shrink-0"></div>
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              {client_name && (
                <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-slate-100">
                  <span className="text-[0.65rem] md:text-xs font-medium text-slate-700">Client:</span>
                  <span className="text-[0.65rem] md:text-xs text-slate-600">{client_name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full bg-transparent hover:bg-slate-50 text-[0.65rem] md:text-xs py-2 md:py-2.5 mt-auto transition-all duration-300"
          onClick={toggleExpanded}
        >
          {isExpanded ? (
            <>
              Hide Details
              <ChevronUp className="ml-1 h-2.5 w-2.5 md:h-3 md:w-3 transition-transform duration-300" />
            </>
          ) : (
            <>
              View Details
              <ChevronDown className="ml-1 h-2.5 w-2.5 md:h-3 md:w-3 transition-transform duration-300" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}