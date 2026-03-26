"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, Instagram, Linkedin, Facebook, Twitter, Youtube, MessageCircle, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useServices } from "@/hooks/use-services"
import { usePortfolio } from "@/hooks/use-portfolio"
import { useContact } from "@/hooks/use-contact"
import { siteConfig } from "@/config/site"

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/services", hasDropdown: true },
  { label: "PORTFOLIO", href: "/portfolio", hasDropdown: true },
  { label: "BLOG", href: "/blog" },
  { label: "CAREERS", href: "/careers" },
  { label: "CONTACT", href: "/contact" },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false)
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false)
  const pathname = usePathname()
  
  const { services } = useServices(1, 100)
  const { portfolios } = usePortfolio(1, 100)
  const { contactInfo } = useContact()

  const mobileSocialLinks = [
    {
      label: "Instagram",
      href: contactInfo?.instagram || siteConfig.social.instagram,
      icon: <Instagram className="w-5 h-5" />,
    },
    {
      label: "LinkedIn",
      href: contactInfo?.linkedin || siteConfig.social.linkedin,
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      label: "Facebook",
      href: contactInfo?.facebook || siteConfig.social.facebook,
      icon: <Facebook className="w-5 h-5" />,
    },
    {
      label: "Twitter",
      href: contactInfo?.twitter,
      icon: <Twitter className="w-5 h-5" />,
    },
    {
      label: "YouTube",
      href: contactInfo?.youtube,
      icon: <Youtube className="w-5 h-5" />,
    },
    {
      label: "WhatsApp",
      href: contactInfo?.whatsapp,
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      label: "Telegram",
      href: contactInfo?.telegram,
      icon: <Send className="w-5 h-5" />,
    },
  ].filter((s) => Boolean(s.href))

  // Check if we're on the home page
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 50)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [menuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-md shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto pl-2 md:pl-4 pr-6 md:pr-12 flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center">
              <div className="h-14 md:h-16 lg:h-20 w-auto relative">
                <Image
                  src="/images/logo/Blufacade Logo PNG (1)-Photoroom.png"
                  alt="Blufacade - Inspiring Skylines"
                  width={280}
                  height={80}
                  className="object-contain h-full w-auto"
                  priority
                />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-lg transition-colors px-3 py-2.5 md:hidden ${
                scrolled 
                  ? "bg-[#014a74] text-white" 
                  : isHomePage 
                    ? "bg-[#014a74] text-white border border-[#014a74]"
                    : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
              }`}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                if (item.label === "SERVICES") {
                  return (
                    <div 
                      key={item.label} 
                      className="relative group"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#f58420] ${
                          scrolled ? "text-[#014a74]" : isHomePage ? "text-[#014a74]" : "text-white"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </Link>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {servicesDropdownOpen && services.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl py-2 border border-gray-100 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                          >
                            {services.map((service) => (
                              <Link
                                key={service._id}
                                href={`/services/${service.slug}`}
                                className="block px-4 py-2.5 text-[13px] text-gray-600 hover:text-[#014a74] hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 last:border-0 leading-snug"
                              >
                                <span className="line-clamp-2">{service.serviceName}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                if (item.label === "PORTFOLIO") {
                   return (
                    <div 
                      key={item.label} 
                      className="relative group"
                      onMouseEnter={() => setPortfolioDropdownOpen(true)}
                      onMouseLeave={() => setPortfolioDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#f58420] ${
                          scrolled ? "text-[#014a74]" : isHomePage ? "text-[#014a74]" : "text-white"
                        }`}
                      >
                        {item.label}
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      </Link>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {portfolioDropdownOpen && portfolios.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full -right-12 w-80 bg-white rounded-xl shadow-xl py-2 border border-gray-100 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                          >
                            {portfolios.map((project) => (
                              <Link
                                key={project._id}
                                href={`/portfolio/${project.slug}`}
                                className="block px-4 py-2.5 text-[13px] text-gray-600 hover:text-[#014a74] hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 last:border-0 leading-snug"
                              >
                                <span className="line-clamp-2">{project.projectName}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-[#f58420] ${
                      scrolled ? "text-[#014a74]" : isHomePage ? "text-[#014a74]" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#014a74]/95 backdrop-blur-xl z-40 flex items-center justify-center overflow-y-auto py-10"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false)
            }}
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
              }}
              className="text-center w-full px-6"
            >
              <motion.ul className="space-y-6 text-2xl md:text-5xl font-black uppercase text-white flex flex-col items-center">
                {navItems.map((item) => (
                  <motion.li
                    key={item.label}
                    variants={{
                      open: { opacity: 1, y: 0, rotate: 0 },
                      closed: { opacity: 0, y: 20, rotate: -5 },
                    }}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      className="inline-block hover:text-[#f58420] transition-colors duration-300 hover:scale-110 transform"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 },
                }}
                className="mt-12 flex justify-center gap-4"
              >
                {mobileSocialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMenuOpen(false)}
                    className="w-11 h-11 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-[#f58420] hover:border-[#f58420] transition-colors"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
