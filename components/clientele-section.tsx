const clients = [
  { name: "DBKL", logo: "/dbkl-logo-government-malaysia.jpg" },
  { name: "MBSA", logo: "/mbsa-logo-government-malaysia.jpg" },
  { name: "TNB", logo: "/tnb-tenaga-nasional-logo-malaysia.jpg" },
  { name: "JKR", logo: "/jkr-public-works-logo-malaysia.jpg" },
  { name: "PR1MA", logo: "/pr1ma-logo-malaysia-housing.jpg" },
  { name: "UPNM", logo: "/upnm-university-logo-malaysia.jpg" },
]

export function ClienteleSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Clients & Partners</h2>
          <p className="text-lg text-gray-600">Trusted by leading government agencies and private organizations</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={`${client.name} logo`}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
