import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, DollarSign, Users, ExternalLink } from "lucide-react"

interface ProjectCardProps {
  title: string
  description: string
  location: string
  duration: string
  budget: string
  teamSize: number
  status: "completed" | "ongoing" | "planning"
  category: string
  imageUrl: string
  features: string[]
}

export function ProjectCard({
  title,
  description,
  location,
  duration,
  budget,
  teamSize,
  status,
  category,
  imageUrl,
  features,
}: ProjectCardProps) {
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    ongoing: "bg-blue-100 text-blue-800",
    planning: "bg-yellow-100 text-yellow-800",
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <Badge className={statusColors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary">{category}</Badge>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4 text-pretty">{description}</p>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-accent" />
            {location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-accent" />
            {duration}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2 text-accent" />
            {budget}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2 text-accent" />
            {teamSize} team members
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <h4 className="font-semibold text-card-foreground mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></div>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          View Project Details
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
