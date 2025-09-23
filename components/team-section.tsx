import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Mail } from "lucide-react"

export function TeamSection() {
  const teamMembers = [
    {
      name: "Ir. Hj. Zainal Mukri bin Md. Mustaffa",
      position: "Managing Director",
      company: "HNZ Consult Sdn. Bhd.",
      bio: "Professional Engineer with 25+ years experience. B.Eng (Hons) Civil Engineering from UTM. P.Eng (12487), MIEM (26908).",
      image: "/professional-malaysian-ceo-construction-technology.jpg",
    },
    {
      name: "Ir. Hj. Nor Azmee bin Idris",
      position: "Director",
      company: "HNZ Consult Sdn. Bhd.",
      bio: "Professional Engineer with 31+ years experience. B.Eng (Hons) Civil Engineering from UTM. P.Eng (11144), specializing in infrastructure and structural works.",
      image: "/professional-asian-male-software-engineer.jpg",
    },
    {
      name: "Ir. Hj. Abdul Ghani Shaaban",
      position: "Associate Director",
      company: "HNZ Consult Sdn. Bhd.",
      bio: "MSc Foundation Engineering from University of Birmingham, UK. 40+ years experience in geotechnical engineering. P.Eng (C113711), MIEM (M34412).",
      image: "/professional-malaysian-engineer-construction-consu.jpg",
    },
    {
      name: "Muhammad Shaifull Izwan B. Ab Hamid",
      position: "Civil Engineer",
      company: "HNZ Consult Sdn. Bhd.",
      bio: "B.Eng (Hons) Civil Engineering from UPM (2010). Experienced in structural design and project management.",
      image: "/professional-asian-male-software-engineer.jpg",
    },
    {
      name: "Mohd. Hafindze Bin Zulkifli",
      position: "Civil Engineer",
      company: "HNZ Consult Sdn. Bhd.",
      bio: "B.Eng (Hons) Civil Engineering from UiTM (2017). Specializes in infrastructure and building engineering projects.",
      image: "/professional-malaysian-engineer-construction-consu.jpg",
    },
    {
      name: "Nor Zalina Binti Zakaria",
      position: "Building Engineer",
      company: "HNZ Consult Sdn. Bhd.",
      bio: "B.Eng (Hons) Building Engineering from UNIMAP (2013). Expert in building design and construction management.",
      image: "/professional-malaysian-female-project-consultant.jpg",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Meet Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our diverse team combines deep construction industry expertise with cutting-edge technology skills to
            deliver innovative solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square bg-muted">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-card-foreground mb-1">{member.name}</h3>
                <p className="text-accent font-medium mb-1">{member.position}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.company}</p>
                <p className="text-muted-foreground text-sm mb-4 text-pretty">{member.bio}</p>
                <div className="flex space-x-3">
                  <button className="p-2 bg-primary rounded-full hover:bg-primary/80 transition-colors">
                    <Linkedin className="h-4 w-4 text-primary-foreground" />
                  </button>
                  <button className="p-2 bg-accent rounded-full hover:bg-accent/80 transition-colors">
                    <Mail className="h-4 w-4 text-accent-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
