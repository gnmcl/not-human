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
    let   Z_AMP = 180;

    // ── Nodi di respiro ────────────────────────────────────────────────────
    // Ogni nodo è una "bolla" che emerge in un punto casuale del tessuto,
    // spinge i punti vicini verso lo schermo, poi svanisce.
    // Tante bolle piccole = effetto lenzuolo armonioso, senza picchi violenti.
    let MAX_NODES = 10;
    let SIGMA_MIN = 95;        // px — bolla piccola
    let SIGMA_MAX = 200;       // px — bolla media
    const LIFE_MIN = 7000;     // ms
    const LIFE_MAX = 14000;    // ms
    // Frequenze ravvicinate → respiro più sinfonico, meno caotico
    const FREQ_MIN = 0.00050;  // rad/ms → periodo ≈ 12.5 s
    const FREQ_MAX = 0.00075;  // rad/ms → periodo ≈  8.4 s

    const nodes: BreathNode[] = [];

    // Le bolle nascono ben dentro al viewport, lontano dai bordi.
    // Così la maschera di bordo non azzera mai una bolla appena nata.
    function spawnNode(time: number, vw: number, vh: number): BreathNode {
      const sigma  = SIGMA_MIN + Math.random() * (SIGMA_MAX - SIGMA_MIN);
      const margin = sigma * 0.9;
      return {
        x:          margin + Math.random() * (vw - 2 * margin),
        y:          margin + Math.random() * (vh - 2 * margin),
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
    // Maschera di bordo: 1 al centro, 0 ai bordi — i punti perimetrali
    // restano ancorati come spilli che fissano il lenzuolo alla finestra.
    let edgeMask = new Float32Array(0);
    let rafId = 0;
    let dpr   = 1;
    let vw = 0, vh = 0;

    function initGrid(w: number, h: number): void {
      const mobile = w < 768;
      SPACING    = mobile ? 11   : 10;
      DOT_R      = mobile ? 0.42 : 0.55;
      BASE_ALPHA = mobile ? 0.72 : 0.82;
      Z_AMP      = mobile ? 130  : 180;
      MAX_NODES  = mobile ? 8    : 10;
      SIGMA_MIN  = mobile ? 70   : 95;
      SIGMA_MAX  = mobile ? 140  : 200;

      vw = w;
      vh = h;

      dpr = window.devicePixelRatio ?? 1;
      canvas.width        = Math.round(w * dpr);
      canvas.height       = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left   = "0";
      canvas.style.top    = "0";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // La griglia copre esattamente il viewport: la prima e l'ultima
      // colonna/riga di punti coincidono con i bordi della finestra.
      cols  = Math.floor(w / SPACING) + 1;
      rows  = Math.floor(h / SPACING) + 1;
      count = cols * rows;
      baseX    = new Float32Array(count);
      baseY    = new Float32Array(count);
      edgeMask = new Float32Array(count);

      // Distribuiamo i punti in modo che cadano esattamente su x=0, x=w,
      // y=0, y=h. I bordi del lenzuolo restano sempre allineati al frame.
      const stepX = w / (cols - 1);
      const stepY = h / (rows - 1);

      // Maschera: sin(π·u) elevato per avere bordi piatti e cuore ampio.
      // Esponente più alto = ancoraggio più stretto al bordo.
      const MASK_POW = 1.6;

      for (let r = 0; r < rows; r++) {
        const v = r / (rows - 1);            // 0 → 1
        const maskV = Math.sin(Math.PI * v); // 0 ai bordi, 1 al centro
        for (let c = 0; c < cols; c++) {
          const u = c / (cols - 1);
          const maskU = Math.sin(Math.PI * u);
          const i = r * cols + c;
          baseX[i] = c * stepX;
          baseY[i] = r * stepY;
          edgeMask[i] = Math.pow(maskU * maskV, MASK_POW);
        }
      }
    }

    // ── Loop di animazione ─────────────────────────────────────────────────
    function loop(time: number): void {
      ctx.clearRect(0, 0, vw, vh);

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

      // Centro prospettico = centro della finestra
      const cx = vw * 0.5;
      const cy = vh * 0.5;

      for (let i = 0; i < count; i++) {
        const bx   = baseX[i];
        const by   = baseY[i];
        const mask = edgeMask[i];

        // Somma dei contributi Z di tutti i nodi attivi
        let waveZ = 0;
        if (mask > 0) {
          for (let n = 0; n < nodes.length; n++) {
            const nd  = nodes[n];
            const age = (time - nd.birthTime) / nd.lifetime; // 0 → 1
            const env = Math.sin(Math.PI * age);

            const dx = bx - nd.x;
            const dy = by - nd.y;
            const influence = Math.exp(-(dx * dx + dy * dy) / (2 * nd.sigma2));

            const pulse = Math.sin(nd.pulseFreq * time + nd.pulsePhase);

            waveZ += -Z_AMP * influence * env * pulse;
          }
          // I punti vicini al bordo vengono "sgonfiati" verso zero.
          // Sul perimetro (mask = 0) il movimento è nullo: spilli fissi.
          waveZ *= mask;
        }

        const persp = FOCAL / (FOCAL + waveZ);

        // Anche la divergenza prospettica viene mascherata, così i punti
        // sui bordi non si spostano lateralmente nemmeno di un pixel.
        const px = cx + (bx - cx) * (1 + (persp - 1) * mask);
        const py = cy + (by - cy) * (1 + (persp - 1) * mask);

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
