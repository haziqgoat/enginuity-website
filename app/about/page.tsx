import { Navigation } from "@/components/navigation"
import { AboutHero } from "@/components/about-hero"
import { CompanyStory } from "@/components/company-story"
import { PartnershipSection } from "@/components/partnership-section"
import { TeamSection } from "@/components/team-section"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <AboutHero />
        <CompanyStory />
        <PartnershipSection />
        <TeamSection />
      </main>
      <Footer />
    </div>
  )
}
