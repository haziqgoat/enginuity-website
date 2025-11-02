import { HnzHeroSection } from "@/components/hnz-hero-section"
import { CoreServicesSection } from "@/components/core-services-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { ClienteleSection } from "@/components/clientele-section"
import { ContactQuickAccess } from "@/components/contact-quick-access"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <main>
        <HnzHeroSection />
        <CoreServicesSection />
        <WhyChooseUsSection />
        <ClienteleSection />
        <ContactQuickAccess />
      </main>
      <Footer />
    </div>
  )
}