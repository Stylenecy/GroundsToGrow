"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Headline hero dengan animasi Fraunces (variable font).
 * - Saat masuk viewport: opsz/wght naik halus (teks "menebal" & makin display).
 * - Saat hover: wght dorong lebih berani, opsz maksimal — terasa hidup.
 * Hanya transform/opacity & font-variation-settings (GPU-friendly, no layout shift).
 */
export function HeroHeadline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // wght 340 → 600, opsz 22 → 144 saat reveal; hover dorong wght 680.
  const wght = hover ? 680 : shown ? 600 : 340;
  const opsz = shown ? 144 : 24;

  return (
    <h1
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      style={{
        fontVariationSettings: `"opsz" ${opsz}, "wght" ${wght}`,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(14px)",
        transition:
          "font-variation-settings 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease, transform 700ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </h1>
  );
}
