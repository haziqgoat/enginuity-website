export function MapSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Visit Our Office</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Located in the heart of Kuala Lumpur, our office is easily accessible by public transport and offers
            convenient parking facilities.
          </p>
        </div>

        {/* Map Container */}
        <div className="bg-muted rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Interactive Map</h3>
              <p className="text-muted-foreground mb-4">
                Level 15, Menara HNZ, Jalan Ampang
                <br />
                50450 Kuala Lumpur, Malaysia
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Get Directions
                </button>
                <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                  View on Google Maps
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <h4 className="font-semibold text-card-foreground mb-2">Public Transport</h4>
            <p className="text-muted-foreground text-sm text-pretty">
              5-minute walk from Ampang Park LRT Station. Multiple bus routes available nearby.
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-card-foreground mb-2">Parking</h4>
            <p className="text-muted-foreground text-sm text-pretty">
              Covered parking available in the building. Visitor parking spaces reserved on lower levels.
            </p>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-card-foreground mb-2">Nearby Landmarks</h4>
            <p className="text-muted-foreground text-sm text-pretty">
              Close to KLCC, Suria KLCC, and major business districts in Kuala Lumpur.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
