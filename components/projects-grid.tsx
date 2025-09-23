"use client"

import { useState } from "react"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"

export function ProjectsGrid() {
  const [filter, setFilter] = useState("all")

  const projects = [
    {
      title: "Skyline Residential Complex",
      description:
        "A modern 25-story residential complex with 200 units, featuring sustainable design and smart home technology.",
      location: "Kuala Lumpur, Malaysia",
      duration: "24 months",
      budget: "RM 85M",
      teamSize: 45,
      status: "completed" as const,
      category: "Residential",
      imageUrl: "/modern-residential-complex-building.jpg",
      features: [
        "Smart home automation systems",
        "Green building certification",
        "Underground parking facility",
        "Rooftop garden and amenities",
      ],
    },
    {
      title: "Metro Shopping Center",
      description: "Large-scale commercial development with retail spaces, entertainment zones, and office towers.",
      location: "Johor Bahru, Malaysia",
      duration: "30 months",
      budget: "RM 120M",
      teamSize: 60,
      status: "ongoing" as const,
      category: "Commercial",
      imageUrl: "/modern-shopping-center-mall-construction.jpg",
      features: [
        "Multi-level retail spaces",
        "IMAX cinema complex",
        "Food court and restaurants",
        "Office tower integration",
      ],
    },
    {
      title: "Industrial Manufacturing Hub",
      description: "State-of-the-art manufacturing facility with automated systems and sustainable energy solutions.",
      location: "Penang, Malaysia",
      duration: "18 months",
      budget: "RM 65M",
      teamSize: 35,
      status: "completed" as const,
      category: "Industrial",
      imageUrl: "/modern-manufacturing-facility.png",
      features: [
        "Automated production lines",
        "Solar energy systems",
        "Waste management facility",
        "Quality control laboratories",
      ],
    },
    {
      title: "Heritage Hotel Restoration",
      description:
        "Careful restoration of a colonial-era building into a luxury boutique hotel while preserving historical elements.",
      location: "George Town, Penang",
      duration: "15 months",
      budget: "RM 35M",
      teamSize: 25,
      status: "completed" as const,
      category: "Heritage",
      imageUrl: "/heritage-colonial-building-hotel-restoration.jpg",
      features: [
        "Historical facade preservation",
        "Modern interior amenities",
        "Boutique hotel suites",
        "Cultural heritage compliance",
      ],
    },
    {
      title: "Smart Office Tower",
      description:
        "Next-generation office building with AI-powered building management and sustainable design features.",
      location: "Cyberjaya, Malaysia",
      duration: "28 months",
      budget: "RM 95M",
      teamSize: 50,
      status: "ongoing" as const,
      category: "Commercial",
      imageUrl: "/modern-smart-office-tower-building.jpg",
      features: [
        "AI building management",
        "Energy-efficient systems",
        "Flexible workspace design",
        "High-speed connectivity",
      ],
    },
    {
      title: "Waterfront Condominiums",
      description: "Luxury waterfront residential development with marina access and premium amenities.",
      location: "Putrajaya, Malaysia",
      duration: "22 months",
      budget: "RM 75M",
      teamSize: 40,
      status: "planning" as const,
      category: "Residential",
      imageUrl: "/luxury-waterfront-condominium-marina.jpg",
      features: ["Marina and boat access", "Infinity pool and spa", "Waterfront dining", "Private beach access"],
    },
  ]

  const categories = ["all", "Residential", "Commercial", "Industrial", "Heritage"]

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-card-foreground mb-6">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Discover how Enginuity has helped deliver successful construction projects across various sectors and
            scales.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className="capitalize"
              >
                {category === "all" ? "All Projects" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Projects
          </Button>
        </div>
      </div>
    </section>
  )
}
