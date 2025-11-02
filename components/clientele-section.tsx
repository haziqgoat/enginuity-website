"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const clients = [
  { name: "DBKL", logo: "/dbkl-logo-government-malaysia.jpg" },
  { name: "MBSA", logo: "/mbsa-logo-government-malaysia.jpg" },
  { name: "TNB", logo: "/tnb-tenaga-nasional-logo-malaysia.jpg" },
  { name: "JKR", logo: "/jkr-public-works-logo-malaysia.jpg" },
  { name: "PR1MA", logo: "/pr1ma-logo-malaysia-housing.jpg" },
  { name: "UPNM", logo: "/upnm-university-logo-malaysia.jpg" },
]

export function ClienteleSection() {
  // Scroll animations
  const headerAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 100,
    duration: 800
  })
  
  const logosAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 300,
    duration: 600
  })
  
  const footerAnimation = useScrollAnimation({ 
    animationType: 'fade-up', 
    delay: 500,
    duration: 400
  })
  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50/50">
      <div className="container mx-auto px-4">
        <div ref={headerAnimation.ref} style={headerAnimation.style} className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mb-4">
            Our Partners
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Partnering with leading government agencies and private organizations 
            to deliver exceptional engineering solutions
          </p>
        </div>

        <div ref={logosAnimation.ref} style={logosAnimation.style} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={`${client.name} logo`}
                className="max-h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div ref={footerAnimation.ref} style={footerAnimation.style} className="mt-12 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Delivering engineering excellence to Malaysia's most trusted institutions
          </p>
        </div>
      </div>
    </section>
  )
}
