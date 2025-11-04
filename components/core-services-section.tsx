"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ClipboardList, Mountain, Ship, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [servicesPerPage, setServicesPerPage] = useState(3)

  // Set initial services per page based on screen size
  useEffect(() => {
    const updateServicesPerPage = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setServicesPerPage(1)
        } else if (window.innerWidth < 768) {
          setServicesPerPage(2)
        } else {
          setServicesPerPage(3)
        }
      }
    }

    updateServicesPerPage()
    window.addEventListener('resize', updateServicesPerPage)
    return () => window.removeEventListener('resize', updateServicesPerPage)
  }, [])

  const maxIndex = services.length - servicesPerPage

  // Scroll animations for different elements
  const headerAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 100,
    duration: 800
  })
  
  const carouselAnimation = useScrollAnimation({ 
    animationType: 'scale', 
    delay: 300,
    duration: 600
  })
  
  const controlsAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 500,
    duration: 500
  })

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const canGoNext = currentIndex < maxIndex
  const canGoPrev = currentIndex > 0

  return (
    <section id="services" className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4">
        <div ref={headerAnimation.ref} style={headerAnimation.style} className="text-center mb-8 md:mb-12">
          <div className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
            What We Do
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Our Core Services
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Professional engineering consultancy services across multiple disciplines, 
            delivered with precision and excellence
          </p>
        </div>

        <div ref={carouselAnimation.ref} style={carouselAnimation.style} className="relative max-w-6xl mx-auto px-4">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / servicesPerPage)}%)`
              }}
            >
              {services.map((service, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                  <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-md bg-white h-full">
                    <CardContent className="p-6 text-center relative overflow-hidden h-full flex flex-col">
                      <div className="flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                          <service.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls - Positioned between cards */}
          <div className="flex items-center justify-center mt-8">
            {/* Previous Button */}
            <Button
              onClick={prevSlide}
              variant="outline"
              size="sm"
              className={`w-8 h-8 rounded-full p-0 bg-white shadow-md hover:bg-blue-50 border-blue-200 transition-all duration-300 mr-4 ${
                !canGoPrev ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
              disabled={!canGoPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Progress Indicators */}
            <div ref={controlsAnimation.ref} style={controlsAnimation.style} className="flex justify-center items-center gap-1">
              {Array.from({ length: maxIndex + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-blue-600 w-3' 
                      : 'bg-gray-300 hover:bg-gray-400 w-1'
                  }`}
                />
              ))}
            </div>
            
            {/* Next Button */}
            <Button
              onClick={nextSlide}
              variant="outline"
              size="sm"
              className={`w-8 h-8 rounded-full p-0 bg-white shadow-md hover:bg-blue-50 border-blue-200 transition-all duration-300 ml-4 ${
                !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'
              }`}
              disabled={!canGoNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Service Counter */}
          <div className="text-center text-xs text-gray-500 mt-3">
            {Math.min(currentIndex + servicesPerPage, services.length)} of {services.length} services
          </div>
        </div>
      </div>
    </section>
  )
}