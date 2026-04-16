import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HEADLINE_WORDS = ["Where", "Artistry", "Meets", "Excellence."];

function isGoldItalic(word: string) {
  return word === "Excellence.";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene1Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      /* --- Overline --- */
      gsap.fromTo(
        ".hero-overline",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease }
      );

      /* --- Headline word reveals --- */
      gsap.fromTo(
        ".word-inner",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease,
          stagger: 0.1,
          delay: 0.5,
        }
      );

      /* --- Subtext --- */
      gsap.fromTo(
        ".hero-subtext",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.4, ease }
      );

      /* --- CTA --- */
      gsap.fromTo(
        ".hero-cta",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 1.7, ease }
      );

      /* --- Scroll indicator --- */
      gsap.fromTo(
        ".hero-scroll-indicator",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 2.0, ease }
      );

      /* Pulse for the scroll line */
      gsap.to(".hero-scroll-line", {
        opacity: 0.25,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.4,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* ---- SEO H1 (visually hidden) ---- */}
      <h1 className="sr-only">
        J. Joseph Salon — Voted Best Hair Salon in Tampa Bay
      </h1>

      {/* ---- Background placeholder ---- */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br from-[var(--color-black)] via-[var(--color-black-warm)] to-[var(--color-surface)]">
        <span className="select-none text-sm tracking-widest text-[var(--color-cream)]/20 font-[var(--font-body)]">
          [ Video Background ]
        </span>
      </div>

      {/* ---- Gradient overlay ---- */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, var(--color-black) 0%, transparent 50%, rgba(12,11,9,0.45) 100%)",
        }}
      />

      {/* ---- Content ---- */}
      <div className="relative z-[2] flex h-full flex-col justify-end px-6 pb-6 md:px-12 md:pb-12">
        {/* Overline */}
        <p
          className="hero-overline mb-5 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--color-gold)] opacity-0 md:mb-6 md:text-xs"
          aria-hidden="true"
        >
          Voted Best in Tampa Bay
        </p>

        {/* Visual headline (aria-hidden, decorative) */}
        <div
          aria-hidden="true"
          className="mb-6 md:mb-8"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
          }}
        >
          <div className="flex flex-wrap gap-x-[0.22em]">
            {HEADLINE_WORDS.map((word) => (
              <span key={word} className="word inline-block overflow-hidden">
                <span
                  className="word-inner inline-block translate-y-[110%]"
                  style={
                    isGoldItalic(word)
                      ? {
                          fontFamily: "var(--font-body)",
                          fontStyle: "italic",
                          fontWeight: 400,
                          color: "var(--color-gold)",
                        }
                      : {
                          fontFamily: "var(--font-heading)",
                          fontWeight: 700,
                          color: "var(--color-cream)",
                        }
                  }
                >
                  {word}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom row: left = subtext + CTA, right = reserved for video */}
        <div className="flex flex-col justify-between md:flex-row md:items-end">
          {/* Left column */}
          <div className="flex flex-col gap-5 md:gap-6">
            <p className="hero-subtext max-w-[380px] text-sm leading-relaxed text-[var(--color-cream)]/40 opacity-0 md:text-[15px]">
              Five salons across Tampa Bay. World-traveled stylists. One
              uncompromising standard.
            </p>

            <a
              href="/book"
              className="hero-cta group inline-flex items-center gap-1.5 border-b border-[var(--color-gold)] pb-0.5 text-sm text-[var(--color-cream)] opacity-0 transition-colors hover:text-[var(--color-gold)] w-fit"
            >
              Request Appointment
              <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
          </div>

          {/* Right column — reserved for video content */}
          <div className="hidden md:block" />
        </div>

        {/* ---- Scroll indicator (bottom center) ---- */}
        <div className="hero-scroll-indicator absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 flex-col items-center gap-2 opacity-0 md:bottom-12">
          <span className="hero-scroll-line block h-12 w-px bg-[var(--color-gold)]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-cream)]/30">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
