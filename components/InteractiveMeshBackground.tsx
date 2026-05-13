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

    // ── Physical constants ─────────────────────────────────────────────────
    const SPACING      = 10;    // px between dots
    const DOT_R        = 0.4;   // base dot radius (px)
    const RADIUS       = 110;   // mouse influence radius (px) — wide hot zone
    const MAX_IMPULSE  = 0.2;   // peak velocity impulse — minimal displacement, effect is mostly colorimetric
    const SPRING_K     = 0.055; // spring stiffness — snaps back quickly so motion stays subtle
    const DAMPING      = 0.90;  // velocity damping — clean, no long oscillation
    const MOUSE_LERP   = 0.29;  // cursor smoothing — cinematic lag

    // ── Energy constants ───────────────────────────────────────────────────
    // Each dot stores persistent energy that decays independently of cursor proximity.
    // Glow, color, and radius are driven by energy[], never by direct mouse distance.
    // The trail is the slow decay of energy along the path the cursor traced.
    const ENERGY_RATE  = 0.20;  // energy injected per frame at full influence — strong hot zone
    const ENERGY_DECAY = 0.984; // slow decay → ~3 s visible trail at 60 fps (0.984^180 ≈ 0.05)
    const WAVE_K       = 0.106; // very low diffusion — keeps trail tight along mouse path, not blurred

    // ── Mutable grid state ─────────────────────────────────────────────────
    let cols = 0, rows = 0, count = 0;
    let baseX   = new Float32Array(0);
    let baseY   = new Float32Array(0);
    let curX    = new Float32Array(0);
    let curY    = new Float32Array(0);
    let velX    = new Float32Array(0);
    let velY    = new Float32Array(0);
    // Ping-pong buffers for diffusion — swapped each frame to avoid read/write aliasing
    let energy  = new Float32Array(0);
    let energyB = new Float32Array(0);

    const rawMouse    = { x: -9999, y: -9999 };
    const smoothMouse = { x: -9999, y: -9999 };
    let rafId = 0;
    let dpr   = 1;

    // ── Grid initialisation ─────────────────────────────────────────────────
    function initGrid(w: number, h: number): void {
      dpr = window.devicePixelRatio ?? 1;
      // Assigning canvas.width resets the 2D context transform to identity.
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      cols  = Math.floor(w / SPACING);
      rows  = Math.floor(h / SPACING);
      count = cols * rows;

      baseX   = new Float32Array(count);
      baseY   = new Float32Array(count);
      curX    = new Float32Array(count);
      curY    = new Float32Array(count);
      velX    = new Float32Array(count);
      velY    = new Float32Array(count);
      energy  = new Float32Array(count);
      energyB = new Float32Array(count);

      const ox = (w % SPACING) / 2 + SPACING / 2;
      const oy = (h % SPACING) / 2 + SPACING / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          baseX[i] = ox + c * SPACING;
          baseY[i] = oy + r * SPACING;
          curX[i]  = baseX[i];
          curY[i]  = baseY[i];
        }
      }
    }

    // ── Main animation loop ──────────────────────────────────────────────────
    function loop(): void {
      // Cinematic cursor lag
      smoothMouse.x += (rawMouse.x - smoothMouse.x) * MOUSE_LERP;
      smoothMouse.y += (rawMouse.y - smoothMouse.y) * MOUSE_LERP;
      const mx = smoothMouse.x;
      const my = smoothMouse.y;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // ── Pass 1: energy diffusion (discrete Laplacian) ───────────────────
      // Energy flows outward from disturbed dots, creating ripple-like wave propagation.
      // Each dot receives/loses energy proportional to the difference from its neighbors.
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          let laplacian = 0;
          let n = 0;
          if (r > 0)        { laplacian += energy[(r - 1) * cols + c]; n++; }
          if (r < rows - 1) { laplacian += energy[(r + 1) * cols + c]; n++; }
          if (c > 0)        { laplacian += energy[r * cols + (c - 1)]; n++; }
          if (c < cols - 1) { laplacian += energy[r * cols + (c + 1)]; n++; }
          // Write diffused result into back-buffer to avoid read/write aliasing
          energyB[i] = energy[i] + WAVE_K * (laplacian - n * energy[i]);
        }
      }
      // Swap ping-pong buffers — energy now holds the diffused state
      const tmp = energy; energy = energyB; energyB = tmp;

      // ── Pass 2: physics + energy injection + render ──────────────────────
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < count; i++) {
        const bx = baseX[i];
        const by = baseY[i];

        // ── Mouse influence field ────────────────────────────────────────
        const dx   = mx - bx;
        const dy   = my - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t    = Math.max(0, 1 - dist / RADIUS);
        const inf  = t * t * (3 - 2 * t); // smoothstep — soft circular falloff

        // ── Inject energy into the field ─────────────────────────────────
        // Soft cap at ~1.15: energy[i] += inf * RATE * (cap - energy[i])
        // This prevents unbounded growth while the cursor hovers.
        energy[i] += inf * ENERGY_RATE * (1.15 - energy[i]);

        // ── Apply velocity impulse toward cursor ─────────────────────────
        // The impulse creates physical displacement; the spring and damping
        // turn that into sustained oscillation after the cursor moves away.
        if (inf > 0.001) {
          const len = dist || 1;
          velX[i] += (dx / len) * inf * MAX_IMPULSE;
          velY[i] += (dy / len) * inf * MAX_IMPULSE;
        }

        // ── Spring: restore dot toward its base position ─────────────────
        velX[i] -= (curX[i] - bx) * SPRING_K;
        velY[i] -= (curY[i] - by) * SPRING_K;

        // ── Damping: slow decay keeps oscillation alive longer ───────────
        velX[i] *= DAMPING;
        velY[i] *= DAMPING;

        // ── Integrate position ───────────────────────────────────────────
        curX[i] += velX[i];
        curY[i] += velY[i];

        // ── Energy temporal decay ────────────────────────────────────────
        energy[i] *= ENERGY_DECAY;

        // ── Render — color and size driven by energy[], not by inf ───────
        // This is the key distinction: the glow persists after the cursor leaves
        // because energy[i] decays slowly and propagates outward via diffusion.
        const e  = Math.min(1, energy[i]);
        // Gamma-correct perceptual curve: square root makes dim glow more visible
        const eg = Math.sqrt(e);
        const rc = Math.round(185 + eg * 35);  // 185 → 220  near-white → dark orange
        const gc = Math.round(185 - eg * 60);  // 185 → 95   near-white → warm orange
        const bc = Math.round(195 - eg * 170); // 195 → 25   near-white → burnt orange shadow
        const a  = (0.72 + eg * 0.28).toFixed(2); // 0.72 → 1.00 — very visible at rest
        const rr = DOT_R + eg * 0.25;          // subtle size swell with energy

        ctx.beginPath();
        ctx.arc(curX[i], curY[i], rr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rc},${gc},${bc},${a})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    }

    // ── Event handlers ────────────────────────────────────────────────────────
    function onResize(): void {
      initGrid(window.innerWidth, window.innerHeight);
    }
    function onMouseMove(e: MouseEvent): void {
      rawMouse.x = e.clientX;
      rawMouse.y = e.clientY;
    }
    function onMouseLeave(): void {
      rawMouse.x = -9999;
      rawMouse.y = -9999;
    }

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    initGrid(window.innerWidth, window.innerHeight);
    rafId = requestAnimationFrame(loop);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
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
