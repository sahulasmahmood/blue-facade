'use client';

import { useClientLogos } from '@/hooks/use-client-logos';
import { Loader2 } from 'lucide-react';

export function ClientLogosSection() {
  const { clientLogos, isLoading } = useClientLogos(true);

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#014a74]" />
          </div>
        </div>
      </section>
    );
  }

  if (clientLogos.length === 0) {
    return null;
  }

  // Repeat logos enough times so strip always looks packed (target ~16+ items)
  const minItems = 16;
  const repeatCount = Math.ceil(minItems / clientLogos.length) + 1;
  const strip = Array.from({ length: repeatCount }, () => clientLogos).flat();

  // Duration: ~2.5s per logo so speed feels consistent regardless of count
  const duration = clientLogos.length * 2.5;

  return (
    <section className="py-16 md:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6 mb-10">
        <div className="text-center mb-4">
          <p className="text-[#f58420] font-black text-xl tracking-widest uppercase mb-4">
            Trusted By
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#014a74]">
            Our <span className="text-[#f58420]">Happy Clients</span>
          </h2>
          <p className="text-base text-[#282828]/70 max-w-2xl mx-auto mt-4">
            Trusted partnerships delivering exceptional facade solutions
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee */}
        <div className="marquee-outer">
          <div
            className="marquee-track"
            style={{ animationDuration: `${duration}s` }}
          >
            {strip.map((logo, index) => (
              <div key={`${logo._id}-${index}`} className="marquee-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.logo}
                  alt={logo.name}
                  loading={index < clientLogos.length ? 'eager' : 'lazy'}
                  decoding="async"
                  className="logo-img"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-outer {
          width: 100%;
          overflow: hidden;
        }

        .marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee-scroll linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        .marquee-item {
          flex-shrink: 0;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-img {
          height: 48px;
          width: auto;
          max-width: 120px;
          object-fit: contain;
          filter: grayscale(20%);
          transition: filter 0.3s;
        }

        .logo-img:hover {
          filter: grayscale(0%);
        }

        @media (min-width: 768px) {
          .marquee-item {
            padding: 0 32px;
          }
          .logo-img {
            height: 64px;
            max-width: 160px;
          }
        }

        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / ${repeatCount})); }
        }
      `}</style>
    </section>
  );
}
