import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HnzHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/modern-construction-site-with-cranes-and-buildings.jpg')",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(30, 64, 175, 0.85))",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: "#ffffff" }}>
          HNZ Consult Sdn Bhd
        </h1>
        <p className="text-xl md:text-2xl mb-8" style={{ color: "#e0e7ff" }}>
          Civil & Structural Consulting Engineers & Project Managers
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="px-8 py-3"
            style={{
              backgroundColor: "#f97316",
              color: "#ffffff",
              border: "none",
            }}
          >
            Our Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-3 bg-transparent"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              borderColor: "#ffffff",
              backdropFilter: "blur(10px)",
            }}
          >
            View Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
