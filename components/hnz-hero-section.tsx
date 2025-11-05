"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Award, Users, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export function HnzHeroSection() {
  const router = useRouter()
  
  // Function to scroll to services section with modern animation
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services')
    if (servicesSection) {
      // Calculate the offset to account for the fixed navigation
      const navHeight = 80 // Height of the navigation bar
      const targetPosition = servicesSection.offsetTop - navHeight
      
      // Add a subtle loading effect to the button
      const button = document.querySelector('[data-scroll="services"]') as HTMLElement
      if (button) {
        button.style.transform = 'scale(0.95)'
        button.style.transition = 'transform 150ms ease-out'
        
        setTimeout(() => {
          button.style.transform = 'scale(1)'
        }, 150)
      }
      
      // Modern smooth scroll with easing
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      
      // Add a sophisticated highlight effect
      setTimeout(() => {
        servicesSection.style.transform = 'translateY(-4px)'
        servicesSection.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.15)'
        servicesSection.style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)'
        
        // Reset the effects after animation
        setTimeout(() => {
          servicesSection.style.transform = 'translateY(0)'
          servicesSection.style.boxShadow = ''
          setTimeout(() => {
            servicesSection.style.transition = ''
          }, 600)
        }, 800)
      }, 400)
    }
  }
  
  // Function to navigate to projects with smooth transition
  const navigateToProjects = () => {
    // Add a subtle loading effect
    const button = document.querySelector('[data-navigate="projects"]') as HTMLElement
    if (button) {
      button.style.transform = 'scale(0.95)'
      button.style.transition = 'transform 150ms ease-out'
      
      setTimeout(() => {
        button.style.transform = 'scale(1)'
        router.push('/projects')
      }, 150)
    } else {
      router.push('/projects')
    }
  }
  
  // Function to navigate to cost planner
  const navigateToCostPlanner = () => {
    // Add a subtle loading effect
    const button = document.querySelector('[data-navigate="cost-planner"]') as HTMLElement
    if (button) {
      button.style.transform = 'scale(0.95)'
      button.style.transition = 'transform 150ms ease-out'
      
      setTimeout(() => {
        button.style.transform = 'scale(1)'
        router.push('/cost-planner')
      }, 150)
    } else {
      router.push('/cost-planner')
    }
  }
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
        style={{
          backgroundImage: "url('/modern-construction-site-with-cranes-and-buildings.jpg')",
        }}
      />
      
      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-800/95" />
      
      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 border border-white/10 rotate-45 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 md:w-32 md:h-32 border border-orange-400/20 rotate-12 animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-8 h-8 md:w-16 md:h-16 bg-orange-400/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Modern company title */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-white via-blue-100 to-orange-200 bg-clip-text text-transparent leading-tight">
            HNZ Consult
          </h1>
          <div className="text-xl md:text-2xl lg:text-3xl font-light text-blue-100 mb-2">
            Sdn Bhd
          </div>
          <div className="w-16 h-1 md:w-24 md:h-1 bg-gradient-to-r from-orange-400 to-blue-400 mx-auto mb-4 md:mb-6 rounded-full" />
        </div>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-blue-100 font-light max-w-4xl mx-auto leading-relaxed">
          Civil & Structural Consulting Engineers & Project Managers
        </p>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-full mx-auto mb-2 md:mb-3">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">150+</div>
            <div className="text-xs md:text-sm text-blue-200">Projects</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-full mx-auto mb-2 md:mb-3">
              <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">12+</div>
            <div className="text-xs md:text-sm text-blue-200">Years</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-full mx-auto mb-2 md:mb-3">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">50+</div>
            <div className="text-xs md:text-sm text-blue-200">Experts</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/20">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-full mx-auto mb-2 md:mb-3">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white">98%</div>
            <div className="text-xs md:text-sm text-blue-200">On Time</div>
          </div>
        </div>
        
        {/* Modern CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Button
            size="lg"
            onClick={scrollToServices}
            data-scroll="services"
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Our Services
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={navigateToProjects}
            data-navigate="projects"
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            View Projects
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={navigateToCostPlanner}
            data-navigate="cost-planner"
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Cost Planner
          </Button>
        </div>
      </div>
    </section>
  )
}
