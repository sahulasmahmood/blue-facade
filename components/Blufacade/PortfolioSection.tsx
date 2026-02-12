"use client";

import { CircularGallery, GalleryItem } from "@/components/circular-gallery-2";
import { usePortfolio } from "@/hooks/use-portfolio";
import { Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function PortfolioSection() {
  const { portfolios, isLoading } = usePortfolio(1, 12);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fallback hardcoded projects
  const fallbackProjects = [
    {
      id: 1,
      projectName: "Gulmohar Commercial",
      category: "Commercial",
      image: "/images/portfolio/GULMOHAR c2.png",
      slug: "gulmohar-commercial",
    },
    {
      id: 2,
      projectName: "Thulip Garden",
      category: "Residential",
      image: "/images/portfolio/Thulip Garden 1.png",
      slug: "thulip-garden",
    },
    {
      id: 3,
      projectName: "Jaya Springs",
      category: "Commercial",
      image: "/images/portfolio/Jaya Springs.png",
      slug: "jaya-springs",
    },
    {
      id: 4,
      projectName: "JK Hospital",
      category: "Healthcare",
      image: "/images/portfolio/Jk Hospital .jpeg",
      slug: "jk-hospital",
    },
    {
      id: 5,
      projectName: "Universal Distributor",
      category: "Industrial",
      image: "/images/portfolio/Universal Distubutor .png",
      slug: "universal-distributor",
    },
    {
      id: 6,
      projectName: "GH Otanchathiram",
      category: "Healthcare",
      image: "/images/portfolio/GH, OTANCHATHIRAM , HOSPITAL.png",
      slug: "gh-otanchathiram",
    },
    {
      id: 7,
      projectName: "GH CH Building",
      category: "Healthcare",
      image: "/images/portfolio/GH CH 1 (1).png",
      slug: "gh-ch-building",
    },
  ];

  const displayProjects =
    portfolios && portfolios.length > 0
      ? portfolios.map((p, idx) => ({
          id: p._id || idx,
          projectName: p.projectName,
          category: p.category || "Project",
          image: p.image,
          slug: p.slug || `project-${idx}`,
        }))
      : fallbackProjects;

  const galleryItems: GalleryItem[] = displayProjects.map((project) => ({
    image: project.image,
    text: project.projectName,
    link: `/portfolio/${project.slug}`,
  }));

  const handleProjectClick = (index: number, item: GalleryItem) => {
    if (item.link) {
      window.location.href = item.link;
    }
  };

  return (
    <section id="portfolio" className="relative bg-[#fefaf6]">
      {/* Section Header */}
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4 py-12 px-4">
        <div className="text-center mb-4">
          <p className="text-[#f58420] font-black text-xl tracking-widest uppercase mb-4">
            Our Work
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#014a74]">
            Featured <span className="text-[#f58420]">Projects</span>
          </h2>
          <p className="text-lg text-[#282828]/70 max-w-2xl mx-auto mt-4">
            Explore our portfolio of iconic facade projects
          </p>
        </div>
        <div className={`text-[#f58420] text-xs ${isMobile ? "animate-pulse" : "animate-bounce"}`}>
          {isMobile ? "Swipe to View →" : "↓ Scroll to Navigate"}
        </div>
      </div>

      {/* Gallery Content */}
      {isLoading ? (
        <div className="h-[400px] md:h-[800px] w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#f58420] animate-spin" />
        </div>
      ) : (
        <>
          {/* Desktop Only: WebGL Circular Gallery (1024px+) */}
          <div className="hidden lg:block h-[800px] w-full">
            <CircularGallery
              items={galleryItems}
              bend={3}
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
              className="text-[#014a74] font-bold"
              fontClassName="font-bold text-[35px]"
              itemWidth={1000}
              itemHeight={700}
              onItemClick={handleProjectClick}
            />
          </div>

          {/* Tablet Only: 2 Column Grid (768px-1023px) */}
          <div className="hidden md:block lg:hidden py-12 px-6">
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              {displayProjects.slice(0, 6).map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative h-[250px] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.projectName}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#014a74]/90 via-[#014a74]/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/90 backdrop-blur-sm text-[#014a74] font-semibold px-3 py-1 text-xs"
                      >
                        {project.category}
                      </Badge>
                    </div>

                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#f58420] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                      {project.projectName}
                    </h3>
                    <div className="h-1 w-0 bg-[#f58420] group-hover:w-16 transition-all duration-500" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#014a74] hover:bg-[#014a74]/90 text-white font-semibold rounded-lg transition-all duration-300 hover:gap-4"
              >
                View All Projects
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Only: Horizontal Scroll (below 768px) */}
          <div className="md:hidden py-8 px-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
              {displayProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/portfolio/${project.slug}`}
                  className="shrink-0 w-[320px] snap-center"
                >
                  <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg">
                    <div className="relative h-[220px] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.projectName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#014a74]/90 via-[#014a74]/40 to-transparent opacity-60" />
                      
                      <div className="absolute top-3 left-3">
                        <Badge 
                          variant="secondary" 
                          className="bg-white/90 backdrop-blur-sm text-[#014a74] font-semibold px-2 py-1 text-xs"
                        >
                          {project.category}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#f58420] text-white flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        {project.projectName}
                      </h3>
                      <div className="h-1 w-12 bg-[#f58420]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            

          </div>
        </>
      )}

    </section>
  );
}
