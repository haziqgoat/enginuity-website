"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from "next/link"

export function ContactQuickAccess() {
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
  
  const ctaAnimation = useScrollAnimation({ 
    animationType: 'scale', 
    delay: 500,
    duration: 400
  })
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full transform translate-x-48 -translate-y-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full transform -translate-x-32 translate-y-32" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={headerAnimation.ref} style={headerAnimation.style} className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Start Your Project Today
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Ready to bring your engineering vision to life? Contact our expert team 
            for a consultation tailored to your project needs.
          </p>
        </div>

        <div ref={cardsAnimation.ref} style={cardsAnimation.style} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Visit Our Office</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                96B, Tingkat 2, Jalan Pelabur A/23A,<br />
                Seksyen 23, 40200 Shah Alam, Selangor
              </p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-blue-200">• Easy parking available</div>
                <div className="text-xs text-blue-200">• Accessible by public transport</div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Call Us Now</h3>
              <p className="text-blue-100 text-lg font-semibold">+60 3-5541 2054</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-blue-200">• Available Mon-Fri 9AM-6PM</div>
                <div className="text-xs text-blue-200">• Emergency support available</div>
              </div>
            </CardContent>
          </Card>

          <Card className="group bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Email Us</h3>
              <p className="text-blue-100 text-sm">hnzconsult@yahoo.com</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-blue-200">• Quick response guaranteed</div>
                <div className="text-xs text-blue-200">• Detailed project discussions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div ref={ctaAnimation.ref} style={ctaAnimation.style} className="text-center">
          <Link href="/contact" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-105 shadow-lg inline-flex items-center">
            Contact Us Today
            <ArrowRight className="ml-2 h-5 w-5 inline" />
          </Link>
        </div>
      </div>
    </section>
  )
}