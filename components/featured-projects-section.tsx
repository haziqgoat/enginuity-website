import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, MapPin, DollarSign } from "lucide-react"

const projects = [
  {
    title: "Smart Community Hall Ara Damansara",
    location: "Petaling Jaya, Selangor",
    budget: "RM 7.0 Million",
    status: "Construction Stage (35%)",
    category: "Community Infrastructure",
    image: "/modern-community-hall-building-construction.jpg",
  },
  {
    title: "DBKL Council Homes Sentul",
    location: "Kuala Lumpur",
    budget: "RM 40.0 Million",
    status: "Construction Stage (80%)",
    category: "Residential",
    image: "/modern-high-rise-residential-building-construction.jpg",
  },
  {
    title: "PR1MA Bukit Jalil Development",
    location: "Kuala Lumpur",
    budget: "RM 150.0 Million",
    status: "Completed",
    category: "Mixed Development",
    image: "/completed-modern-apartment-complex.jpg",
  },
  {
    title: "Flood Mitigation Project Sg. Pinang",
    location: "Klang, Selangor",
    budget: "RM 10.0 Million",
    status: "Construction Stage (45%)",
    category: "Infrastructure",
    image: "/flood-mitigation-infrastructure-construction.jpg",
  },
]

export function FeaturedProjectsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Showcasing our expertise across diverse engineering projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {projects.map((project, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-video bg-gray-200">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {project.category}
                  </Badge>
                  <Badge
                    variant={project.status.includes("Completed") ? "default" : "outline"}
                    className={project.status.includes("Completed") ? "bg-green-100 text-green-800" : ""}
                  >
                    {project.status}
                  </Badge>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {project.budget}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Explore All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
