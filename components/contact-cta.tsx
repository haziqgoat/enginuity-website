import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, Phone } from "lucide-react"

export function ContactCTA() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Choose the best way to connect with our team and discover how this platform can transform your construction
            projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">Schedule a Demo</h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                Book a personalized demo to see how HNZ Consult can streamline your construction projects.
              </p>
              <Button className="w-full">Book Demo</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-accent rounded-full mx-auto mb-6">
                <Phone className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">Call Us Now</h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                Speak directly with our experts to discuss your specific requirements and get immediate answers.
              </p>
              <Button variant="secondary" className="w-full">
                +60 3-5541 2054
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-4">Live Chat</h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                Start a conversation with our support team for quick questions and immediate assistance.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
