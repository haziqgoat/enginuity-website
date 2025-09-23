import { Navigation } from "@/components/navigation"
import { ProjectsHero } from "@/components/projects-hero"
import { ProjectsGrid } from "@/components/projects-grid"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ProjectsHero />
        <ProjectsGrid />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
