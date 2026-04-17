import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

const SLIDES = [
  {
    title: "Balayage",
    subtitle: "Signature techniques premiered at fashion shows worldwide.",
    cta: "Request Appointment",
    image: "/images/services/balayage.webp",
  },
  {
    title: "Cut & Style",
    subtitle: "Custom precision haircuts for every face, every lifestyle.",
    cta: "Explore Services",
    image: "/images/services/cut-style.webp",
  },
  {
    title: "Color",
    subtitle:
      "From retouches to full transformations. Your vision, our artistry.",
    cta: "Request Appointment",
    image: "/images/services/color.webp",
  },
  {
    title: "Extensions",
    subtitle: "JJS-certified installations for volume and length.",
    cta: "Request Appointment",
    image: "/images/services/extensions.webp",
  },
];

const SLIDE_COUNT = SLIDES.length;
const ADVANCE_DURATION = 5;
const CROSSFADE_DURATION = 0.8;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene1Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<gsap.core.Tween | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const isTransitioningRef = useRef(false);

  const [current, setCurrent] = useState(0);

  /* -------------------------------------------------------------- */
  /*  Go to a specific slide                                         */
  /* -------------------------------------------------------------- */

  const goToSlide = useCallback(
    (next: number) => {
      if (isTransitioningRef.current) return;
      if (!containerRef.current) return;

      isTransitioningRef.current = true;

      const slides = containerRef.current.querySelectorAll<HTMLDivElement>(
        "[data-hero-slide]",
      );
      const currentSlide = slides[current];
      const nextSlide = slides[next];

      if (!currentSlide || !nextSlide) {
        isTransitioningRef.current = false;
        return;
      }

      /* Reset progress bar */
      if (progressRef.current) {
        progressRef.current.kill();
      }

      const bar =
        containerRef.current.querySelector<HTMLDivElement>("[data-progress]");
      if (bar) {
        gsap.set(bar, { scaleX: 0 });
      }

      /* Prepare next slide */
      gsap.set(nextSlide, { opacity: 0, zIndex: 2 });
      gsap.set(currentSlide, { zIndex: 1 });

      /* Crossfade */
      const tl = gsap.timeline({
        onComplete: () => {
          /* Clean up z-index */
          gsap.set(currentSlide, { opacity: 0, zIndex: 0 });
          gsap.set(nextSlide, { zIndex: 1 });

          setCurrent(next);
          isTransitioningRef.current = false;
        },
      });

      tl.to(currentSlide, {
        opacity: 0,
        duration: CROSSFADE_DURATION,
        ease: "power2.inOut",
      });

      tl.to(
        nextSlide,
        {
          opacity: 1,
          duration: CROSSFADE_DURATION,
          ease: "power2.inOut",
        },
        "<",
      );

      /* Text entrance on next slide */
      const nextTitle = nextSlide.querySelector("[data-slide-title]");
      const nextSub = nextSlide.querySelector("[data-slide-subtitle]");
      const nextCta = nextSlide.querySelector("[data-slide-cta]");
      const nextOverline = nextSlide.querySelector("[data-slide-overline]");

      const textTargets = [nextOverline, nextTitle, nextSub, nextCta].filter(
        Boolean,
      );

      gsap.set(textTargets, { opacity: 0 });
      if (nextTitle) gsap.set(nextTitle, { y: 20 });

      tl.to(
        nextTitle,
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        `-=${CROSSFADE_DURATION * 0.3}`,
      );

      if (nextOverline) {
        tl.to(
          nextOverline,
          { opacity: 1, duration: 0.4, ease: "power2.out" },
          "<0.05",
        );
      }

      tl.to(
        nextSub,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        "<0.15",
      );

      tl.to(
        nextCta,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        "<0.15",
      );
    },
    [current],
  );

  /* -------------------------------------------------------------- */
  /*  Advance to next slide                                          */
  /* -------------------------------------------------------------- */

  const advance = useCallback(() => {
    const next = (current + 1) % SLIDE_COUNT;
    goToSlide(next);
  }, [current, goToSlide]);

  /* -------------------------------------------------------------- */
  /*  Start the progress bar + schedule auto-advance                 */
  /* -------------------------------------------------------------- */

  const startProgress = useCallback(() => {
    if (!containerRef.current) return;

    const bar =
      containerRef.current.querySelector<HTMLDivElement>("[data-progress]");
    if (!bar) return;

    gsap.set(bar, { scaleX: 0 });

    progressRef.current = gsap.to(bar, {
      scaleX: 1,
      duration: ADVANCE_DURATION,
      ease: "none",
      onComplete: () => {
        if (!isPausedRef.current) {
          advance();
        }
      },
    });
  }, [advance]);

  /* -------------------------------------------------------------- */
  /*  Initial setup + restart progress on slide change               */
  /* -------------------------------------------------------------- */

  useGSAP(
    () => {
      if (!containerRef.current) return;

      /* Make the first slide visible, all others hidden */
      const slides = containerRef.current.querySelectorAll<HTMLDivElement>(
        "[data-hero-slide]",
      );
      slides.forEach((slide, i) => {
        gsap.set(slide, { opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 });
      });

      /* Entrance animation for the first slide */
      const firstSlide = slides[0];
      if (firstSlide) {
        const title = firstSlide.querySelector("[data-slide-title]");
        const sub = firstSlide.querySelector("[data-slide-subtitle]");
        const cta = firstSlide.querySelector("[data-slide-cta]");
        const overline = firstSlide.querySelector("[data-slide-overline]");

        if (title) {
          gsap.fromTo(
            title,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power2.out" },
          );
        }
        if (overline) {
          gsap.fromTo(
            overline,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.35, ease: "power2.out" },
          );
        }
        if (sub) {
          gsap.fromTo(
            sub,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.5, ease: "power2.out" },
          );
        }
        if (cta) {
          gsap.fromTo(
            cta,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, delay: 0.65, ease: "power2.out" },
          );
        }
      }
    },
    { scope: containerRef },
  );

  /* Restart progress bar whenever current slide changes */
  useEffect(() => {
    startProgress();
    return () => {
      if (progressRef.current) {
        progressRef.current.kill();
      }
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [current, startProgress]);

  /* -------------------------------------------------------------- */
  /*  Hover pause / resume (desktop only)                            */
  /* -------------------------------------------------------------- */

  const handleMouseEnter = useCallback(() => {
    isPausedRef.current = true;
    if (progressRef.current) {
      progressRef.current.pause();
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    isPausedRef.current = false;
    if (progressRef.current) {
      progressRef.current.resume();
    }
  }, []);

  /* -------------------------------------------------------------- */
  /*  Render                                                         */
  /* -------------------------------------------------------------- */

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <style>{`
        .hero-slider {
          position: relative;
          height: 75vh;
          width: 100%;
          overflow: hidden;
          background-color: var(--color-black);
        }
        @media (max-width: 768px) {
          .hero-slider {
            height: 65vh;
          }
        }
        .hero-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .hero-slide-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-slide-placeholder {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-cream-dark);
        }
        .hero-slide-gradient {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(12, 11, 9, 0.7) 0%,
            rgba(12, 11, 9, 0.55) 30%,
            rgba(12, 11, 9, 0.15) 55%,
            transparent 65%
          );
          z-index: 1;
        }
        .hero-slide-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 48px;
          padding-right: 48px;
        }
        @media (max-width: 768px) {
          .hero-slide-content {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
        .hero-progress-track {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: rgba(175, 131, 26, 0.15);
          z-index: 10;
        }
        .hero-progress-bar {
          width: 100%;
          height: 100%;
          background-color: var(--color-gold);
          transform-origin: left center;
          transform: scaleX(0);
        }
        .hero-counter {
          position: absolute;
          bottom: 1.25rem;
          right: 1.5rem;
          z-index: 10;
          font-family: var(--font-body);
          font-size: 0.7rem;
          color: var(--color-cream);
          opacity: 0.3;
          letter-spacing: 0.06em;
          user-select: none;
        }
        @media (max-width: 768px) {
          .hero-counter {
            right: 24px;
            bottom: 1rem;
          }
        }
      `}</style>

      <section
        ref={containerRef}
        className="hero-slider"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Service highlights"
      >
        {/* ---- SEO H1 (visually hidden) ---- */}
        <h1 className="sr-only">
          J. Joseph Salon — Voted Best Hair Salon in Tampa Bay
        </h1>

        {/* ---- Slides ---- */}
        {SLIDES.map((slide, i) => (
          <div
            key={slide.title}
            data-hero-slide
            className="hero-slide"
            aria-hidden={i !== current}
          >
            {/* Image / placeholder */}
            <div className="hero-slide-placeholder">
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  color: "var(--color-black)",
                  opacity: 0.3,
                  letterSpacing: "0.02em",
                  userSelect: "none",
                }}
              >
                [ {slide.title} ]
              </span>
            </div>

            {/* Gradient overlay */}
            <div className="hero-slide-gradient" />

            {/* Text content */}
            <div className="hero-slide-content">
              {/* Overline — first slide only */}
              {i === 0 && (
                <p
                  data-slide-overline
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    color: "var(--color-gold)",
                    marginBottom: "1rem",
                  }}
                >
                  Voted Best in Tampa Bay
                </p>
              )}

              {/* Title */}
              <h2
                data-slide-title
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 1.05,
                  color: "var(--color-cream)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p
                data-slide-subtitle
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--color-cream)",
                  opacity: 0.5,
                  maxWidth: "380px",
                  marginBottom: "1.25rem",
                }}
              >
                {slide.subtitle}
              </p>

              {/* CTA */}
              <a
                data-slide-cta
                href="/book"
                className="group"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "var(--color-cream)",
                  borderBottom: "1px solid var(--color-gold)",
                  paddingBottom: "2px",
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                {slide.cta}
                <span
                  className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </a>
            </div>
          </div>
        ))}

        {/* ---- Progress bar ---- */}
        <div className="hero-progress-track">
          <div data-progress className="hero-progress-bar" />
        </div>

        {/* ---- Slide counter ---- */}
        <div className="hero-counter" aria-live="polite" aria-atomic="true">
          {pad(current + 1)} / {pad(SLIDE_COUNT)}
        </div>
      </section>
    </>
  );
}
