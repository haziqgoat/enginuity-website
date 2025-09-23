"use client"

import { useState } from "react"
import { CareersHero } from "@/components/careers-hero"
import { JobCard } from "@/components/job-card"
import { ApplicationForm } from "@/components/application-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Zap, Heart } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

const jobOpenings = [
  {
    id: 1,
    title: "Civil Engineer - Project Management",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "Fresh Graduate - 2 Years",
    description:
      "Join our project management team to oversee construction projects from planning to completion. Work with clients, contractors, and stakeholders to ensure successful project delivery.",
    requirements: [
      "Bachelor's degree in Civil Engineering or related field",
      "Knowledge of construction project management principles",
      "Understanding of building codes, regulations, and safety standards",
      "Proficiency in AutoCAD, project management software",
      "Fresh graduates with strong academic performance are welcome",
    ],
  },
  {
    id: 2,
    title: "Structural Engineer",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "Fresh Graduate - 2 Years",
    description:
      "Design and analyze structural systems for residential, commercial, and industrial projects. Ensure structural integrity and compliance with Malaysian building standards.",
    requirements: [
      "Bachelor's degree in Civil/Structural Engineering",
      "Knowledge of structural analysis and design principles",
      "Familiarity with design software (STAAD Pro, ETABS, SAP2000)",
      "Understanding of Malaysian building codes (MS standards)",
      "Strong analytical and problem-solving skills",
    ],
  },
  {
    id: 3,
    title: "Construction Site Supervisor",
    department: "Operations",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "Fresh Graduate - 1 Year",
    description:
      "Supervise daily construction activities, ensure quality control, and maintain safety standards on construction sites. Coordinate with contractors and report project progress.",
    requirements: [
      "Diploma/Bachelor's degree in Civil Engineering, Construction Management, or related field",
      "Knowledge of construction methods and materials",
      "Understanding of safety regulations and quality control",
      "Strong leadership and communication skills",
      "Willingness to work on-site and travel to project locations",
    ],
  },
  {
    id: 4,
    title: "Quantity Surveyor",
    department: "Commercial",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "Fresh Graduate - 1 Year",
    description:
      "Manage project costs, prepare tender documents, and conduct cost analysis for construction projects. Work closely with clients and contractors on commercial aspects.",
    requirements: [
      "Bachelor's degree in Quantity Surveying, Construction Management, or related field",
      "Knowledge of construction cost estimation and contract administration",
      "Familiarity with measurement and billing procedures",
      "Understanding of construction contracts and procurement",
      "Strong numerical and analytical skills",
    ],
  },
  {
    id: 5,
    title: "Building Services Engineer (M&E)",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "Fresh Graduate - 2 Years",
    description:
      "Design and coordinate mechanical and electrical systems for buildings. Ensure efficient and sustainable building services integration in construction projects.",
    requirements: [
      "Bachelor's degree in Mechanical, Electrical, or Building Services Engineering",
      "Knowledge of HVAC, electrical, and plumbing systems",
      "Familiarity with building services design software",
      "Understanding of energy efficiency and sustainability principles",
      "Interest in green building technologies and certifications",
    ],
  },
  {
    id: 6,
    title: "Construction Technology Specialist",
    department: "Technology",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "Fresh Graduate - 1 Year",
    description:
      "Bridge the gap between construction and technology by implementing digital solutions for project management, BIM coordination, and construction automation.",
    requirements: [
      "Bachelor's degree in Civil Engineering, Construction Management, or Computer Science",
      "Interest in construction technology and digital transformation",
      "Knowledge of BIM software (Revit, Navisworks) is advantageous",
      "Understanding of project management software and digital tools",
      "Strong problem-solving skills and adaptability to new technologies",
    ],
  },
]

const benefits = [
  {
    icon: Users,
    title: "Collaborative Team",
    description: "Work with passionate professionals in a supportive environment",
  },
  {
    icon: Award,
    title: "Career Growth",
    description: "Continuous learning opportunities and clear career progression paths",
  },
  {
    icon: Zap,
    title: "Innovation Focus",
    description: "Work on cutting-edge technology that transforms the construction industry",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "Flexible working arrangements and comprehensive benefits package",
  },
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle)
  }

  const handleCloseApplication = () => {
    setSelectedJob(null)
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <CareersHero />

      {/* Why Join Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join Enginuity?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Be part of a team that's revolutionizing how construction projects are managed and executed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <benefit.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="job-openings" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Current Openings</h2>
            <p className="text-xl text-muted-foreground">Find your perfect role and start your career with us</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobOpenings.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                type={job.type}
                experience={job.experience}
                description={job.description}
                requirements={job.requirements}
                onApply={() => handleApply(job.title)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Graduate Program Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Graduate Development Program</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-foreground/90">
            Our comprehensive 12-month program is designed to fast-track your career with mentorship, training, and
            hands-on experience across different departments.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Mentorship Program
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Technical Training
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Cross-Department Rotation
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Industry Certifications
            </Badge>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      {selectedJob && <ApplicationForm jobTitle={selectedJob} onClose={handleCloseApplication} />}

      <Footer />
    </div>
  )
}
