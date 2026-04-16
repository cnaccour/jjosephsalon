import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const REVIEWS = [
  {
    text: "I've been seeing Kariny for over five years, and she is truly the best stylist. Her talent, professionalism, and attention to detail always exceed my expectations. I wouldn't trust anyone else with my hair!",
    author: "Jhoanny S.",
  },
  {
    text: "Pheobe is amazing. My hair was destroyed by a stylist in the past so I was very hesitant to ever come to a salon again. She has been babying and nourishing my hair back to health.",
    author: "Maria K.",
  },
  {
    text: "Karissa did a great job on my haircut! She is very sweet, patient, and really listens to what I wanted. She understood my needs and delivered exactly what I was hoping for.",
    author: "Anvesh K.",
  },
  {
    text: "Serena gave me one of the best men's haircuts I've had. She listened carefully, understood exactly what I wanted, and delivered a clean, precise fade with sharp lines and perfect blending.",
    author: "Alexis W.",
  },
] as const;

const TOTAL = REVIEWS.length;
const ROTATION_INTERVAL = 8;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene5Quote() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLSpanElement>(null);
  const quoteRef = useRef<HTMLBlockquoteElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const rotationTween = useRef<gsap.core.Tween | null>(null);
  const progressObj = useRef({ value: 0 });
  const isInView = useRef(false);

  /* ---- Navigate to a specific review ---- */
  const goTo = useCallback(
    (next: number) => {
      const quote = quoteRef.current;
      const author = authorRef.current;
      if (!quote || !author) return;

      /* Kill any running rotation tween so it doesn't stack */
      rotationTween.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          /* Restart auto-rotation timer after manual nav or auto cycle */
          if (isInView.current) {
            startAutoRotation(next);
          }
        },
      });

      /* Fade out */
      tl.to([quote, author], {
        opacity: 0,
        y: -10,
        duration: 0.45,
        ease: "power2.in",
        stagger: 0.05,
      });

      /* Swap text at the midpoint */
      tl.call(() => setActiveIndex(next));

      /* Fade in */
      tl.fromTo(
        [quote, author],
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
        },
      );
    },
    [],
  );

  /* ---- Auto-rotation helper ---- */
  const startAutoRotation = useCallback(
    (fromIndex: number) => {
      rotationTween.current?.kill();
      progressObj.current.value = 0;

      rotationTween.current = gsap.to(progressObj.current, {
        value: 1,
        duration: ROTATION_INTERVAL,
        ease: "none",
        onComplete: () => {
          const next = (fromIndex + 1) % TOTAL;
          goTo(next);
        },
      });
    },
    [goTo],
  );

  /* ---- GSAP setup ---- */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      /* --- Parallax on "5.0" background text --- */
      gsap.fromTo(
        bgTextRef.current,
        { xPercent: -8 },
        {
          xPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      /* --- Staggered entrance for stars, quote, author --- */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      });

      entranceTl.fromTo(
        ".quote-stars",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      );
      entranceTl.fromTo(
        quoteRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.4",
      );
      entranceTl.fromTo(
        authorRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.35",
      );

      /* --- Viewport-aware auto-rotation --- */
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          isInView.current = true;
          startAutoRotation(activeIndex);
        },
        onEnterBack: () => {
          isInView.current = true;
          startAutoRotation(activeIndex);
        },
        onLeave: () => {
          isInView.current = false;
          rotationTween.current?.kill();
        },
        onLeaveBack: () => {
          isInView.current = false;
          rotationTween.current?.kill();
        },
      });
    },
    { scope: sectionRef, dependencies: [] },
  );

  /* ---- Handlers ---- */
  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + TOTAL) % TOTAL);
  }, [activeIndex, goTo]);

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % TOTAL);
  }, [activeIndex, goTo]);

  /* ---- Render ---- */
  const review = REVIEWS[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "var(--color-black)",
        minHeight: "80vh",
      }}
    >
      {/* ---- Giant "5.0" background text ---- */}
      <span
        ref={bgTextRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center"
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: "clamp(10rem, 25vw, 20rem)",
          color: "var(--color-gold)",
          opacity: 0.04,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        5.0
      </span>

      {/* ---- Content ---- */}
      <div
        className="relative z-10 mx-auto flex flex-col items-center text-center"
        style={{
          maxWidth: 800,
          padding: "clamp(80px, 10vw, 120px) clamp(24px, 4vw, 48px)",
        }}
      >
        {/* Stars */}
        <div
          className="quote-stars"
          style={{
            color: "var(--color-gold)",
            fontSize: "1.1rem",
            letterSpacing: 6,
            marginBottom: 40,
            opacity: 0,
          }}
          aria-label="5 out of 5 stars"
        >
          &#9733; &#9733; &#9733; &#9733; &#9733;
        </div>

        {/* Quote */}
        <blockquote
          ref={quoteRef}
          className="relative"
          style={{
            maxWidth: 700,
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "clamp(1.2rem, 2.2vw, 1.8rem)",
            lineHeight: 1.6,
            color: "rgba(244, 241, 235, 0.85)",
            marginBottom: 32,
            opacity: 0,
          }}
        >
          &ldquo;{review.text}&rdquo;
        </blockquote>

        {/* Author */}
        <p
          ref={authorRef}
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-cream)",
            marginBottom: 48,
            opacity: 0,
          }}
        >
          {review.author}
        </p>

        {/* ---- Navigation dots ---- */}
        <div
          className="flex items-center gap-5"
          style={{ marginBottom: 40 }}
          role="tablist"
          aria-label="Review navigation"
        >
          {/* Prev arrow */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous review"
            className="transition-opacity hover:opacity-100"
            style={{
              background: "none",
              border: "none",
              color: "rgba(244, 241, 235, 0.35)",
              fontSize: "0.85rem",
              padding: "4px 8px",
              cursor: "none",
            }}
          >
            &#8592;
          </button>

          {/* Dots */}
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Review ${i + 1}`}
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 6,
                height: 6,
                borderRadius: 100,
                background:
                  i === activeIndex
                    ? "var(--color-gold)"
                    : "rgba(244, 241, 235, 0.15)",
                border: "none",
                padding: 0,
                cursor: "none",
              }}
            />
          ))}

          {/* Next arrow */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next review"
            className="transition-opacity hover:opacity-100"
            style={{
              background: "none",
              border: "none",
              color: "rgba(244, 241, 235, 0.35)",
              fontSize: "0.85rem",
              padding: "4px 8px",
              cursor: "none",
            }}
          >
            &#8594;
          </button>
        </div>

        {/* ---- Google badge ---- */}
        <div
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.62rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--color-cream)",
              }}
            >
              5.0
            </span>
            <span style={{ color: "rgba(244, 241, 235, 0.35)" }}>
              {" "}
              &middot; 789+ Reviews on Google
            </span>
          </span>
        </div>

        {/* ---- Read all reviews link ---- */}
        <a
          href="https://www.google.com/search?q=j+joseph+salon+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-gold)",
            borderBottom: "1px solid var(--color-gold)",
            paddingBottom: 2,
            textDecoration: "none",
          }}
        >
          Read All Reviews
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">
            &rarr;
          </span>
        </a>
      </div>
    </section>
  );
}
