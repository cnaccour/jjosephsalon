import { useRef, useEffect, useState } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Only activate for fine-pointer (desktop) devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setActive(true);

    const pos = { x: 0, y: 0 };
    const rendered = { x: 0, y: 0 };
    const lerp = 0.12;
    let hovering = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
    };

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        hovering = true;
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        hovering = false;
      }
    };

    const tick = () => {
      rendered.x += (pos.x - rendered.x) * lerp;
      rendered.y += (pos.y - rendered.y) * lerp;

      if (dotRef.current) {
        const scale = hovering ? 3.5 : 1;
        dotRef.current.style.transform = `translate(-50%, -50%) translate3d(${rendered.x}px, ${rendered.y}px, 0) scale(${scale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] w-3 h-3 rounded-full bg-gold mix-blend-difference pointer-events-none"
      style={{
        transform: "translate(-50%, -50%) translate3d(-100px, -100px, 0) scale(1)",
        transition: "width 0.3s, height 0.3s",
      }}
      aria-hidden="true"
    />
  );
}
