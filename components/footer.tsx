import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/certifications", label: "Certifications" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/hnz-main-logo.png"
                alt="HNZ Consult Sdn Bhd"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-sm">
              Civil & Structural Consulting Engineers delivering professional engineering solutions across Malaysia.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-accent mt-0.5 flex-shrink-0" />
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hnzconsult@yahoo.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline cursor-pointer text-sm"
                >
                  hnzconsult@yahoo.com
                </a>
              </div>
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">+60 3-5541 2054</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  96B, Tingkat 2, Jalan Pelabur A/23A,<br />
                  Seksyen 23, 40200 Shah Alam, Selangor
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary-foreground/80 hover:text-accent transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">© 2024 HNZ Consult Sdn Bhd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}