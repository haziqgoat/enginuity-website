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
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Client Testimonials</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted by construction professionals across Malaysia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-slate-600 mb-4 text-sm leading-relaxed">"{testimonial.content}"</blockquote>
                <div className="border-t border-slate-100 pt-4">
                  <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                  <div className="text-xs text-slate-500">{testimonial.position}</div>
                  <div className="text-xs text-blue-600 font-medium">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
