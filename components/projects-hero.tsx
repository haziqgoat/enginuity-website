import Link from "next/link"
import { Building2, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProjectsHero() {
  // Project statistics data
  const projectStats = [
    {
      icon: Building2,
      value: "150+",
      label: "Completed Projects",
      bgColor: "bg-blue-600"
    },
    {
      icon: MapPin,
      value: "25+",
      label: "Cities Covered",
      bgColor: "bg-blue-600"
    },
    {
      icon: Calendar,
      value: "98%",
      label: "On-Time Delivery",
      bgColor: "bg-blue-600"
    }
  ]

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Main Header */}
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Our Project Portfolio
          </h1>
          
          {/* Description */}
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Delivering excellence in construction and engineering across Malaysia.
            From residential complexes to industrial facilities.
          </p>
          
          {/* Project Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {projectStats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg p-6 text-center shadow-sm border border-slate-200"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Cost Planner CTA */}
          <div className="pt-8 bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-xl border border-blue-100 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Estimate Your Project Costs</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Get an instant cost estimate for your engineering project with our AI-powered cost planner.
            </p>
            <Link href="/cost-planner">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm">
                Try Our Cost Estimator Tool
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}