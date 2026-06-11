import { Metadata } from "next"
import { Header } from "@/components/Blufacade/Header"

import { HeroSection } from "@/components/Blufacade/HeroSection"
import { HeroTextSection } from "@/components/Blufacade/HeroTextSection"
import { ServicesSection } from "@/components/Blufacade/ServicesSection"
import { AboutTextSection } from "@/components/Blufacade/AboutTextSection"
import { MissionSection } from "@/components/Blufacade/MissionSection"
import { PortfolioSection } from "@/components/Blufacade/PortfolioSection"
import { TestimonialsSection } from "@/components/Blufacade/TestimonialsSection"
import { ClientLogosSection } from "@/components/Blufacade/ClientLogosSection"
import { FAQSection } from "@/components/Blufacade/FAQSection"
import { Footer } from "@/components/Blufacade/Footer"

export const metadata: Metadata = {
  title: "Blufacade | Inspiring Skylines - Premium Facade Solutions",
  description: "Blufacade specializes in innovative, high-quality facade solutions including ACP, structural glazing, aluminium doors & windows, HPL, and spider glazing. Transform your building with iconic facades.",
  keywords: "facade solutions, ACP cladding, structural glazing, aluminium windows, glass partition, spider glazing, Chennai, Tamil Nadu",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Blufacade | Inspiring Skylines",
    description: "Premium facade solutions that redefine the visual identity of modern buildings.",
    url: "https://www.blufacade.com",
    siteName: "Blufacade",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Blufacade - Premium Facade Solutions",
      },
    ],
  },
}

export default function Home() {
  return (
    <>

      <main className="relative w-full overflow-x-hidden">
        <Header />
        <HeroSection />
        <ClientLogosSection />  
        <PortfolioSection />
        <ServicesSection />
        <HeroTextSection />
        <AboutTextSection />
        <MissionSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </main>
    </>
  )
}
