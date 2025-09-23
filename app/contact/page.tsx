import { Navigation } from "@/components/navigation"
import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { MapSection } from "@/components/map-section"
import { ContactCTA } from "@/components/contact-cta"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ContactHero />
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>
        <MapSection />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}
