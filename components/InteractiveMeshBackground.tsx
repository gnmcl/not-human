"use client";

import { useEffect, useRef } from "react";

interface Props {
  className?: string;
}

interface BreathNode {
  x: number;
  y: number;
  birthTime: number;
  lifetime: number;   // ms — durata totale
  pulseFreq: number;  // rad/ms — velocità del respiro
  pulsePhase: number; // sfasamento iniziale — ognuno respira a modo suo
  sigma2: number;     // raggio di influenza² (gaussiana)
}

export default function InteractiveMeshBackground({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    // ── Griglia ────────────────────────────────────────────────────────────
    let SPACING    = 10;
    let DOT_R      = 0.55;
    let BASE_ALPHA = 0.82;
    const R = 185, G = 185, B = 195;

    // ── Prospettiva ────────────────────────────────────────────────────────
    const FOCAL = 500;
    let   Z_AMP = 260;

    // ── Nodi di respiro ────────────────────────────────────────────────────
    // Ogni nodo è una "bolla" che emerge in un punto casuale del tessuto,
    // spinge i punti vicini verso lo schermo, poi svanisce.
    const MAX_NODES  = 5;
    const SIGMA_MIN  = 160;     // px — bolla piccola
    const SIGMA_MAX  = 380;     // px — bolla grande
    const LIFE_MIN   = 6000;    // ms
    const LIFE_MAX   = 13000;   // ms
    const FREQ_MIN   = 0.00040; // rad/ms → periodo ≈ 15 s (respiro lento)
    const FREQ_MAX   = 0.00085; // rad/ms → periodo ≈  7 s (respiro più rapido)

    const nodes: BreathNode[] = [];

    // vw/vh = visible viewport dims; nodes spawn centred in the 2× canvas
    function spawnNode(time: number, vw: number, vh: number): BreathNode {
      const sigma = SIGMA_MIN + Math.random() * (SIGMA_MAX - SIGMA_MIN);
      const margin = sigma * 0.5;
      const padX = vw / 2;  // viewport starts at vw/2 in canvas-space
      const padY = vh / 2;
      return {
        x:          padX + margin + Math.random() * (vw - 2 * margin),
        y:          padY + margin + Math.random() * (vh - 2 * margin),
        birthTime:  time,
        lifetime:   LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN),
        pulseFreq:  FREQ_MIN + Math.random() * (FREQ_MAX - FREQ_MIN),
        pulsePhase: Math.random() * Math.PI * 2,
        sigma2:     sigma * sigma,
      };
    }

    // ── Stato griglia ──────────────────────────────────────────────────────
    let cols = 0, rows = 0, count = 0;
    let baseX = new Float32Array(0);
    let baseY = new Float32Array(0);
    let rafId = 0;
    let dpr   = 1;

    function initGrid(w: number, h: number): void {
      const mobile = w < 768;
      SPACING    = mobile ? 13   : 10;
      DOT_R      = mobile ? 0.44 : 0.55;
      BASE_ALPHA = mobile ? 0.70 : 0.82;
      Z_AMP      = mobile ? 170  : 260;

      // Canvas is 2× viewport — mesh edges always stay off-screen
      const cw = w * 2;
      const ch = h * 2;

      dpr = window.devicePixelRatio ?? 1;
      canvas.width        = Math.round(cw * dpr);
      canvas.height       = Math.round(ch * dpr);
      canvas.style.width  = `${cw}px`;
      canvas.style.height = `${ch}px`;
      // Center the oversized canvas on the viewport
      canvas.style.left   = `-${w / 2}px`;
      canvas.style.top    = `-${h / 2}px`;
      ctx.scale(dpr, dpr);

      cols  = Math.ceil(cw / SPACING) + 1;
      rows  = Math.ceil(ch / SPACING) + 1;
      count = cols * rows;
      baseX = new Float32Array(count);
      baseY = new Float32Array(count);

      const ox = -SPACING / 2;
      const oy = -SPACING / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          baseX[i] = ox + c * SPACING;
          baseY[i] = oy + r * SPACING;
        }
      }
    }

    // ── Loop di animazione ─────────────────────────────────────────────────
    function loop(time: number): void {
      const cw = canvas.width  / dpr;
      const ch = canvas.height / dpr;
      // Visible viewport dimensions = half the canvas
      const vw = cw / 2;
      const vh = ch / 2;
      ctx.clearRect(0, 0, cw, ch);

      // Seeding iniziale: nodi a età diverse così non partono tutti insieme
      while (nodes.length < MAX_NODES) {
        const n = spawnNode(time, vw, vh);
        n.birthTime = time - Math.random() * n.lifetime * 0.8;
        nodes.push(n);
      }

      // Riciclo: rimpiazza i nodi scaduti
      for (let n = nodes.length - 1; n >= 0; n--) {
        if (time - nodes[n].birthTime >= nodes[n].lifetime) {
          nodes.splice(n, 1);
          nodes.push(spawnNode(time, vw, vh));
        }
      }

      // Canvas center = viewport center (canvas is 2× viewport, centered)
      const cx = cw * 0.5;
      const cy = ch * 0.5;

      for (let i = 0; i < count; i++) {
        const bx = baseX[i];
        const by = baseY[i];

        // Somma dei contributi Z di tutti i nodi attivi
        let waveZ = 0;
        for (let n = 0; n < nodes.length; n++) {
          const nd  = nodes[n];
          const age = (time - nd.birthTime) / nd.lifetime; // 0 → 1

          // Inviluppo: sin(π·age) — sale da 0, picco a metà vita, torna a 0.
          // Ogni bolla emerge e svanisce con dolcezza, senza scatti.
          const env = Math.sin(Math.PI * age);

          // Falloff gaussiano: influenza massima al centro, zero a distanza
          const dx = bx - nd.x;
          const dy = by - nd.y;
          const influence = Math.exp(-(dx * dx + dy * dy) / (2 * nd.sigma2));

          // Pulsazione propria: ogni nodo "respira" al suo ritmo
          const pulse = Math.sin(nd.pulseFreq * time + nd.pulsePhase);

          waveZ += -Z_AMP * influence * env * pulse;
        }

        // Proiezione prospettica: persp > 1 = vicino, persp < 1 = lontano
        const persp = FOCAL / (FOCAL + waveZ);

        // I punti divergono dal centro quando si avvicinano (effetto 3D reale)
        const px = cx + (bx - cx) * persp;
        const py = cy + (by - cy) * persp;

        const r = DOT_R * persp;
        const a = BASE_ALPHA * Math.min(1.0, Math.max(0.12, persp * 0.80));

        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.05, r), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${a.toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    }

    function onResize(): void {
      initGrid(window.innerWidth, window.innerHeight);
    }

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
      style={{
        position: "fixed",
        display: "block",
      }}
    />
  );
}
