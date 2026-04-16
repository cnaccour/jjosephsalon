import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Service {
  id: string;
  name: string;
  description: string;
  price_from: string;
  image: string;
}

interface Props {
  services: Service[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const DESKTOP_BP = 768;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene3Services({ services }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  /* ---- Responsive check ---- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < DESKTOP_BP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ---- GSAP horizontal scroll (desktop only) ---- */
  useGSAP(
    () => {
      if (isMobile) return;

      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      const progress = progressRef.current;
      if (!wrapper || !track || !progress) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${track.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        track,
        {
          x: -totalWidth,
          ease: "none",
        },
        0,
      );

      tl.fromTo(
        progress,
        { scaleX: 0 },
        { scaleX: 1, ease: "none" },
        0,
      );
    },
    { scope: wrapperRef, dependencies: [isMobile] },
  );

  /* ---- Drag-to-scroll (desktop) ---- */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isMobile) return; // drag only on mobile native scroll
      const track = trackRef.current;
      if (!track) return;
      isDragging.current = true;
      startX.current = e.clientX;
      scrollStart.current = track.scrollLeft;
      track.style.cursor = "grabbing";
      track.setPointerCapture(e.pointerId);
    },
    [isMobile],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const track = trackRef.current;
      if (!track) return;
      const dx = e.clientX - startX.current;
      track.scrollLeft = scrollStart.current - dx;
    },
    [],
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    const track = trackRef.current;
    if (track) track.style.cursor = "";
  }, []);

  /* ---- Pad number ---- */
  const pad = (n: number) => String(n).padStart(2, "0");

  /* ---- Render ---- */
  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Inner container — sticky on desktop, normal on mobile */}
      <div
        className="relative overflow-hidden"
        style={{ height: isMobile ? "auto" : "100vh" }}
      >
        {/* ---- Header row ---- */}
        <div
          className="flex items-baseline justify-between px-6 pt-8 pb-4 md:px-12 md:pt-10 md:pb-6"
          style={{ position: "relative", zIndex: 2 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "2rem",
              color: "var(--color-black)",
              lineHeight: 1.2,
            }}
          >
            Services
          </h2>
          <a
            href="/services"
            className="group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
            style={{ color: "var(--color-gold)" }}
          >
            Full Menu &amp; Pricing
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </a>
        </div>

        {/* ---- Horizontal track ---- */}
        <div
          ref={trackRef}
          className={
            isMobile
              ? "flex gap-4 overflow-x-auto px-6 pb-8 snap-x snap-mandatory scrollbar-none"
              : "flex gap-6 px-6 md:px-12"
          }
          style={{
            height: isMobile ? "auto" : "calc(100vh - 100px)",
            willChange: isMobile ? "auto" : "transform",
            ...(isMobile
              ? { WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }
              : {}),
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {services.map((service, i) => (
            <article
              key={service.id}
              className={
                isMobile
                  ? "flex-shrink-0 snap-start"
                  : "flex-shrink-0"
              }
              style={{
                width: isMobile ? "80vw" : "45vw",
                height: isMobile ? "70vh" : "100%",
                minWidth: isMobile ? "80vw" : "45vw",
              }}
            >
              <div
                className="relative flex h-full overflow-hidden rounded-sm"
                style={{
                  background: "var(--color-cream-dark)",
                }}
              >
                {/* Left — image placeholder (55%) */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: "55%",
                    background: "var(--color-cream-dark)",
                  }}
                >
                  <span
                    className="select-none text-sm tracking-wide opacity-30"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--color-black)",
                    }}
                  >
                    [ {service.name} ]
                  </span>
                </div>

                {/* Right — text content (45%) */}
                <div
                  className="flex flex-col justify-between p-5 md:p-8"
                  style={{
                    width: "45%",
                    background: "var(--color-cream)",
                  }}
                >
                  {/* Top */}
                  <div>
                    {/* Gold number */}
                    <span
                      className="mb-4 block text-sm tracking-widest md:mb-6"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 500,
                        color: "var(--color-gold)",
                      }}
                    >
                      {pad(i + 1)}
                    </span>

                    {/* Service name */}
                    <h3
                      className="mb-3 md:mb-4"
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: "1.5rem",
                        lineHeight: 1.2,
                        color: "var(--color-black)",
                      }}
                    >
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p
                      className="leading-relaxed"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        color: "var(--color-cream-dark)",
                        mixBlendMode: "multiply",
                        opacity: 0.55,
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom */}
                  <div className="flex items-end justify-between">
                    {/* Price */}
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        color: "var(--color-gold)",
                      }}
                    >
                      {service.price_from === "Consultation"
                        ? "Consultation"
                        : `From ${service.price_from}`}
                    </span>

                    {/* Arrow link */}
                    <a
                      href="/services"
                      aria-label={`Learn more about ${service.name}`}
                      className="group flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300"
                      style={{
                        border: "1px solid var(--color-gold)",
                        color: "var(--color-gold)",
                      }}
                    >
                      <span
                        className="inline-block text-lg transition-transform duration-300 group-hover:rotate-[-45deg]"
                        aria-hidden="true"
                      >
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Trailing spacer — gives last card room on desktop */}
          {!isMobile && (
            <div className="flex-shrink-0" style={{ width: "5vw" }} />
          )}
        </div>

        {/* ---- Progress bar (desktop only) ---- */}
        {!isMobile && (
          <div
            className="absolute bottom-0 left-0 w-full"
            style={{ height: "2px", background: "var(--color-cream-dark)" }}
          >
            <div
              ref={progressRef}
              style={{
                height: "100%",
                width: "100%",
                background: "var(--color-gold)",
                transformOrigin: "left center",
                transform: "scaleX(0)",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
