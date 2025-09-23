import { Building2, Clock, Users, Zap } from "lucide-react"

export function FeaturesHero() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-card-foreground mb-6 text-balance">
          Powerful Features for Modern Construction
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 text-pretty">
          Discover how Enginuity's comprehensive platform streamlines every aspect of your construction projects, from
          initial planning to final delivery.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">500+</div>
            <div className="text-muted-foreground">Projects Managed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
              <Clock className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">40%</div>
            <div className="text-muted-foreground">Time Saved</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">1000+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
              <Zap className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  )
}
