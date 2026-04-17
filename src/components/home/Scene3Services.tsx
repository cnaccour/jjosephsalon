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
const PANEL_W_DESKTOP = 380;
const PANEL_W_MOBILE = 280;
const IMG_H_DESKTOP = 360;
const IMG_H_MOBILE = 300;

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

  /* ---- Drag-to-scroll (mobile) ---- */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!isMobile) return;
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
      <div
        className="relative overflow-hidden"
        style={{ height: isMobile ? "auto" : "auto" }}
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
              : "flex gap-6 px-6 md:px-12 pb-10"
          }
          style={{
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
                width: isMobile ? PANEL_W_MOBILE : PANEL_W_DESKTOP,
                minWidth: isMobile ? PANEL_W_MOBILE : PANEL_W_DESKTOP,
              }}
            >
              {/* Image area */}
              <div
                className="relative overflow-hidden rounded-sm"
                style={{
                  height: isMobile ? IMG_H_MOBILE : IMG_H_DESKTOP,
                  background: "var(--color-cream-dark)",
                }}
              >
                {/* Gold numbered label */}
                <span
                  className="absolute top-3 left-3 z-10 text-xs tracking-widest"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 500,
                    color: "var(--color-gold)",
                  }}
                >
                  {pad(i + 1)}
                </span>

                {/* Placeholder for image */}
                <div className="flex h-full w-full items-center justify-center">
                  <span
                    className="select-none text-xs tracking-wide opacity-25"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--color-black)",
                    }}
                  >
                    [ {service.name} ]
                  </span>
                </div>
              </div>

              {/* Text area below image */}
              <div className="pt-3 pb-1">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    lineHeight: 1.3,
                    color: "var(--color-black)",
                  }}
                >
                  {service.name}
                </h3>

                <p
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    lineHeight: 1.5,
                    color: "var(--color-cream-dark)",
                    mixBlendMode: "multiply",
                    opacity: 0.45,
                  }}
                >
                  {service.description}
                </p>

                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                    color: "var(--color-gold)",
                  }}
                >
                  {service.price_from === "Consultation"
                    ? "Consultation"
                    : `From ${service.price_from}`}
                </span>
              </div>
            </article>
          ))}

          {/* Trailing spacer on desktop */}
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
