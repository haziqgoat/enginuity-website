import { Card, CardContent } from "@/components/ui/card"
import { Building2, ClipboardList, Mountain, Ship, Zap } from "lucide-react"

const services = [
  {
    icon: Building2,
    title: "Civil & Structural Engineering",
    description: "Comprehensive design and analysis for buildings, bridges, and infrastructure projects",
  },
  {
    icon: ClipboardList,
    title: "Project Management",
    description: "End-to-end project coordination from planning to completion",
  },
  {
    icon: Mountain,
    title: "Geotechnical Engineering",
    description: "Foundation design, soil analysis, and slope stability solutions",
  },
  {
    icon: Ship,
    title: "Marine Works",
    description: "Specialized engineering for coastal and marine infrastructure",
  },
  {
    icon: Zap,
    title: "Mechanical & Electrical",
    description: "M&E services in partnership with certified engineering firms",
  },
]

export function CoreServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional engineering consultancy services across multiple disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
