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
        { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease },
      );

      /* --- Headline word reveals --- */
      gsap.fromTo(
        ".word-inner",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1,
          ease,
          stagger: 0.08,
          delay: 0.5,
        },
      );

      /* --- Subtext --- */
      gsap.fromTo(
        ".hero-subtext",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.3, ease },
      );

      /* --- CTA --- */
      gsap.fromTo(
        ".hero-cta",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, delay: 1.6, ease },
      );

      /* --- Proof line --- */
      gsap.fromTo(
        ".hero-proof",
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 1.8, ease },
      );

      /* --- Scroll indicator --- */
      gsap.fromTo(
        ".hero-scroll-indicator",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.5, ease },
      );

      /* Pulse for the scroll line */
      gsap.to(".hero-scroll-line", {
        opacity: 0.25,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.0,
      });
    },
    { scope: containerRef },
  );

  return (
    <>
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 55fr 45fr;
          grid-template-rows: 1fr;
          height: 100vh;
          height: 100svh;
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 60vh 40vh;
          }
          .hero-text-col {
            padding: 0 24px !important;
          }
        }
      `}</style>

      <section ref={containerRef} className="hero-grid">
        {/* ---- SEO H1 (visually hidden) ---- */}
        <h1 className="sr-only">
          J. Joseph Salon — Voted Best Hair Salon in Tampa Bay
        </h1>

        {/* ========================================================== */}
        {/*  Left side — text column                                    */}
        {/* ========================================================== */}
        <div
          className="hero-text-col relative z-10 flex flex-col justify-center"
          style={{
            backgroundColor: "var(--color-black)",
            padding: "0 64px",
          }}
        >
          {/* Overline */}
          <p
            className="hero-overline"
            aria-hidden="true"
            style={{
              color: "var(--color-gold)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.05em",
              marginBottom: "1.5rem",
              fontFamily: "var(--font-body)",
              opacity: 0,
            }}
          >
            Voted Best in Tampa Bay
          </p>

          {/* Visual headline (aria-hidden, decorative) */}
          <div
            aria-hidden="true"
            style={{
              fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: "1.75rem",
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

          {/* Subtext */}
          <p
            className="hero-subtext"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              color: "var(--color-cream)",
              maxWidth: "360px",
              marginBottom: "1.5rem",
              opacity: 0,
            }}
          >
            <span style={{ opacity: 0.4 }}>
              Five salons across Tampa Bay. World-traveled stylists. One
              uncompromising standard.
            </span>
          </p>

          {/* CTA */}
          <a
            href="/book"
            className="hero-cta group inline-flex items-center gap-1.5"
            style={{
              color: "var(--color-cream)",
              borderBottom: "1px solid var(--color-gold)",
              paddingBottom: "2px",
              fontSize: "0.8rem",
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              textDecoration: "none",
              width: "fit-content",
              marginBottom: "1.25rem",
              opacity: 0,
            }}
          >
            Request Appointment
            <span
              className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            >
              &rarr;
            </span>
          </a>

          {/* Proof line */}
          <p
            className="hero-proof"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "var(--color-cream)",
              opacity: 0,
            }}
          >
            <span style={{ opacity: 0.3 }}>
              5.0 on Google &middot; 789+ Reviews
            </span>
          </p>
        </div>

        {/* ========================================================== */}
        {/*  Right side — image column                                  */}
        {/* ========================================================== */}
        <div
          className="hero-image-col relative flex items-center justify-center"
          style={{
            backgroundColor: "var(--color-cream-dark)",
          }}
        >
          <span
            className="select-none"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              color: "var(--color-black)",
              opacity: 0.3,
              letterSpacing: "0.02em",
            }}
          >
            [ Editorial photograph ]
          </span>
        </div>

        {/* ========================================================== */}
        {/*  Scroll indicator — spans full width at bottom              */}
        {/* ========================================================== */}
        <div
          className="hero-scroll-indicator"
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 20,
            opacity: 0,
          }}
        >
          <span
            className="hero-scroll-line"
            style={{
              display: "block",
              width: "1px",
              height: "32px",
              backgroundColor: "var(--color-gold)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.55rem",
              letterSpacing: "0.08em",
              color: "var(--color-cream)",
              opacity: 0.25,
            }}
          >
            Scroll
          </span>
        </div>
      </section>
    </>
  );
}
