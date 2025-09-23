import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Image
                src="/hnz-main-logo.png"
                alt="HNZ Consult Sdn Bhd"
                width={200}
                height={45}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              HNZ Consult Sdn. Bhd. is revolutionizing construction project management with innovative technology
              solutions through our Enginuity platform.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-accent" />
                <span className="text-sm">hnzconsult@yahoo.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-accent" />
                <span className="text-sm">+60 3-5541 2054</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-accent" />
                <span className="text-sm">Shah Alam, Selangor, Malaysia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">© 2024 HNZ Consult Sdn. Bhd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
