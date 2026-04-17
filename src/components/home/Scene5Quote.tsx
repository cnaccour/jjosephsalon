import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Review {
  text: string;
  author: string;
}

interface Props {
  review: Review;
}

export default function Scene5Review({ review }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const els = sectionRef.current.querySelectorAll("[data-reveal]");
      gsap.fromTo(
        els,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--color-surface)",
        padding: "clamp(60px, 8vw, 80px) clamp(24px, 4vw, 48px)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <p
          data-reveal
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            lineHeight: 1.7,
            color: "rgba(244, 241, 235, 0.7)",
            marginBottom: 20,
          }}
        >
          {review.text}
        </p>
        <div
          data-reveal
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-cream)",
              letterSpacing: "0.02em",
            }}
          >
            {review.author}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              color: "rgba(244, 241, 235, 0.25)",
            }}
          >
            5.0 on Google · 789+ reviews
          </span>
        </div>
      </div>
    </section>
  );
}
