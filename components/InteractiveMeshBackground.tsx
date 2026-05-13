"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

export default function InteractiveMeshBackground({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    // ── Grid constants ─────────────────────────────────────────────────────
    let SPACING = 10;
    let DOT_R   = 0.4;

    // ── Ocean: three superimposed traveling sinusoids ──────────────────────
    //
    // Layer 1 — deep primary swell: very long wavelength, leisurely pace,
    //           travels mostly east with a slight southward tilt.
    //           This is the dominant "breathing" motion of the whole surface.
    const W1 = { kx: 0.0044, ky:  0.0016, speed: 0.00028, ampY: 2.4, ampX: 0.38 };
    //
    // Layer 2 — cross-swell: medium wavelength, faster, angled north-east.
    //           Interferes with W1 to create the wandering crests typical of open sea.
    const W2 = { kx: 0.0029, ky: -0.0038, speed: 0.00044, ampY: 1.3, ampX: 0.24 };
    //
    // Layer 3 — fine capillary shimmer: short wavelength, quick but tiny.
    //           Adds the live, quivering texture of a wind-kissed surface.
    const W3 = { kx: 0.0088, ky:  0.0058, speed: 0.00082, ampY: 0.42, ampX: 0.08 };

    // ── Luminosity breath ──────────────────────────────────────────────────
    // A slow, wide sinusoid that modulates dot opacity independently of
    // displacement — as if light itself were undulating through the field.
    const LB_AMP   = 0.065;   // ±6.5 % opacity swing
    const LB_FREQ  = 0.0028;  // spatial scale (~2240 px per cycle) — very broad
    const LB_SPEED = 0.00042; // drifts gently rightward

    // ── Dot color ─────────────────────────────────────────────────────────
    let BASE_ALPHA = 0.72;
    let R = 185, G = 185, B = 195;

    // ── Grid state ─────────────────────────────────────────────────────────
    let cols = 0, rows = 0, count = 0;
    let baseX = new Float32Array(0);
    let baseY = new Float32Array(0);
    let rafId = 0;
    let dpr = 1;

    // ── Grid initialisation ─────────────────────────────────────────────────
    function initGrid(w: number, h: number): void {
      const mobile = w < 768;
      SPACING    = mobile ? 13 : 10;
      DOT_R      = mobile ? 0.32 : 0.4;
      BASE_ALPHA = mobile ? 0.60 : 0.72;
      R = mobile ? 170 : 185;
      G = mobile ? 170 : 185;
      B = mobile ? 180 : 195;

      dpr = window.devicePixelRatio ?? 1;
      canvas.width        = Math.round(w * dpr);
      canvas.height       = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      cols  = Math.floor(w / SPACING);
      rows  = Math.floor(h / SPACING);
      count = cols * rows;

      baseX = new Float32Array(count);
      baseY = new Float32Array(count);

      const ox = (w % SPACING) / 2 + SPACING / 2;
      const oy = (h % SPACING) / 2 + SPACING / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          baseX[i] = ox + c * SPACING;
          baseY[i] = oy + r * SPACING;
        }
      }
    }

    // ── Animation loop ───────────────────────────────────────────────────────
    function loop(time: number): void {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < count; i++) {
        const bx = baseX[i];
        const by = baseY[i];

        // ── Wave displacement ────────────────────────────────────────────
        // Three traveling sinusoids evaluated at the dot's base position.
        // Because we use the base (not current) position the waves glide
        // smoothly without any feedback artifact.
        const p1 = W1.kx * bx + W1.ky * by - W1.speed * time;
        const p2 = W2.kx * bx + W2.ky * by - W2.speed * time;
        const p3 = W3.kx * bx + W3.ky * by - W3.speed * time;

        const offY = W1.ampY * Math.sin(p1)
                   + W2.ampY * Math.sin(p2)
                   + W3.ampY * Math.sin(p3);

        // Transverse (X) offset — cosine gives a 90° phase shift so the
        // displacement vector rotates with the wave, mimicking orbital motion.
        const offX = W1.ampX * Math.cos(p1)
                   + W2.ampX * Math.cos(p2)
                   + W3.ampX * Math.cos(p3);

        // ── Luminosity breath ────────────────────────────────────────────
        const breath = LB_AMP * Math.sin(LB_FREQ * bx - LB_SPEED * time);

        // ── Subtle size swell at wave crest ──────────────────────────────
        // Crests are slightly larger, troughs slightly smaller — as if the
        // surface tension concentrates light at each peak.
        const normalised = offY / (W1.ampY + W2.ampY + W3.ampY); // −1 … +1
        const r = DOT_R + normalised * 0.12;

        const a = Math.max(0, BASE_ALPHA + breath + normalised * 0.055);

        ctx.beginPath();
        ctx.arc(bx + offX, by + offY, Math.max(0.05, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${a.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    }

    // ── Event handlers ────────────────────────────────────────────────────────
    function onResize(): void {
      initGrid(window.innerWidth, window.innerHeight);
    }

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    initGrid(window.innerWidth, window.innerHeight);
    rafId = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
}
