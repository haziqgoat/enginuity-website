import { Navigation } from "@/components/navigation"
import { FeaturesHero } from "@/components/features-hero"
import { FeaturesGrid } from "@/components/features-grid"
import { IntegrationSection } from "@/components/integration-section"
import { Footer } from "@/components/footer"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <FeaturesHero />
        <FeaturesGrid />
        <IntegrationSection />
      </main>
      <Footer />
    </div>
  )
}
