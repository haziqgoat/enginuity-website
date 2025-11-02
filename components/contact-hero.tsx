import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function ContactHero() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-card-foreground mb-6 text-balance">Get In Touch</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Ready to transform your construction projects? Contact us today to learn how HNZ Consult can help streamline
            your operations and improve project outcomes.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-4">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Office Location</h3>
            <p className="text-muted-foreground text-sm text-pretty">
              96B, Tingkat 2, Jalan Pelabur A/23A
              <br />
              Seksyen 23, 40200 Shah Alam
              <br />
              Selangor, Malaysia
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full mx-auto mb-4">
              <Phone className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Phone Number</h3>
            <p className="text-muted-foreground text-sm">
              +60 3-5541 2054
              <br />
              Office Hours Only
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-4">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Email Address</h3>
            <p className="text-muted-foreground text-sm">
              hnzconsult@yahoo.com
              <br />
              General Inquiries
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-accent rounded-full mx-auto mb-4">
              <Clock className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-card-foreground mb-2">Business Hours</h3>
            <p className="text-muted-foreground text-sm">
              Mon - Fri: 9:00 AM - 6:00 PM
              <br />
              Sat: 9:00 AM - 1:00 PM
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
