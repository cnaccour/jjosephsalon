import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const REVIEWS = [
  { text: "Truly the best stylist", author: "Jhoanny S.", size: "lg" },
  { text: "My hair has never looked this good", author: "Maria K.", size: "md" },
  { text: "Clean, precise fade with sharp lines", author: "Alexis W.", size: "sm" },
  { text: "She really listens to what I wanted", author: "Anvesh K.", size: "md" },
  { text: "I wouldn't trust anyone else with my hair", author: "Jhoanny S.", size: "lg" },
  { text: "Professional, efficient, and easy to talk to", author: "Alexis W.", size: "sm" },
  { text: "Babying and nourishing my hair back to health", author: "Maria K.", size: "md" },
  { text: "Delivered exactly what I was hoping for", author: "Anvesh K.", size: "sm" },
  { text: "Five years and she never disappoints", author: "Jhoanny S.", size: "lg" },
  { text: "The best men's haircut I've had", author: "Alexis W.", size: "md" },
  { text: "I will definitely come back again", author: "Anvesh K.", size: "sm" },
  { text: "Her attention to detail really shows", author: "Alexis W.", size: "md" },
] as const;

type ReviewSize = "lg" | "md" | "sm";

const SIZE_STYLES: Record<ReviewSize, { fontSize: string; opacity: number }> = {
  lg: { fontSize: "1.3rem", opacity: 0.7 },
  md: { fontSize: "0.95rem", opacity: 0.5 },
  sm: { fontSize: "0.78rem", opacity: 0.35 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene5Quote() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const excerpts = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-excerpt]"),
      );

      if (!excerpts.length) return;

      excerpts.forEach((el) => {
        const targetOpacity = parseFloat(
          el.getAttribute("data-target-opacity") || "0.5",
        );

        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: targetOpacity,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      style={{ background: "var(--color-black)" }}
    >
      <div
        style={{
          padding: "clamp(80px, 10vw, 100px) clamp(24px, 4vw, 48px)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* ---- Header ---- */}
        <div style={{ marginBottom: 56 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "clamp(3rem, 5vw, 4rem)",
                color: "var(--color-cream)",
                lineHeight: 1,
              }}
            >
              5.0
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "rgba(244, 241, 235, 0.4)",
                lineHeight: 1.4,
              }}
            >
              789+ five-star reviews on Google
            </span>
          </div>

          <a
            href="https://www.google.com/search?q=j+joseph+salon+reviews"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "var(--color-gold)",
              borderBottom: "1px solid var(--color-gold)",
              paddingBottom: 1,
              textDecoration: "none",
            }}
          >
            Read reviews on Google &rarr;
          </a>
        </div>

        {/* ---- Review wall ---- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="review-wall"
        >
          {REVIEWS.map((review, i) => {
            const sizeStyle = SIZE_STYLES[review.size as ReviewSize];

            return (
              <div
                key={i}
                data-excerpt
                data-target-opacity={sizeStyle.opacity}
                style={{ opacity: 0 }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: sizeStyle.fontSize,
                    color: "var(--color-cream)",
                    lineHeight: 1.5,
                    marginBottom: 8,
                  }}
                >
                  {review.text}
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.65rem",
                    color: "rgba(244, 241, 235, 0.25)",
                    lineHeight: 1,
                  }}
                >
                  — {review.author}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Responsive: 2 columns on mobile ---- */}
      <style>{`
        @media (max-width: 640px) {
          .review-wall {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
