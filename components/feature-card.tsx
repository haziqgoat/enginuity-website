import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

export function FeatureCard({ icon: Icon, title, description, features }: FeatureCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-card-foreground mb-4 text-center">{title}</h3>
        <p className="text-muted-foreground mb-6 text-center text-pretty">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
