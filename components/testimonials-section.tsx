import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dato' Ahmad Rashid",
      position: "Project Director",
      company: "Perbadanan Kemajuan Negeri Selangor (PKNS)",
      content:
        "HNZ Consult's expertise in residential development projects has been exceptional. Their work on our housing schemes in Shah Alam consistently meets the highest standards.",
      rating: 5,
    },
    {
      name: "Ir. Siti Aminah",
      position: "Chief Engineer",
      company: "Jabatan Kerja Raya Malaysia",
      content:
        "Their geotechnical and slope repair expertise is outstanding. HNZ Consult has successfully completed multiple challenging infrastructure projects for JKR with excellent results.",
      rating: 5,
    },
    {
      name: "En. Lim Wei Ming",
      position: "Development Manager",
      company: "Dewan Bandaraya Kuala Lumpur",
      content:
        "From high-rise residential projects to community facilities, HNZ Consult delivers quality engineering solutions. Their 21-storey council housing project in Sentul exceeded our expectations.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Hear from construction professionals who have experienced the benefits of using HNZ Consult for their
            projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 text-pretty">"{testimonial.content}"</blockquote>
                <div className="border-t pt-4">
                  <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                  <div className="text-sm text-accent font-medium">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
