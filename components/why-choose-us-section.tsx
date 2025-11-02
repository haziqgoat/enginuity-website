"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Laptop, TrendingUp, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

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
  // Scroll animations
  const headerAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 100,
    duration: 800
  })
  
  const cardsAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 300,
    duration: 600
  })
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-transparent to-orange-50/30" />
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-10 transform translate-x-32" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-orange-100 rounded-full opacity-10 transform -translate-x-48" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headerAnimation.ref} style={headerAnimation.style} className="text-center mb-20">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full mb-4">
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Trusted Expertise, Proven Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Two decades of engineering excellence backed by professional credentials 
            and a track record of successful project delivery
          </p>
        </div>

        <div ref={cardsAnimation.ref} style={cardsAnimation.style} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((point, index) => (
            <Card key={index} className="group text-center hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-0 shadow-lg bg-white relative overflow-hidden">
              <CardContent className="p-8 relative">
                {/* Card number indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  {index + 1}
                </div>
                
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <point.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {point.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{point.description}</p>
                
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
