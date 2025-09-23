import { FeatureCard } from "@/components/feature-card"
import { BarChart3, FileText, MessageSquare, Smartphone } from "lucide-react"

export function FeaturesGrid() {
  const features = [
    {
      icon: BarChart3,
      title: "Project Tracking",
      description: "Monitor project progress in real-time with comprehensive dashboards and timeline management.",
      features: [
        "Real-time progress updates and milestone tracking",
        "Interactive Gantt charts and timeline visualization",
        "Resource allocation and budget monitoring",
        "Automated progress reports and notifications",
        "Risk assessment and mitigation tracking",
      ],
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Centralized storage and management for all project documents, reports, and tender files.",
      features: [
        "Secure cloud storage with version control",
        "Easy upload and download of reports and tenders",
        "Document categorization and tagging system",
        "Advanced search and filtering capabilities",
        "Automated backup and recovery systems",
      ],
    },
    {
      icon: MessageSquare,
      title: "Client Communication Portal",
      description: "Streamlined communication channels for seamless collaboration with clients and stakeholders.",
      features: [
        "Real-time messaging and instant notifications",
        "Video conferencing and virtual meetings",
        "Client feedback and approval workflows",
        "Announcement and update broadcasting",
        "Communication history and audit trails",
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile App Integration",
      description: "Access your projects anywhere with our native iOS and Android mobile applications.",
      features: [
        "Native iOS and Android applications",
        "Offline mode for field work capabilities",
        "Photo and video capture for progress updates",
        "GPS location tracking for site visits",
        "Push notifications for urgent updates",
      ],
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">
            Everything You Need to Manage Construction Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our comprehensive platform provides all the tools and features necessary to streamline your construction
            workflow and improve project outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
