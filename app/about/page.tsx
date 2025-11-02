import { AboutHero } from "@/components/about-hero"
import { CompanyStory } from "@/components/company-story"
import { TeamSection } from "@/components/team-section"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main>
        <AboutHero />
        <CompanyStory />
        <TeamSection />
      </main>
      <Footer />
    </div>
  )
}