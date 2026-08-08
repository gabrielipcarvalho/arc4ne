"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

// Viewport-triggered per-char decode (the gipc.dev signature, arc4ne edition).
// SSR renders the real text (SEO / no-JS / a11y all see English); the scramble is a
// purely visual post-hydration layer, aria-hidden, width-stable (ASCII glyphs only),
// resolves left→right and RESTS AT FINAL. Disabled entirely under reduced motion.
const SCRAMBLE = "#$%&*+=<>/\\|~^!?@01345789ABCDEFHKLMNPRSTUVXZ";

export default function Decode({
  text,
  as: Tag = "span" as ElementType,
  className,
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const run = () => {
      const perChar = Math.max(14, Math.min(40, 700 / text.length));
      const start = performance.now();
      interval = setInterval(() => {
        const t = performance.now() - start;
        let out = "";
        let done = true;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || t > i * perChar + 120) {
            out += ch;
          } else {
            done = false;
            out += SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
          }
        }
        setDisplay(out);
        if (done && interval) clearInterval(interval);
      }, 32);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          timeout = setTimeout(run, delay);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
      setDisplay(text);
    };
  }, [text, delay]);

  return (
    <Tag ref={ref} className={className} aria-label={text} data-decode="">
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
