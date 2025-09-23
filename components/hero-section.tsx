"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Smartphone, FileText, MessageSquare } from "lucide-react"

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #1e3a8a, #1e40af)",
        color: "#ffffff",
        minHeight: "100vh",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rotate-45"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border-2 border-white rotate-12"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white -rotate-12"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 border-2 border-white rotate-45"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance" style={{ color: "#ffffff" }}>
              Building Smarter with <span style={{ color: "#fb923c" }}>Enginuity</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-pretty" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Transform your construction projects with our comprehensive platform for project tracking, document
              management, and seamless client communication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="text-lg px-8 py-3" style={{ backgroundColor: "#f97316", color: "#ffffff" }}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 bg-transparent"
                style={{
                  borderColor: "#ffffff",
                  color: "#ffffff",
                  backgroundColor: "rgba(30, 58, 138, 0.8)",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 58, 138, 0.8)"
                }}
              >
                Request Demo
              </Button>
            </div>
          </div>

          {/* Hero Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div
              className="backdrop-blur-sm rounded-lg p-6 text-center border"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Building2 className="h-12 w-12 mx-auto mb-4" style={{ color: "#fb923c" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>
                Project Tracking
              </h3>
              <p className="text-sm" style={{ color: "#e2e8f0" }}>
                Real-time progress monitoring
              </p>
            </div>
            <div
              className="backdrop-blur-sm rounded-lg p-6 text-center border"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: "#fb923c" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>
                Document Management
              </h3>
              <p className="text-sm" style={{ color: "#e2e8f0" }}>
                Centralized file storage
              </p>
            </div>
            <div
              className="backdrop-blur-sm rounded-lg p-6 text-center border"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: "#fb923c" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>
                Client Communication
              </h3>
              <p className="text-sm" style={{ color: "#e2e8f0" }}>
                Seamless collaboration
              </p>
            </div>
            <div
              className="backdrop-blur-sm rounded-lg p-6 text-center border"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.6)",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Smartphone className="h-12 w-12 mx-auto mb-4" style={{ color: "#fb923c" }} />
              <h3 className="font-semibold mb-2" style={{ color: "#ffffff" }}>
                Mobile Access
              </h3>
              <p className="text-sm" style={{ color: "#e2e8f0" }}>
                iOS & Android apps
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
