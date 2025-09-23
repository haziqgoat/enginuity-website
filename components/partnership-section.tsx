import { Card, CardContent } from "@/components/ui/card"
import { Building, Users, Handshake } from "lucide-react"
import Image from "next/image"

export function PartnershipSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Our Partnership</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            The collaboration between Enginuity and HNZ Consult Sdn. Bhd. combines technological innovation with deep
            industry expertise.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Partnership Content */}
          <div>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-4">
                    <Image src="/hnz-logo.png" alt="HNZ Consult Sdn Bhd Logo" width={80} height={40} className="mr-3" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">HNZ Consult Sdn. Bhd.</h3>
                  </div>
                </div>
                <p className="text-primary-foreground/90 mb-6 text-pretty">
                  Established in 2010, HNZ Consult is a premier construction consultancy firm with extensive experience
                  in project management, engineering solutions, and construction oversight across Malaysia.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    <span>15+ years of construction industry expertise</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    <span>200+ successful project consultations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    <span>Certified project management professionals</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Partnership Benefits */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mr-4 flex-shrink-0">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Industry Expertise</h4>
                    <p className="text-muted-foreground text-pretty">
                      Deep understanding of construction workflows, challenges, and best practices gained through years
                      of hands-on experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full mr-4 flex-shrink-0">
                    <Handshake className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Collaborative Innovation</h4>
                    <p className="text-muted-foreground text-pretty">
                      Combining technological innovation with practical industry knowledge to create solutions that
                      actually work in real-world scenarios.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mr-4 flex-shrink-0">
                    <Building className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-2">Proven Results</h4>
                    <p className="text-muted-foreground text-pretty">
                      Our partnership has delivered measurable improvements in project efficiency, communication, and
                      client satisfaction across numerous projects.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
