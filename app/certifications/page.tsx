import { Footer } from "@/components/footer"
import { CertificationCard } from "@/components/certification-card"
import { Award, HardHat, Shield } from "lucide-react"

export default function CertificationsPage() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 text-white"
          style={{ minHeight: "60vh" }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rotate-45"></div>
            <div className="absolute top-32 right-20 w-24 h-24 border-2 border-white rotate-12"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 border-2 border-white -rotate-12"></div>
            <div className="absolute bottom-32 right-1/3 w-20 h-20 border-2 border-white rotate-45"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Certifications & Professional <span className="text-blue-300">Registrations</span>
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100">
                HNZ Consult Sdn. Bhd. is fully registered and recognized by professional engineering bodies and government agencies in Malaysia.
              </p>
            </div>
          </div>
        </section>
        
        {/* Certification Content Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Official Registrations
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                Our company upholds the highest engineering standards through official registrations and certifications by recognized authorities in Malaysia.
              </p>
            </div>
            
            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CertificationCard 
                title="Perakuan Pendaftaran Sebagai Amalan Jurutera Perunding"
                issuer="Lembaga Jurutera Malaysia (BEM)"
                description="Official certification confirming HNZ Consult Sdn. Bhd. as a registered consulting engineering practice under the Registration of Engineers Act 1967."
                icon={<HardHat className="h-10 w-10 text-blue-600" />}
              />
              
              <CertificationCard 
                title="Kementerian Kewangan Malaysia"
                issuer="Kementerian Kewangan Malaysia (MOF)"
                description="Official registration recognizing HNZ Consult Sdn. Bhd. as an approved engineering consultancy firm for government-related projects."
                icon={<Shield className="h-10 w-10 text-blue-600" />}
              />
              
              <CertificationCard 
                title="Perakuan Pendaftaran Sebagai Jurutera Profesional"
                issuer="Lembaga Jurutera Malaysia (BEM)"
                description="Certification of registration as a Professional Engineer authorized to supervise and approve civil and structural engineering works in Malaysia."
                icon={<Award className="h-10 w-10 text-blue-600" />}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}