# Plan: Interactive Mesh Hero Background — Not Human

## Context

* Next.js 16.2.6
* React 19
* TypeScript strict
* Tailwind v4 (`globals.css` inline theme)
* Default create-next-app structure
* Canvas rendering requires `"use client"`

---

# Goals

Create a premium fullscreen interactive mesh background inspired by Sanity.io-style digital fabric interactions.

The final effect must feel:

* cinematic
* minimal
* futuristic
* synthetic
* organic
* premium

The mesh must behave like a living digital surface, not independent particles.

---

# Files to Create / Modify

## Create

* `components/InteractiveMeshBackground.tsx`

## Modify

* `app/page.tsx`
* `app/layout.tsx`
* `app/globals.css`

---

# Phase 1 — Component Scaffold

## Component

Create:

```txt
components/InteractiveMeshBackground.tsx
```

with:

```ts
"use client"
```

## Props

```ts
className?: string
```

## Refs

```ts
const canvasRef = useRef<HTMLCanvasElement>(null)
```

## Lifecycle Responsibilities

Inside `useEffect`:

* canvas initialization
* resize handling
* mouse tracking
* animation loop
* cleanup

## Cleanup

Must cleanup:

* `cancelAnimationFrame`
* resize listener
* mouse listener

Use simple `window.resize` listener instead of `ResizeObserver`
because the canvas is fullscreen.

---

# Phase 2 — Grid Data Architecture

## Visual Density

```txt
Dot size:       1.5px
Grid spacing:   12px
```

## Responsive Grid

On resize:

```ts
cols = Math.floor(width / spacing)
rows = Math.floor(height / spacing)
```

## Performance-Oriented Storage

Use typed arrays:

```ts
Float32Array
```

Store:

```txt
baseX, baseY     // fixed positions
curX, curY       // rendered positions
velX, velY       // spring velocity
phase            // idle animation phase
```

Avoid arrays of objects.

---

# Phase 3 — Mouse Tracking + Smoothing

## Raw Mouse

Store raw coordinates from:

```ts
window.addEventListener("mousemove")
```

## Mouse Leave

When cursor exits viewport:

```ts
rawMouse.x = -9999
rawMouse.y = -9999
```

## Smooth Mouse

Never use raw mouse directly.

Use interpolated mouse:

```ts
smoothMouse.x += (rawMouse.x - smoothMouse.x) * 0.06
smoothMouse.y += (rawMouse.y - smoothMouse.y) * 0.06
```

This creates:

* cinematic lag
* magnetic feeling
* organic interaction

---

# Phase 4 — Physics Simulation

## Important Optimization

Avoid using `sqrt()` on every dot every frame.

Use squared distance:

```ts
distSq = dx * dx + dy * dy
```

Compare against:

```ts
radiusSq = radius * radius
```

Only calculate actual distance if necessary.

---

# Influence Radius

```txt
Radius = 180px
```

---

# Smooth Falloff

Use smoothstep-like easing:

t^2(3-2t)

This produces:

* soft edges
* cinematic transitions
* natural deformation

---

# Attraction Force

```ts
attrX = dxToMouse * influence * 8
attrY = dyToMouse * influence * 8
```

Maximum pull:

```txt
8px
```

Movement must remain subtle.

---

# Idle Breathing

Each dot gets unique phase:

```ts
phase = col * 0.3 + row * 0.4
```

Idle animation:

```ts
idleX = Math.sin(time * 0.0008 + phase) * 0.6
idleY = Math.cos(time * 0.0007 + phase * 1.1) * 0.6
```

Amplitude:

```txt
0.6px
```

The breathing must remain nearly invisible.

---

# Spring Physics

Use:

* velocity
* spring force
* damping

NOT direct lerp positioning.

Example:

```ts
velX += (targetX - curX) * springStrength
velX *= damping
curX += velX
```

This creates:

* inertia
* elasticity
* fabric feeling

---

# Delta Time Stabilization

Physics must be framerate independent.

Use delta time:

```ts
dt = (time - lastTime) / 16.666
```

Scale spring and damping calculations using `dt`.

This ensures:

* consistent behavior at 60hz
* consistent behavior at 144hz
* smoother animation on all devices

---

# Architecture Separation

Separate logic into:

```txt
updatePhysics()
render()
```

Do not mix simulation and rendering logic.

This improves:

* readability
* maintainability
* future upgrades

---

# Phase 5 — Rendering Strategy

## HiDPI Support

Scale canvas using:

```ts
devicePixelRatio
```

Canvas CSS size remains:

```txt
width: 100%
height: 100%
```

---

# Two-Pass Rendering

## Pass 1 — Inactive Dots

Render dots with:

```txt
influence < 0.05
```

Style:

```txt
rgba(45, 55, 72, 0.5)
```

Radius:

```txt
1px
```

No shadow blur.

---

# Pass 2 — Active Dots

Render influenced dots separately.

## Glow

```ts
ctx.shadowBlur = influence * 12
```

## Shadow Color

Deep red glow:

```txt
rgba(180, 0, 0, influence)
```

## Additive Blending

Use:

```ts
ctx.globalCompositeOperation = "lighter"
```

ONLY during active-dot pass.

This creates:

* premium glow
* energy accumulation
* cinematic lighting

Reset to:

```ts
source-over
```

after rendering.

---

# Dynamic Dot Appearance

## Radius

```ts
radius = 1 + influence * 0.8
```

## Alpha

Opacity should also scale with influence:

```ts
alpha = baseAlpha + influence * extraAlpha
```

This is critical for:

* depth perception
* soft glow feeling
* premium rendering

---

# Phase 6 — Page Integration

## Fullscreen Hero

Use:

```txt
min-h-screen
```

Background:

```txt
#050505
```

---

# Layering

## Canvas Layer

```txt
absolute inset-0 z-0
```

## Content Layer

```txt
relative z-10
```

---

# Hero Content

Centered content:

* large "NOT HUMAN" title
* thin typography
* wide letter spacing
* minimal subtitle
* optional CTA

Recommended aesthetic:

* minimal
* luxury-tech
* dystopian
* cinematic

---

# Phase 7 — Metadata + Globals

## layout.tsx

Update:

* title
* description

## globals.css

Override background variables:

```css
--background: #050505;
```

Remove default light theme appearance.

---

# Verification Checklist

## Rendering

* canvas fills fullscreen
* no stretching artifacts
* crisp on Retina displays

## Interaction

* dots deform smoothly
* red glow follows cursor
* motion has inertia
* no snapping

## Exit Behavior

* mesh relaxes naturally after mouse leaves

## Resize

* grid recomputes correctly
* no flicker
* no stale dots

## Performance

* stable FPS
* no excessive CPU usage
* smooth on large screens

## Build

```bash
npm run build
```

must complete without TypeScript errors.

---

# Scope Decisions

## Included

* Canvas rendering
* Spring physics
* Smooth mouse interpolation
* Idle breathing
* Additive glow
* Responsive fullscreen hero

## Excluded

* WebGL
* Three.js
* Audio reactivity
* Touch interaction
* Trails
* Bloom post-processing

These can be added later as enhancements.

---

# Desired Final Feeling

The final experience should feel like:

* a living AI membrane
* a synthetic neural field
* a futuristic digital organism
* a responsive dystopian fabric

The user should feel that the website itself is alive and reacting to human presence.
