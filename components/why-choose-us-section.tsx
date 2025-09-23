import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Laptop, TrendingUp } from "lucide-react"

const trustPoints = [
  {
    icon: Users,
    title: "20+ Years Experience",
    description: "Decades of proven expertise in civil and structural engineering projects across Malaysia",
  },
  {
    icon: Award,
    title: "Registered with BEM",
    description: "Fully certified and registered with the Board of Engineers Malaysia (BEM)",
  },
  {
    icon: Laptop,
    title: "Advanced Design Software",
    description: "Utilizing cutting-edge tools including ESTEEM, PROKON, AutoCAD, and specialized engineering software",
  },
  {
    icon: TrendingUp,
    title: "Strong Track Record",
    description: "Successful delivery of government and private sector projects worth over RM500 million",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Clients Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted expertise backed by professional credentials and proven results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <point.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{point.title}</h3>
                <p className="text-sm text-gray-600">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
