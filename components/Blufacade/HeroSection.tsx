"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Building2, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Particles } from "@/components/ui/particles"
import Link from "next/link"
import { useBanner } from "@/hooks/use-banner"

export function HeroSection() {
  const [isReady, setIsReady] = useState(false)
  const { banner } = useBanner("home")

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Determine the image source
  const heroImage = banner?.images?.[0] || banner?.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"

  const stats = [
    { icon: Building2, label: "Projects Completed", value: "500+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Users, label: "Happy Clients", value: "300+" },
  ]

  return (
    <section
      className="relative min-h-[75vh] md:min-h-[80vh] flex items-center overflow-hidden bg-[#fefaf6]"
    >
      {/* Particles Background */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={150}
        ease={80}
        color="#014a74"
        size={0.5}
        staticity={30}
        refresh={false}
      />

      <div className="container mx-auto px-6 md:px-12 py-20 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isReady ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="inline-block">
                <span className="text-sm font-bold tracking-widest text-[#f58420] uppercase">
                  Premium Facade Solutions
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="text-[#014a74]">Building</span>
                <br />
                <span className="text-[#282828]">Tomorrow's</span>
                <br />
                <span className="text-[#f58420]">Architecture</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#282828]/70 max-w-xl leading-relaxed">
                Transform your vision into reality with our expert facade construction services. 
                From ACP cladding to structural glazing, we deliver excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                asChild
                size="lg" 
                className="bg-[#014a74] hover:bg-[#014a74]/90 text-white px-8 py-6 text-base"
              >
                <Link href="/portfolio">
                  View Our Work <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="border-2 border-[#014a74] text-[#014a74] hover:bg-[#014a74] hover:text-white px-8 py-6 text-base"
              >
                <Link href="/contact">
                  Get a Quote
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-[#014a74]/20"
            >
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <stat.icon className="w-6 h-6 text-[#f58420]" />
                  <div className="text-2xl md:text-3xl font-bold text-[#014a74]">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-[#282828]/60 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isReady ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={heroImage}
              alt="Modern building facade"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#014a74]/30 to-transparent" />
            
            {/* Floating Badge */}
            <Link href="/portfolio" className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#282828]/60 mb-1">Featured Project</div>
                  <div className="text-lg font-bold text-[#014a74] group-hover:text-[#f58420] transition-colors">Premium Facade Design</div>
                </div>
                <ArrowRight className="w-6 h-6 text-[#f58420] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
