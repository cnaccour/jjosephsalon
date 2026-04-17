import { useRef, useEffect, useCallback, useState } from "react";

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

const PANEL_W_DESKTOP = 380;
const PANEL_W_MOBILE = 280;
const IMG_H_DESKTOP = 360;
const IMG_H_MOBILE = 300;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene3Services({ services }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  /* ---- Drag-to-scroll (desktop + mobile) ---- */
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const hasMoved = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.clientX;
    scrollStart.current = track.scrollLeft;
    track.style.cursor = "grabbing";
    track.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const track = trackRef.current;
    if (!track) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 3) hasMoved.current = true;
    track.scrollLeft = scrollStart.current - dx;
  }, []);

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
      style={{
        background: "var(--color-cream)",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}
    >
      {/* ---- Header row ---- */}
      <div
        className="flex items-baseline justify-between"
        style={{
          paddingLeft: "clamp(24px, 4vw, 48px)",
          paddingRight: "clamp(24px, 4vw, 48px)",
          paddingBottom: "24px",
        }}
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
          className="group inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] transition-opacity hover:opacity-70"
          style={{ color: "var(--color-gold)" }}
        >
          Full Menu &amp; Pricing
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </a>
      </div>

      {/* ---- Horizontal scroll track ---- */}
      <div
        ref={trackRef}
        className="scrollbar-none"
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          paddingLeft: "clamp(24px, 4vw, 48px)",
          paddingRight: "clamp(24px, 4vw, 48px)",
          paddingBottom: "8px",
          cursor: "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {services.map((service, i) => (
          <article
            key={service.id}
            className="flex-shrink-0"
            style={{
              width: `clamp(${PANEL_W_MOBILE}px, 30vw, ${PANEL_W_DESKTOP}px)`,
              minWidth: `clamp(${PANEL_W_MOBILE}px, 30vw, ${PANEL_W_DESKTOP}px)`,
              scrollSnapAlign: "start",
            }}
          >
            {/* Image area */}
            <div
              className="relative overflow-hidden rounded-sm"
              style={{
                height: `clamp(${IMG_H_MOBILE}px, 28vw, ${IMG_H_DESKTOP}px)`,
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

        {/* Trailing spacer so last card isn't flush with edge */}
        <div className="flex-shrink-0" style={{ width: "1px" }} />
      </div>
    </section>
  );
}
