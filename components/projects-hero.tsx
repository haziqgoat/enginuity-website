import { Building2, MapPin, Calendar } from "lucide-react"

export function ProjectsHero() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-card-foreground mb-6 text-balance">
            Our Project Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Explore our successful construction projects managed through the Enginuity platform. From residential
            complexes to commercial developments, see how we deliver excellence.
          </p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-2">150+</div>
            <div className="text-muted-foreground">Completed Projects</div>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
              <MapPin className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-2">25+</div>
            <div className="text-muted-foreground">Cities Covered</div>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground mb-2">98%</div>
            <div className="text-muted-foreground">On-Time Delivery</div>
          </div>
        </div>
      </div>
    </section>
  )
}
