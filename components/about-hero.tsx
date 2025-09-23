import { Building2, Users, Award, Target } from "lucide-react"

export function AboutHero() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-card-foreground mb-6 text-balance">About Enginuity</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Revolutionizing construction project management through innovative technology solutions, developed in
            collaboration with HNZ Consult Sdn. Bhd.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">5+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
              <Users className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">50+</div>
            <div className="text-muted-foreground">Team Members</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-4">
              <Award className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">15+</div>
            <div className="text-muted-foreground">Industry Awards</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-4">
              <Target className="h-8 w-8 text-accent-foreground" />
            </div>
            <div className="text-3xl font-bold text-card-foreground">98%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
