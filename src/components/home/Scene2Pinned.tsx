import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const MOMENTS = [
  {
    step: "01",
    heading: "Five Salons. One Standard.",
    body: "Serving Pasco and Hillsborough County with masterful artistry and world-class service.",
    imageLabel: "Salon Interior",
  },
  {
    step: "02",
    heading: "World-Traveled Stylists",
    body: "Our team has styled for fashion houses worldwide. Every stylist completes our Principle-Based Design training.",
    imageLabel: "Stylist at Work",
  },
  {
    step: "03",
    heading: "Elite Redken Salon",
    body: "We offer the full line of Redken and Pureology hair care, ensuring premium results for every guest.",
    imageLabel: "Redken Products",
  },
] as const;

const TOTAL = MOMENTS.length;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Scene2Pinned() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const moments = wrapper.querySelectorAll<HTMLElement>("[data-moment]");
      if (moments.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      /*
       * Timeline distribution across the 0-1 progress range:
       *   0.00 – 0.33  moment 1 visible
       *   0.33 – 0.40  crossfade 1 → 2
       *   0.40 – 0.66  moment 2 visible
       *   0.66 – 0.73  crossfade 2 → 3
       *   0.73 – 1.00  moment 3 visible
       *
       * Total duration expressed in arbitrary units — percentages
       * become proportional labels.
       */
      const DURATION = 100;

      // Hold moment 1 (0 → 33)
      tl.to({}, { duration: 33 });

      // Crossfade 1 → 2 (33 → 40)
      tl.to(
        moments[0],
        {
          opacity: 0,
          duration: 7,
          ease: "power1.inOut",
        },
        33,
      );
      tl.fromTo(
        moments[0].querySelector("[data-text]"),
        { y: 0 },
        { y: -24, duration: 7, ease: "power1.inOut" },
        33,
      );
      tl.fromTo(
        moments[1],
        { opacity: 0 },
        { opacity: 1, duration: 7, ease: "power1.inOut" },
        33,
      );
      tl.fromTo(
        moments[1].querySelector("[data-text]"),
        { y: 24 },
        { y: 0, duration: 7, ease: "power1.inOut" },
        33,
      );
      tl.fromTo(
        moments[1].querySelector("[data-step]"),
        { opacity: 0 },
        { opacity: 1, duration: 7, ease: "power1.inOut" },
        33,
      );

      // Hold moment 2 (40 → 66)
      tl.to({}, { duration: 26 }, 40);

      // Crossfade 2 → 3 (66 → 73)
      tl.to(
        moments[1],
        {
          opacity: 0,
          duration: 7,
          ease: "power1.inOut",
        },
        66,
      );
      tl.fromTo(
        moments[1].querySelector("[data-text]"),
        { y: 0 },
        { y: -24, duration: 7, ease: "power1.inOut" },
        66,
      );
      tl.fromTo(
        moments[2],
        { opacity: 0 },
        { opacity: 1, duration: 7, ease: "power1.inOut" },
        66,
      );
      tl.fromTo(
        moments[2].querySelector("[data-text]"),
        { y: 24 },
        { y: 0, duration: 7, ease: "power1.inOut" },
        66,
      );
      tl.fromTo(
        moments[2].querySelector("[data-step]"),
        { opacity: 0 },
        { opacity: 1, duration: 7, ease: "power1.inOut" },
        66,
      );

      // Hold moment 3 (73 → 100)
      tl.to({}, { duration: 27 }, 73);
    },
    { scope: wrapperRef },
  );

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ height: "300vh", background: "var(--color-black)" }}
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh" }}
      >
        {MOMENTS.map((m, i) => (
          <div
            key={m.step}
            data-moment
            className="absolute inset-0"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* Step indicator — top right */}
            <div
              data-step
              className="absolute top-6 right-6 z-10 font-heading text-sm tracking-widest md:top-10 md:right-10"
              style={{
                color: "var(--color-gold)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {m.step} / 0{TOTAL}
            </div>

            {/* Two-column grid */}
            <div className="grid h-full grid-cols-1 md:grid-cols-2">
              {/* Text column */}
              <div
                data-text
                className="flex flex-col justify-center px-6 py-12 md:px-12"
                style={{ padding: undefined }}
              >
                <div className="max-w-xl px-6 md:px-12">
                  <h2
                    className="font-heading font-bold leading-tight"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      color: "var(--color-cream)",
                      lineHeight: 1.1,
                    }}
                  >
                    {m.heading}
                  </h2>
                  <p
                    className="mt-5 max-w-md text-base leading-relaxed md:text-lg"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--color-cream-dark)",
                    }}
                  >
                    {m.body}
                  </p>
                </div>
              </div>

              {/* Image placeholder column */}
              <div
                className="flex items-center justify-center"
                style={{ background: "var(--color-cream-dark)" }}
              >
                <span
                  className="select-none text-sm tracking-wide opacity-40"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-black)",
                  }}
                >
                  [ {m.imageLabel} ]
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
