"use client";

import { useEffect, useRef } from "react";

// unimatrix -a -b -f -l kknnss -s 96, translated: async columns, occasional bright
// "flasher" heads, katakana+numbers+symbols charset (kk nn ss = double weights), brisk
// fall speed — but DIM (canvas opacity lives in CSS) so the foreground always wins.
// Fully disabled under prefers-reduced-motion.
const GLYPHS =
  "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜｦｱｳｴｵｶｷｹｺｻｼｽｾｿ" +
  "01234567890123456789" +
  "・:=*+-<>¦｜╌・:=*+-<>";

export default function Rain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canvas = ref.current;
    if (!canvas || rm.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cols: { y: number; v: number; flash: boolean }[] = [];
    const FS = 16; // glyph cell size (css px)

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.ceil(innerWidth / FS);
      cols = Array.from({ length: n }, () => ({
        y: -Math.random() * (innerHeight / FS) * 2,
        v: 0.55 + Math.random() * 0.9, // async speeds (-a)
        flash: Math.random() < 0.12, // flasher columns (-f)
      }));
      ctx.fillStyle = "#040806";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
    };

    let last = 0;
    const STEP = 1000 / 26; // ~"-s 96": brisk but not frantic
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < STEP) return;
      last = t;
      // trail fade
      ctx.fillStyle = "rgba(4, 8, 6, 0.16)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.font = `700 ${FS - 2}px monospace`; // -b bold
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i];
        const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        const x = i * FS;
        const y = c.y * FS;
        // head glyph — flashers run brighter/amber-tinged
        ctx.fillStyle = c.flash
          ? "rgba(245, 184, 70, 0.9)"
          : "rgba(214, 245, 226, 0.85)";
        ctx.fillText(ch, x, y);
        // body glyph one cell up, dimmer green
        ctx.fillStyle = "rgba(70, 245, 143, 0.55)";
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - FS);
        c.y += c.v;
        if (y > innerHeight + FS * 4) {
          c.y = -Math.random() * 30;
          c.v = 0.55 + Math.random() * 0.9;
          c.flash = Math.random() < 0.12;
        }
      }
    };

    size();
    addEventListener("resize", size);
    raf = requestAnimationFrame(draw);

    const onRm = () => {
      if (rm.matches) {
        cancelAnimationFrame(raf);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
    };
    rm.addEventListener("change", onRm);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
      rm.removeEventListener("change", onRm);
    };
  }, []);

  return <canvas ref={ref} className="rain" aria-hidden="true" />;
}
