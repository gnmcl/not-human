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

    // ── Grid ───────────────────────────────────────────────────────────────
    let SPACING = 10;
    let DOT_R   = 0.55;
    let BASE_ALPHA = 0.82;
    const R = 185, G = 185, B = 195;

    // ── Prospettiva ─────────────────────────────────────────────────────────
    const FOCAL = 520;
    let   Z_AMP = 200;

    // ── Onde di respiro ────────────────────────────────────────────────────
    // Due onde con rapporto di frequenza irrazionale (≈ φ = 1.618):
    // non si sincronizzano mai → il pattern non si ripete mai uguale,
    // esattamente come un respiro reale che cambia leggermente ogni volta.
    //
    // W1 — onda primaria, lenta, quasi orizzontale
    //      kx=0.0040 → λ ≈ 1570 px (leggermente più largo dello schermo)
    //      speed=0.00022 → ciclo temporale ≈ 28 s
    const W1 = { kx: 0.0040, ky: 0.0005, speed: 0.00022 };
    //
    // W2 — onda secondaria, inarmonica (speed ≈ W1/φ), angolata diversamente
    //      Interferisce con W1 creando creste che si spostano organicamente.
    const W2 = { kx: 0.0025, ky: 0.0013, speed: 0.00014 };

    // ── Inviluppo di respiro globale ───────────────────────────────────────
    // Un'unica sinusoide lentissima che fa pulsare l'INTERO campo in/out.
    // È l'"inspirazione" e l'"espirazione" dell'insieme.
    // Periodo ≈ 2π / 0.00068 ≈ 9.2 s — ritmo simile a un respiro lento.
    const BREATH_FREQ = 0.00068;

    // ── Stato griglia ──────────────────────────────────────────────────────
    let cols = 0, rows = 0, count = 0;
    let baseX = new Float32Array(0);
    let baseY = new Float32Array(0);
    let rafId = 0;
    let dpr   = 1;

    // ── Inizializzazione griglia ────────────────────────────────────────────
    function initGrid(w: number, h: number): void {
      const mobile  = w < 768;
      SPACING       = mobile ? 13  : 10;
      DOT_R         = mobile ? 0.44 : 0.55;
      BASE_ALPHA    = mobile ? 0.70 : 0.82;
      Z_AMP         = mobile ? 140  : 200;

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

    // ── Loop di animazione ─────────────────────────────────────────────────
    function loop(time: number): void {
      const w = canvas.width  / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      // Punto di fuga: centro dello schermo
      const cx = w * 0.5;
      const cy = h * 0.5;

      for (let i = 0; i < count; i++) {
        const bx = baseX[i];
        const by = baseY[i];

        // ── Inviluppo globale di respiro ───────────────────────────────────
        // Pulsa lentamente tra 0.28 e 1.0 — "inspira" ed "espira" l'intero campo.
        // Usiamo (sin+1)/2 per stare sempre in [0,1] poi scaliamo.
        const breathEnv = 0.28 + 0.72 * (0.5 + 0.5 * Math.sin(BREATH_FREQ * time));

        // ── Composizione delle due onde di respiro ────────────────────────
        // I pesi (0.65 + 0.35) e le frequenze irrazionali creano
        // un'interferenza che si evolve senza mai ripetersi.
        const p1 = W1.kx * bx + W1.ky * by - W1.speed * time;
        const p2 = W2.kx * bx + W2.ky * by - W2.speed * time;
        const wave = 0.65 * Math.sin(p1) + 0.35 * Math.sin(p2);

        // ── Coordinata Z virtuale ──────────────────────────────────────────
        // L'inviluppo scala l'ampiezza totale: quando "espira" i punti
        // restano tutti più vicini al piano → campo quasi piatto.
        // Quando "inspira" l'onda di profonditá torna in piena forza.
        const waveZ = -Z_AMP * wave * breathEnv;

        // ── Proiezione prospettica ─────────────────────────────────────
        // Formula classica: persp = f / (f + z)
        // La camera è a z = -FOCAL, il piano di schermo a z = 0.
        // persp > 1  →  punto davanti al piano (verso di noi)
        // persp < 1  →  punto dietro il piano  (lontano da noi)
        //
        // EFFETTO CHIAVE: i punti vicini divergono dal centro,
        // quelli lontani convergono verso il centro.
        // È questa variazione di POSIZIONE che il cervello legge come 3D.
        const persp = FOCAL / (FOCAL + waveZ);

        // Posizione proiettata
        const px = cx + (bx - cx) * persp;
        const py = cy + (by - cy) * persp;

        // ── Raggio: scala con la prospettiva (fisica 3D corretta) ──────
        const r = DOT_R * persp;

        // ── Opacità: nebbia di profondità ──────────────────────────────
        // I punti lontani svaniscono leggermente (nebbia atmosferica).
        const a = BASE_ALPHA * Math.min(1.0, Math.max(0.14, persp * 0.82));

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
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
}
