"use client"

import { Button } from "@/components/ui/button"

export function CareersHero() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Join Our Team</h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto text-pretty">
          Build the future of construction technology with us. We're looking for passionate graduates ready to make an
          impact.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg px-8 py-3"
          onClick={() => document.getElementById("job-openings")?.scrollIntoView({ behavior: "smooth" })}
        >
          View Open Positions
        </Button>
      </div>
    </section>
  )
}
