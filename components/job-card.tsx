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
}: JobCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{department}</Badge>
          <Badge variant="outline">{type}</Badge>
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {experience}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={onApply} className="w-full">
          Apply Now
        </Button>
      </CardContent>
    </Card>
  )
}
