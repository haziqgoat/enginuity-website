"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"

interface JobCardProps {
  title: string
  department: string
  location: string
  type: string
  experience: string
  description: string
  requirements: string[]
  onApply: () => void
  showManagement?: boolean // New prop to indicate if management buttons should be shown
}

export function JobCard({
  title,
  department,
  location,
  type,
  experience,
  description,
  requirements,
  onApply,
  showManagement = false,
}: JobCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="flex-shrink-0 p-4 md:p-6">
        <div className={`flex justify-between items-start mb-2 transition-all duration-200 ${
          showManagement ? 'group-hover:pr-8 md:group-hover:pr-10' : ''
        }`}>
          <Badge variant="secondary" className="text-[0.65rem] md:text-xs">{department}</Badge>
          <Badge variant="outline" className="text-[0.65rem] md:text-xs">{type}</Badge>
        </div>
        <CardTitle className="text-lg md:text-xl mb-2">{title}</CardTitle>
        <CardDescription className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs md:text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 md:h-4 md:w-4" />
            {experience}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4 md:p-6 pt-0 md:pt-0">
        <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">{description}</p>
        <div className="mb-4 md:mb-6 flex-1">
          <h4 className="font-semibold mb-2 text-sm md:text-base">Requirements:</h4>
          <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
            {requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="flex items-start gap-1.5 md:gap-2">
                <span className="text-accent mt-1 text-[0.5rem] md:text-xs">•</span>
                <span className="line-clamp-2">{req}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={onApply} className="w-full mt-auto text-sm md:text-base py-2 md:py-2.5">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  )
}
