import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Rocket, Globe, Shield } from "lucide-react"

export function CompanyStory() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Story Content */}
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="text-lg text-pretty">
                HNZ Consult was originally founded in 2008, with HNZ Consult Sdn. Bhd. being incorporated in 2013. The
                company was formed in line with the government's call for more body corporate professional engineer's
                firms.
              </p>
              <p className="text-lg text-pretty">
                Our Management Team consists of Professional Engineers with more than 20 years of working experience in
                contract work of construction projects as well as Engineering Consultancy. We recognized the need for a
                comprehensive, modern solution to bridge traditional construction practices with innovative technology.
              </p>
              <p className="text-lg text-pretty">
                Today, HNZ Consult serves construction companies across Malaysia, providing professional engineering
                consultancy in Civil & Structural, Project Management, Geotechnical, M&E, and Marine Works, helping
                clients deliver projects more efficiently and achieve better outcomes.
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Continuously pushing boundaries with cutting-edge technology
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full mx-auto mb-4">
                  <Rocket className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Delivering superior quality in every aspect of our platform
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-4">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Collaboration</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Building bridges between teams, clients, and stakeholders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full mx-auto mb-4">
                  <Shield className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2">Reliability</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Providing dependable solutions you can trust
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
