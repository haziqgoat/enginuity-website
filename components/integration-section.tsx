import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layers, Shield, Zap } from "lucide-react"

export function IntegrationSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">
            Built for Enterprise-Grade Performance
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Enginuity is designed with security, scalability, and reliability at its core to meet the demands of modern
            construction enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">Enterprise Security</h3>
              <p className="text-muted-foreground text-pretty">
                Bank-level encryption, role-based access control, and compliance with industry security standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-6">
                <Layers className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">Seamless Integration</h3>
              <p className="text-muted-foreground text-pretty">
                Connect with existing tools and systems through our comprehensive API and integration platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground text-pretty">
                Optimized performance with cloud infrastructure that scales with your business needs.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Ready to Transform Your Construction Projects?</h3>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-pretty">
                Join hundreds of construction companies already using Enginuity to streamline their operations and
                deliver projects on time and within budget.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Schedule Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
