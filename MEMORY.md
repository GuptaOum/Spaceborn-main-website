# Spaceborn — Architecture, Design System & Memory Blueprint

> **Notice for SSH / AI Coding Agents (Claude Desktop, Antigravity, Codex):**  
> This file contains the complete institutional memory, design philosophy, tool registry, and architectural roadmap for upgrading the **Spaceborn (Beyond Autonomous)** web platform.  
> Read this document first before proposing or implementing any changes.

---

## 1. Executive Summary & Identity

* **Entity:** Spaceborn — Beyond Autonomous
* **Industry:** Aerospace, Defense Tech, Deep-Tech Autonomous Systems
* **Core Domains:** Autonomous flight systems (Deryk platform), edge compute modules, electronic speed controllers (ESC), sensor modules, swarm simulations, digital twins, hardware telemetry, LiDAR simulation.
* **Target Benchmark:** **xAI + Anduril + SpaceX + Apple + Anthropic**
  * **Anduril:** Tactical defense-grade precision, high-contrast monochrome, crisp 1px borders, HUD badges, hard engineering specifications, and hardware photography.
  * **SpaceX:** Bold aerospace typography, full-bleed cinematic imagery/video, tabular payload/thrust specs, and telemetry readouts.
  * **xAI:** Obsidian black canvases (`#000000`, `#050505`), razor-sharp geometric precision, subtle grid overlays, and high information density.
  * **Apple:** Fluid spring physics (Framer Motion), interactive 3D WebGL viewers (Three.js), bento grid layouts, and glassmorphic depth (`backdrop-blur-md`).
  * **Anthropic:** Restrained editorial pacing, typography hierarchy, and deliberate whitespace.

---

## 2. The "College Project" Teardown vs. Target State

### Why the Current Website Looks Like a College Project:
1. **Unorganized Global CSS:** `app/globals.css` contains 3,143+ lines of legacy overrides with competing selectors, hardcoded pixel values, and fragmented styling.
2. **Gimmicky Fonts:** Over-reliance on decorative novelty fonts (`Ethnocentric`) across headings, which gives a gaming clan / student project impression rather than an aerospace contractor.
3. **Color Incoherence:** Conflicting neon greens (`#c6ef92`), electric cyans (`#5ad8ee`), and reds (`#e54848`) placed indiscriminately across navigation and content.
4. **Lack of Hardware Gravity:** Abstract shapes and marketing buzzwords instead of concrete engineering figures (compute throughput, latency, mass, endurance, sensor telemetry).
5. **Uneven Layout Rhythm:** Missing consistent bento grid proportions, uncalibrated border radiuses, and harsh transitions.

### The Target Professional State:
* **True Obsidian Palette:** Pure black base (`#000000` / `#050505`), elevated card surfaces (`#0A0A0A` / `#111111`), and crisp hairline borders (`rgba(255, 255, 255, 0.08)` / `border-zinc-800`).
* **Tactical Dual-Font Hierarchy:**
  * **Primary (Display & Body):** Clean, modern geometric sans (`Inter` or `Geist`) with tight tracking (`tracking-tight`).
  * **Technical / Telemetry:** Monospaced (`IBM Plex Mono` / `SF Mono`) for system statuses, hardware metrics, coordinates, and telemetry badges (`[SYS_ONLINE]`, `LAT: 28.6139° N`).
* **Tangible Defense/Aerospace Content:** Every card must present real metrics: payload capacity, latency (e.g. `< 12ms`), power consumption, edge TOPS, and operational flight ranges.
* **Micro-Interactions with Weight:** Animations must use realistic spring physics (`framer-motion`), not linear CSS transitions. Hover states should feel tactile and metallic.

---

## 3. Curated Tools & Frameworks (From Verified Engineering Reels)

The following resources were scraped, frame-analyzed, and curated directly from saved high-end engineering reels:

| Tool / Platform | URL | Role & Implementation Strategy | Source Reel |
| :--- | :--- | :--- | :--- |
| **Three.js** | https://threejs.org | 3D WebGL rendering engine for interactive drone/satellite models, orbital mechanics, and point-cloud LiDAR visualizations. | [@codvyn](https://www.instagram.com/p/Dd35bp-q_Cv/) |
| **21st.dev** | https://21st.dev | "The npm for design engineers." Production-ready modern React, Tailwind, and Framer Motion components (bento grids, spotlight cards, animated tabs). | [@codvyn](https://www.instagram.com/p/Dd35bp-q_Cv/) |
| **Uiverse** | https://uiverse.io | 3,000+ community CSS/Tailwind elements: glowing tactical buttons, radar loaders, cybernetic badges, and status toggles. | [@codvyn](https://www.instagram.com/p/Dd35bp-q_Cv/) |
| **TasteSkill** | https://tasteskill.dev | Curated design taste repository and prompts for crafting non-generic, high-end web experiences. | [@codvyn](https://www.instagram.com/p/Dd35bp-q_Cv/) |
| **Scrolltide** | https://scrolltide.co | 600+ vetted prompts for Awwwards-grade scroll-driven interactions (Framer Motion + Next.js). Recreates 5-figure agency layouts. | [@himanshubuilds](https://www.instagram.com/p/Dd31PeLT0Tz/) |
| **Haikei** | https://haikei.app | SVG asset generator for geometric grid dividers, subtle polygon meshes, and topographic contour lines with zero payload weight. | [@namansoni.ai](https://www.instagram.com/p/DdL4JD9N9CP/) |
| **Realtime Colors** | https://www.realtimecolors.com | Sandbox for testing dark-mode color balance, contrast ratios, and font pairing harmony prior to implementation. | [@namansoni.ai](https://www.instagram.com/p/DdL4JD9N9CP/) |
| **Adaptive Compression** | `Accept-Encoding: zstd, br, gzip` | Multi-compression layer prioritizing Zstd $\rightarrow$ Brotli $\rightarrow$ Gzip. Reduces payload size by 5x–10x for 1M+ requests. | [@xdankit](https://www.instagram.com/p/Ddo08YXT-1S/) |
| **Startup Speed Playbook** | Next.js dynamic / IntersectionObserver | WebP/AVIF conversion, `next/dynamic` component splitting, off-screen canvas disconnect, and immutable caching. | [@xdankit](https://www.instagram.com/p/DdzLHukN1Ly/) |
| **SEO & Core Web Vitals** | Canonical, JSON-LD, LCP/CLS | `<link rel="canonical">`, dynamic XML sitemaps, JSON-LD Schema markup, LCP < 2.5s, CLS < 0.1, INP < 200ms. | [@himanshu.exploresss](https://www.instagram.com/p/DeE7OXdyCs2/) |
| **Security Checklist** | OWASP Top 10 | Parameterized SQL queries, strict Content Security Policy (XSS), anti-CSRF tokens, `SameSite=Strict` cookies, edge rate limiting. | [@himanshu.exploresss](https://www.instagram.com/p/DeM46Iay29L/) |
| **Agent AI Plugins** | Ponytail, OmniRoute, Graphify, Agent Skills | Essential plugins for Claude/agentic workflows to minimize token burn and build queryable codebase graphs. | [@petergriffin.ai](https://www.instagram.com/p/DdWtJm_T07C/) |

---

## 4. Design System Tokens & Rules

### Color Palette (Obsidian Defense Monochrome)
```css
:root {
  /* Surfaces */
  --surface-void: #000000;          /* Deepest background */
  --surface-canvas: #050505;        /* Page background */
  --surface-card: #0c0d0e;          /* Elevated bento cards */
  --surface-card-hover: #141618;    /* Interactive card hover */
  --surface-glass: rgba(12, 13, 14, 0.7); /* Frosted glass overlay */

  /* Borders & Hairlines */
  --border-subtle: rgba(255, 255, 255, 0.08); /* Standard 1px divider */
  --border-active: rgba(255, 255, 255, 0.18); /* Hover / active state */
  --border-glow: rgba(90, 216, 238, 0.4);     /* Tactical highlight */

  /* Typography Colors */
  --text-primary: #FFFFFF;          /* Headings and primary emphasis */
  --text-secondary: #A1A1AA;        /* Body copy and descriptions */
  --text-muted: #71717A;            /* Captions and secondary telemetry */
  --text-mono-tag: #52525B;         /* Technical metadata and timestamp labels */

  /* Status Accents (Used with strict discipline, never as giant backgrounds) */
  --status-active: #22C55E;         /* Operational / online status */
  --status-warning: #EAB308;        /* Standby / alert status */
  --status-danger: #EF4444;         /* Emergency / abort status */
  --status-hud: #06B6D4;            /* Telemetry & radar cyan */
}
```

### Typography Hierarchy
* **Display / Hero Headings:** `font-sans font-bold tracking-tight text-white` (e.g. `text-5xl md:text-7xl font-extrabold tracking-[-0.03em]`).
* **Section Headers:** `font-sans font-semibold tracking-tight text-zinc-100` (e.g. `text-2xl md:text-3xl`).
* **Body Copy:** `font-sans text-zinc-400 leading-relaxed text-sm md:text-base`.
* **Telemetry & Spec Badges:** `font-mono text-xs uppercase tracking-widest text-zinc-400`. Always bracket technical tags: `[SYSTEM: NOMINAL]`, `[CHIP: NEURAL_EDGE_V2]`.

### Bento Grid & Layout Proportions
* Use **asymmetric Bento Grids** with `gap-4 md:gap-6`:
  * Hero feature card (spanning 2 columns or full width).
  * Supporting technical metric cards (1 column each).
  * Rounded corners must remain crisp: `rounded-xl` or `rounded-2xl` (never cartoonish `rounded-3xl` or `rounded-full` on cards).
  * Subtle hover lift: `translate-y-[-2px]` paired with `border-white/20` transition.

---

## 5. Architectural Blueprints for Key Modules

### A. The Hero Section (SpaceX / Anduril Standard)
* **Background:** High-framerate looping silent video (`LazyVideo.tsx`) or interactive Three.js starry celestial sphere.
* **Overlay:** Subtle vignette gradient (`radial-gradient(ellipse at center, transparent 30%, #000000 90%)`).
* **Content:**
  * Pill badge: `[DEFENSE & AEROSPACE AUTONOMY]` with pulsing green indicator dot.
  * Headline: "AUTONOMOUS FLIGHT SYSTEMS FOR CONTESTED DOMAINS" (stark, industrial, confident).
  * Telemetry Bar: Real metrics anchored at the hero base:
    * `01 // COMPUTE: 275 TOPS/W`
    * `02 // LATENCY: < 8.4MS`
    * `03 // SWARM CAPACITY: 128 UNITS`
    * `04 // RANGE: GLOBAL SAT-LINK`

### B. Hardware & Systems Specs (xAI / Apple Standard)
* Replace generic bullet lists with **Hardware Spec Tables**:
  * Dark brushed-metallic card surfaces.
  * High-res hardware CAD renders or macro PCB imagery with transparent backgrounds.
  * Direct comparative tables: Parameter | Specification | Tolerance.

### C. Mission Control / Deryk Platform (`app/deryk`)
* Upgrade `MissionControl.tsx` and `MissionReplay.tsx` to resemble a true **Aerospace C2 (Command & Control) Dashboard**:
  * Dual-axis telemetry graphs with real coordinates.
  * Dark HUD panels with thin glowing crosshairs.
  * Audio toggle for subtle mechanical click feedback (optional, user-triggered).

---

## 6. Engineering & Performance Playbook

1. **Lazy Loading 3D & Heavy Assets:**
   * Never initialize Three.js scenes or heavy canvas loops if outside the viewport. Use `IntersectionObserver` to trigger canvas initialization and pause the animation loop when off-screen.
2. **Next.js Dynamic Imports:**
   ```tsx
   import dynamic from 'next/dynamic';
   const ThreeScene = dynamic(() => import('@/components/ThreeScene'), {
     ssr: false,
     loading: () => <div className="h-[400px] w-full animate-pulse bg-zinc-950" />
   });
   ```
3. **Image Optimization:**
   * All images in `/public` or Cloudinary must be converted to `.webp` or `.avif`.
   * Enforce explicit `width` and `height` to prevent Cumulative Layout Shift (CLS).
4. **Compression & HTTP Headers:**
   * Configure `next.config.mjs` with compression enabled and strict security headers (CSP, HSTS, X-Content-Type-Options).

---

## 7. Rules of Engagement for Coding Agents (Karpathy Guidelines)

When connected via SSH or running automation in this codebase:

1. **Surgical Modifications Only:**
   * Make targeted, minimal diffs. Never refactor working adjacent components unless explicitly asked.
   * Every modified line must directly map to the user's specific request.
2. **Preserve Comments & Type Safety:**
   * Do not delete existing comments, license headers, or TypeScript interfaces.
   * Ensure `npm run build` succeeds with zero TypeScript errors.
3. **No Decorative Bloat:**
   * Do not add random gradient blobs or unmotivated animations. Every interaction must feel intentional, industrial, and responsive.
4. **Git Hygiene:**
   * Current working branch: `main`.
   * Tracking remote: `fork` (`GuptaOum/Spaceborn-main-website.git`).
   * Upstream remote: `origin` (`Spaceborn-Beyond-Autonomous/Spaceborn-main-website.git`).
   * Verify git status before and after changes.
