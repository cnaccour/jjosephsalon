import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface LocationHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

interface Location {
  id: string;
  name: string;
  tag: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  hours: LocationHours;
  image: string;
}

interface Props {
  locations: Location[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Condense the hours object into a short human-readable string. */
function condenseHours(hours: LocationHours): string {
  const fmt = (raw: string) => {
    return raw
      .replace(/:00/g, "")
      .replace(/\s?AM/gi, "a")
      .replace(/\s?PM/gi, "p");
  };

  const weekday = hours.tuesday; // Tue-Fri are the same for all locations
  const mon = hours.monday;
  const sat = hours.saturday;
  const sun = hours.sunday;

  const parts: string[] = [];

  if (mon === sat && mon === weekday) {
    parts.push(`Mon\u2013Sat ${fmt(mon)}`);
  } else if (mon === sat) {
    parts.push(`Mon & Sat ${fmt(mon)}`);
    parts.push(`Tue\u2013Fri ${fmt(weekday)}`);
  } else {
    if (mon !== weekday) {
      parts.push(`Mon ${fmt(mon)}`);
      parts.push(`Tue\u2013Fri ${fmt(weekday)}`);
    } else {
      parts.push(`Mon\u2013Fri ${fmt(weekday)}`);
    }
    if (sat !== weekday) {
      parts.push(`Sat ${fmt(sat)}`);
    }
  }

  parts.push(`Sun ${fmt(sun)}`);
  return parts.join(" \u00B7 ");
}

/* ------------------------------------------------------------------ */
/*  Row                                                                */
/* ------------------------------------------------------------------ */

interface RowProps {
  location: Location;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

function LocationRow({
  location,
  isActive,
  onActivate,
  onDeactivate,
}: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  /* Animate expand / collapse */
  const animateOpen = useCallback(() => {
    const detail = detailRef.current;
    const arrow = arrowRef.current;
    if (!detail || !arrow) return;

    /* Measure natural height */
    gsap.set(detail, { height: "auto", visibility: "visible" });
    const h = detail.offsetHeight;
    gsap.set(detail, { height: 0 });

    gsap.to(detail, {
      height: h,
      duration: 0.45,
      ease: "power3.out",
    });
    gsap.fromTo(
      detail.children,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, delay: 0.1, ease: "power2.out", stagger: 0.04 },
    );
    gsap.to(arrow, {
      x: 0,
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });
  }, []);

  const animateClose = useCallback(() => {
    const detail = detailRef.current;
    const arrow = arrowRef.current;
    if (!detail || !arrow) return;

    gsap.to(detail, {
      height: 0,
      duration: 0.35,
      ease: "power3.inOut",
      onComplete: () => gsap.set(detail, { visibility: "hidden" }),
    });
    gsap.to(arrow, {
      x: -12,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });
  }, []);

  /* React to isActive changes */
  const prevActive = useRef(false);
  if (isActive && !prevActive.current) {
    /* schedule open on next frame so refs are painted */
    requestAnimationFrame(animateOpen);
  } else if (!isActive && prevActive.current) {
    requestAnimationFrame(animateClose);
  }
  prevActive.current = isActive;

  /* Touch handling for mobile */
  const handleClick = useCallback(() => {
    if (isActive) {
      onDeactivate();
    } else {
      onActivate();
    }
  }, [isActive, onActivate, onDeactivate]);

  return (
    <div
      ref={rowRef}
      className="loc-row"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onClick={handleClick}
    >
      {/* Main row */}
      <div
        className="flex w-full cursor-pointer items-center justify-between"
        style={{
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingLeft: isActive ? "8px" : "0px",
          transition: "padding-left 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        {/* Name */}
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            color: isActive ? "var(--color-gold)" : "var(--color-cream)",
            transition: "color 0.3s ease",
            lineHeight: 1.2,
          }}
        >
          {location.name}
        </span>

        {/* Right side: tag + arrow */}
        <span className="flex items-center gap-4">
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.55rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--color-gold)",
              whiteSpace: "nowrap",
            }}
          >
            {location.tag}
          </span>
          <span
            ref={arrowRef}
            aria-hidden="true"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.25rem",
              color: "var(--color-gold)",
              opacity: 0,
              transform: "translateX(-12px)",
              display: "inline-block",
            }}
          >
            &rarr;
          </span>
        </span>
      </div>

      {/* Expandable detail */}
      <div
        ref={detailRef}
        style={{
          height: 0,
          overflow: "hidden",
          visibility: "hidden",
          paddingLeft: "8px",
        }}
      >
        <div
          style={{
            paddingBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--color-cream-dark)",
              opacity: 0.7,
            }}
          >
            {location.city}, {location.state} {location.zip}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-cream-dark)",
              opacity: 0.5,
            }}
          >
            {condenseHours(location.hours)}
          </span>
          <a
            href={`/locations/${location.id}`}
            className="group mt-1 inline-flex w-fit items-center gap-1"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--color-gold)",
              textDecoration: "none",
              borderBottom: "1px solid var(--color-gold)",
              paddingBottom: "1px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            Book at This Location
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              &rarr;
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Image Preview (desktop only)                                       */
/* ------------------------------------------------------------------ */

interface ImagePreviewProps {
  activeLocation: Location | null;
}

function ImagePreview({ activeLocation }: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevId = useRef<string | null>(null);

  if (activeLocation && activeLocation.id !== prevId.current) {
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
      );
    });
  } else if (!activeLocation && prevId.current) {
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    });
  }
  prevId.current = activeLocation?.id ?? null;

  return (
    <div
      ref={containerRef}
      className="hidden md:flex items-center justify-center"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "40%",
        background: "var(--color-cream-dark)",
        opacity: activeLocation ? undefined : 0,
      }}
    >
      {activeLocation && (
        <span
          className="select-none text-center text-sm tracking-wide"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-black)",
            opacity: 0.4,
          }}
        >
          [ {activeLocation.name} ]
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Scene4Locations({ locations }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activeLocation = locations.find((l) => l.id === activeId) ?? null;

  /* Scroll-triggered fade-in */
  useGSAP(
    () => {
      gsap.fromTo(
        ".loc-heading",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      gsap.fromTo(
        ".loc-row",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--color-black-warm)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Content grid: list on left, image on right (desktop) */}
        <div
          className="relative"
          style={{
            paddingTop: "100px",
            paddingBottom: "100px",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          {/* Heading */}
          <h2
            className="loc-heading"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--color-cream)",
              marginBottom: "48px",
              opacity: 0,
            }}
          >
            Locations
          </h2>

          {/* Two-column wrapper */}
          <div className="relative" style={{ minHeight: "360px" }}>
            {/* Left column: location list */}
            <div className="w-full md:w-[58%]">
              {locations.map((loc) => (
                <LocationRow
                  key={loc.id}
                  location={loc}
                  isActive={activeId === loc.id}
                  onActivate={() => setActiveId(loc.id)}
                  onDeactivate={() => setActiveId(null)}
                />
              ))}
            </div>

            {/* Right column: image preview (desktop) */}
            <ImagePreview activeLocation={activeLocation} />
          </div>
        </div>
      </div>
    </section>
  );
}
