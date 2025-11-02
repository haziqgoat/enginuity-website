import { ProjectsHero } from "@/components/projects-hero"
import { ProjectsGrid } from "@/components/projects-grid"
import { Footer } from "@/components/footer"

export default function ProjectsPage() {
  const pastProjects = [
    "Upgrading and modification of 78 units of Type IV quarters, TNB Sungai Perak Power Station, Gerik, Perak.",
    "Infrastructure works for residential development at Lot 4808 (Lot 9192), Sungai Merab Hulu, Sepang, Selangor.",
    "Infrastructure works for residential development at Lot 197, Sungai Merab Hulu, Sepang, Selangor.",
    "Additional works for a 2-storey bungalow at Taman Desa Pinggiran Putra, Dengkil, Selangor.",
    "Renovation of a semi-detached double-storey house, Taman Shukor, Ampangan, Negeri Sembilan.",
    "Additional works for a single-storey bungalow at Taman Tengku Jaafar, Seremban, Negeri Sembilan.",
    "Renovation of a single-storey terrace house at Jalan SS9/6, Sungai Way, Petaling Jaya, Selangor.",
    "Bridge Assessment for Sg. Rek, Sg. Lakit & Sg. Lebir Bridges – ECER Central Spine Road, Kelantan.",
    "Infrastructure works for residential project at Lot PT102294, Klang, Selangor.",
    "Retaining wall and slope repair works at Jalan Sultan Abdul Samad 9/4, Seksyen 9, Shah Alam, Selangor.",
    "Development of Surau Baitulrahman (Multipurpose Hall & Facilities), Putra Heights, Subang Jaya.",
    "Construction of 2-bay Fire Station and Staff Quarters, Sungai Besar, Selangor.",
    "Kompleks Kraf Pulau Pinang, Bertam Perdana, Seberang Prai Utara, Penang.",
    "Redevelopment of Surau Al-Malikus Solleh, Kampung Melayu, Subang Tambahan, Shah Alam.",
    "Construction of Multipurpose Hall Complex, Bagan Nakhoda Omar, Sabak Bernam, Selangor.",
    "Construction of 2-storey bungalow at Lot PT1036, Kampung Datuk Keramat, Kuala Lumpur.",
    "3-storey Office and Single-storey Factory, Sungai Buloh, Selangor.",
    "Program Perumahan Rakyat (PPR) Batu Berendam, Melaka – 440 units.",
    "Upgrading and refurbishment of Masjid Jamek Tun Uda, Seksyen 16, Shah Alam.",
    "Redevelopment of Maktab Tentera Di Raja (Fasa I), Kem Sungai Besi, Kuala Lumpur.",
    "Program Perumahan Rakyat (PPR) Taiping – 240 units.",
    "2-storey Restaurant, Guard House & Refuse Chamber, Shah Alam, Selangor.",
    "Depot refurbishment works, FAMA Headquarters, Selayang, Selangor.",
    "Construction of 2-storey Hostel Block and Futsal Court, Persatuan Bolasepak Malaysia (FAM).",
    "Small ICU and TPM1M maintenance projects for Dewan Bandaraya Kuala Lumpur (DBKL).",
    "Covered pedestrian walkway and footbridge modification, Jalan Pahang, Kuala Lumpur.",
    "Al-Islam Specialist Hospital Extension, Kampung Baru, Kuala Lumpur.",
    "Retaining wall repair works, Jalan Anggerik Oncidium 31/71, Kota Kemuning, Shah Alam.",
    "Slope repair works at Jalan Tranum-Gap, Raub, Pahang (Post-Flood 2014).",
    "Design and build of 240-unit staff quarters at Masjid At-Taqwa TTDI, Kuala Lumpur.",
    "Log Boom System installation for TNB Gerik Power Station, Perak.",
    "Slope repair works at Jalan Raja Abdullah 9/19A, Shah Alam, Selangor.",
    "Slope repair works at Jalan Perak 7/1F, Shah Alam, Selangor.",
    "PR1MA Bukit Jalil Development – 32 & 21-storey apartment blocks, commercial podium, and facilities.",
    "Residential Development – 5 Blocks Apartments (11 & 12 storeys), Alor Gajah, Melaka.",
    "10 Units of Double-Storey Semi-D Houses & Substation, Sungai Ramal Dalam, Kajang, Selangor.",
    "Masjid Jamek 1½ Storey and Basement, Damansara Perdana, Selangor.",
    "160-Unit Apartment Development, Kampung Sungai Danga, Johor Bahru.",
    "Mixed Residential and Commercial Development, Mukim Cheras, Hulu Langat, Selangor.",
    "Development Master Plan, Kelan Estate, Mukim Senai-Kulai, Johor Bahru.",
    "McDonald’s Drive-Thru Restaurant, Lot 75070, Kulai Jaya, Johor.",
    "McDonald’s Drive-Thru within existing petrol station, KLIA, Sepang, Selangor.",
    "44 Units 2½-Storey Terrace Houses, Kampung Padang Balang, Kuala Lumpur.",
    "Construction of Bridge at Sungai Serigala, Hulu Selangor, Selangor.",
    "Permanent Farmers Market (Pasar Tani Kekal), Kuala Kangsar, Perak.",
    "9 Units Double-Storey + 33 Units Single-Storey Terrace Houses, Bukit Kapar, Klang, Selangor.",
    "92 Units 2-Storey Terrace Houses, Puncak Bestari 2, Bandar Puncak Alam, Selangor."
  ]

  return (
    <div className="min-h-screen">
      <main>
        <ProjectsHero />
        <ProjectsGrid />
        
        {/* Past Projects Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Past Projects Undertaken
              </h2>
              <p className="mt-4 text-xl text-gray-500">
                A selection of past projects completed by HNZ Consult Sdn. Bhd. across Malaysia.
              </p>
            </div>
            
            {/* Single Card for All Past Projects */}
            <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
              <ul className="space-y-2 list-disc list-inside">
                {pastProjects.map((project, index) => (
                  <li key={index} className="text-gray-800">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}