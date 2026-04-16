import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { openBooking } from "@lib/boulevard";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Locations", href: "/locations" },
  { label: "Level System", href: "/level-system" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Connect", href: "/connect" },
] as const;

const LOCATIONS = [
  { label: "Land O' Lakes", id: "land-o-lakes" },
  { label: "Lutz", id: "lutz" },
  { label: "Citrus Park", id: "citrus-park" },
  { label: "Odessa", id: "odessa" },
  { label: "Wesley Chapel", id: "wesley-chapel" },
] as const;

export default function MenuOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for menu-toggle events from Nav
  useEffect(() => {
    const handler = (e: Event) => {
      const { open } = (e as CustomEvent<{ open: boolean }>).detail;
      setIsOpen(open);
    };
    window.addEventListener("menu-toggle", handler);
    return () => window.removeEventListener("menu-toggle", handler);
  }, []);

  // GSAP animation setup
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({ paused: true });

      tl.to(containerRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.7,
        ease: "power4.inOut",
      });

      tl.from(
        ".menu-link",
        {
          y: 60,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.3"
      );

      tl.from(
        ".menu-meta",
        {
          y: 30,
          opacity: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power3.out",
        },
        "-=0.4"
      );

      tlRef.current = tl;
    },
    { scope: containerRef }
  );

  // Play / reverse timeline on open state change
  useEffect(() => {
    if (!tlRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
      // Restore scroll after reverse completes
      const duration = tlRef.current.duration();
      setTimeout(() => {
        if (!tlRef.current?.isActive()) {
          document.body.style.overflow = "";
        }
      }, duration * 1000);
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("menu-close"));
    if (tlRef.current) {
      tlRef.current.reverse();
      const duration = tlRef.current.duration();
      setTimeout(() => {
        document.body.style.overflow = "";
      }, duration * 1000);
    }
  };

  const handleBookClick = () => {
    handleLinkClick();
    openBooking();
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[55] bg-black overflow-y-auto"
      style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      aria-hidden={!isOpen}
    >
      <div className="min-h-full flex flex-col justify-between px-6 md:px-12 pt-24 pb-8">
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left column — nav links */}
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={handleLinkClick}
                className="menu-link block font-heading font-bold text-cream tracking-tight leading-[1.1] transition-colors duration-200 hover:text-gold"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleBookClick}
              className="menu-link block font-heading font-bold text-gold tracking-tight leading-[1.1] text-left transition-opacity duration-200 hover:opacity-70 mt-2"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Book Now
            </button>
          </div>

          {/* Right column — locations & contact */}
          <div className="flex flex-col justify-between gap-12">
            {/* Locations */}
            <div className="menu-meta">
              <span className="block text-[0.6rem] font-heading uppercase tracking-[0.2em] text-white/40 mb-4">
                Locations
              </span>
              <div className="flex flex-col gap-2">
                {LOCATIONS.map(({ label, id }) => (
                  <a
                    key={id}
                    href={`/locations#${id}`}
                    onClick={handleLinkClick}
                    className="menu-meta text-[0.85rem] font-body text-cream/70 hover:text-cream transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="menu-meta flex flex-col gap-3">
              <a
                href="tel:8132356848"
                className="text-[0.85rem] font-body text-cream/70 hover:text-cream transition-colors duration-200"
              >
                813-235-6848
              </a>
              <a
                href="mailto:info@jjosephsalon.com"
                className="text-[0.85rem] font-body text-cream/70 hover:text-cream transition-colors duration-200"
              >
                info@jjosephsalon.com
              </a>
              <div className="flex gap-5 mt-1">
                <a
                  href="https://www.instagram.com/jjosephsalon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.75rem] font-body text-cream/50 hover:text-cream transition-colors duration-200"
                >
                  Instagram
                </a>
                <a
                  href="https://www.tiktok.com/@jjosephsalon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.75rem] font-body text-cream/50 hover:text-cream transition-colors duration-200"
                >
                  TikTok
                </a>
                <a
                  href="https://www.facebook.com/jjosephsalon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.75rem] font-body text-cream/50 hover:text-cream transition-colors duration-200"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-12 pt-6 border-t border-white/[0.04]">
          <a
            href="https://careers.jjosephsalon.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="menu-meta text-[0.6rem] font-body text-white/30 hover:text-white/60 tracking-wider uppercase transition-colors duration-200"
          >
            Careers
          </a>
          <a
            href="/salon-policies"
            onClick={handleLinkClick}
            className="menu-meta text-[0.6rem] font-body text-white/30 hover:text-white/60 tracking-wider uppercase transition-colors duration-200"
          >
            Policies
          </a>
          <a
            href="/privacy-policy"
            onClick={handleLinkClick}
            className="menu-meta text-[0.6rem] font-body text-white/30 hover:text-white/60 tracking-wider uppercase transition-colors duration-200"
          >
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
}
