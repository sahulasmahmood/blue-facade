"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useTestimonials } from "@/hooks/use-testimonials";
import { Loader2, Quote, Star } from "lucide-react";
import Image from "next/image";

// Animated number component
function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
}: {
  from?: number;
  to: number;
  duration?: number;
}) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    const animation = count.get();
    const controls = {
      start: () => {
        count.set(from);
        const startTime = Date.now();
        const animate = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          const progress = Math.min(elapsed / duration, 1);
          count.set(from + (to - from) * progress);
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
      },
    };
    controls.start();
  }, [to, duration]);

  useEffect(() => {
    const unsubscribe = rounded.onChange((value) => {
      setDisplayValue(value);
    });
    return () => unsubscribe();
  }, [rounded]);

  return <motion.span>{displayValue}</motion.span>;
}

const STATIC_TESTIMONIALS = [
  {
    _id: "static-1",
    name: "Ananth Ramachandran",
    location: "Chennai, TN",
    content:
      "Blufacade transformed our corporate headquarters with their high-performance structural glazing. Their attention to detail and engineering precision is unmatched.",
    rating: 5,
    serviceType: "Structural Glazing",
    avatar: "",
  },
  {
    _id: "static-2",
    name: "Meera Krishnan",
    location: "Bangalore, KA",
    content:
      "The ACP cladding work done by Blufacade for our commercial complex is exceptional. The finish is professional and it significantly improved the building's aesthetic value.",
    rating: 5,
    serviceType: "ACP Cladding",
    avatar: "",
  },
  {
    _id: "static-3",
    name: "Sanjay Mehta",
    location: "Mumbai, MH",
    content:
      "We chose Blufacade for our high-rise project's aluminium windows and doors. The team delivered ahead of schedule and the quality of materials far exceeded our expectations.",
    rating: 5,
    serviceType: "Aluminium Solutions",
    avatar: "",
  },
  {
    _id: "static-4",
    name: "Rajesh Kumar",
    location: "Coimbatore, TN",
    content:
      "Exceptional service from design to installation. The double glazed units have significantly improved our building's energy efficiency and sound insulation.",
    rating: 5,
    serviceType: "DGU Partition",
    avatar: "",
  },
  {
    _id: "static-5",
    name: "Vikram Reddy",
    location: "Hyderabad, TS",
    content:
      "Their spider glazing system at our entrance atrium is a masterpiece. It provides the perfect transparency and structural integrity we were looking for.",
    rating: 5,
    serviceType: "Spider Glazing",
    avatar: "",
  },
  {
    _id: "static-6",
    name: "Deepa Nair",
    location: "Kochi, KL",
    content:
      "Blufacade's HPL cladding provided the perfect natural wood look for our resort exterior without the maintenance issues. Truly impressed with the durability.",
    rating: 5,
    serviceType: "HPL Cladding",
    avatar: "",
  },
];

export function TestimonialsSection() {
  const { testimonials, isLoading } = useTestimonials();

  // Determine which testimonials to display
  const baseTestimonials =
    testimonials && testimonials.length > 0
      ? testimonials
      : STATIC_TESTIMONIALS;

  // Split testimonials into two groups for two vertical columns
  const firstCol = baseTestimonials.filter((_, i) => i % 2 === 0);
  const secondCol = baseTestimonials.filter((_, i) => i % 2 !== 0);

  // Helper for horizontal scrolling marquee
  const HorizontalMarquee = ({
    items,
    reverse = false,
    duration = 30,
  }: {
    items: any[];
    reverse?: boolean;
    duration?: number;
  }) => {
    // Duplicate items for seamless loop (4x for wider container)
    const duplicatedItems = [...items, ...items, ...items, ...items];

    return (
      <div className="flex flex-row overflow-hidden w-full relative pointer-events-none fade-mask">
        {/* Fade gradient overlays - Subtle edge fade */}
        <div className="absolute inset-y-0 left-0 w-6 bg-linear-to-r from-[#014a74] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-6 bg-linear-to-l from-[#014a74] to-transparent z-10" />

        <motion.div
          animate={{
            x: reverse ? ["-75%", "0%"] : ["0%", "-75%"],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex flex-row gap-6 py-4"
        >
          {duplicatedItems.map((testimonial, index) => (
            <div
              key={`${testimonial._id}-${index}`}
              className="w-[420px] shrink-0 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 relative flex flex-col pointer-events-auto group hover:bg-white/15 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-white/10 group-hover:text-white/20 transition-colors" />

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < testimonial.rating
                        ? "text-[#f58420] fill-[#f58420]"
                        : "text-white/20"
                    }`}
                  />
                ))}
              </div>

              <p className="text-white/95 leading-relaxed mb-6 italic text-lg font-medium line-clamp-4">
                "{testimonial.content}"
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-md shrink-0">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 font-black text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base leading-tight">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-[#f58420] font-bold">
                      {testimonial.location}
                    </span>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                      {testimonial.serviceType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <section
      id="testimonials"
      className="relative py-32 bg-[#014a74] overflow-hidden"
    >
      {/* Background Subtle Patterns */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-200 h-200 bg-[#f58420]/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-200 h-200 bg-white/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />

        {/* Subliminal Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(white 0.5px, transparent 0.5px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative w-full max-w-[95%] xl:max-w-[1600px] mx-auto px-4 md:px-8 z-10 grid lg:grid-cols-[1fr_1.5fr] gap-8 items-center">
        {/* Left Content */}
        <div className="relative max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="h-0.5 w-12 bg-[#f58420]" />
            <span className="text-[#f58420] font-black text-sm tracking-widest uppercase">
              What they say
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] mb-8"
          >
            Trusted by the <br />
            <span className="text-[#f58420]">Architectural</span> <br />
            Community
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 leading-relaxed mb-10"
          >
            Our commitment to engineering excellence and aesthetic precision has
            made us the preferred choice for iconic developments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-8 py-10 border-y border-white/10"
          >
            <div>
              <div className="text-5xl font-black text-white">
                <AnimatedCounter to={500} duration={2.5} />
                <span className="text-[#f58420]">+</span>
              </div>
              <div className="text-xs font-bold text-white/30 uppercase tracking-widest mt-2">
                Projects Delivered
              </div>
            </div>
            <div>
              <div className="text-5xl font-black text-white">
                <AnimatedCounter to={98} duration={2.5} />
                <span className="text-[#f58420]">%</span>
              </div>
              <div className="text-xs font-bold text-white/30 uppercase tracking-widest mt-2">
                Client Satisfaction
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Columns (Marquee) */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-[#f58420] animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative w-full overflow-hidden">
            <HorizontalMarquee items={firstCol} duration={70} />
            <HorizontalMarquee items={secondCol} reverse={true} duration={80} />
          </div>
        )}
      </div>
    </section>
  );
}
