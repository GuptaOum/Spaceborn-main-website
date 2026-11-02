# Spaceborn Website — Claude Instructions & Memory Pointer

> **MANDATORY READING:**  
> Before making any edits or proposing designs, read [MEMORY.md](MEMORY.md) in the project root. It contains the complete architectural blueprint, design tokens, curated tools, and benchmarks for transforming this site into a tier-1 aerospace platform (benchmarked against **xAI, Anduril, SpaceX, Apple, and Anthropic**).

---

## 🛠️ Tech Stack & Commands

* **Framework:** Next.js 16 (App Router), React 19, TypeScript
* **Styling & Animation:** Tailwind CSS, Framer Motion, Three.js, Lucide React
* **Database & Email:** PostgreSQL (`pg`), Nodemailer, Cloudinary

### Key Commands:
* `npm run dev` — Launch development server on `http://localhost:3000`
* `npm run build` — Run production build and type checking
* `npm run start` — Start production server
* `git status` — Check repo status before committing

---

## 🎯 Target Aesthetic & Quality Standard

The website must be transformed from a student/college project appearance into a world-class defense and aerospace autonomy platform:

1. **Obsidian Dark Monochrome:** True black backgrounds (`#000000`, `#050505`), elevated cards (`#0C0D0E`), and razor-thin hairlines (`border-white/10`).
2. **Typography Discipline:** Clean geometric sans (Inter / Geist) paired with technical monospaced telemetry fonts (`IBM Plex Mono`) for tags, coordinates, and metrics (`[SYS_ACTIVE]`, `< 8.4MS LATENCY`). Retire gimmicky display fonts.
3. **Hard Engineering Specifications:** Replace vague marketing text with concrete technical metrics (compute throughput in TOPS/W, latency, sensor resolution, flight range).
4. **Fluid Spring Physics:** Use Framer Motion spring curves and smooth viewport reveals (inspired by Scrolltide & 21st.dev).
5. **High-Performance 3D & Media:** Three.js canvases must use `IntersectionObserver` to pause render loops when offscreen.

---

## 🛡️ Coding Guidelines (Karpathy Rules)

* **Surgical Modifications:** Make minimal, targeted diffs. Do not "improve" or refactor adjacent untouched code.
* **No Codebloat:** Verify every added dependency and avoid bulky unnecessary abstractions.
* **Zero Breakages:** Ensure `npm run build` passes with zero TypeScript or linting errors.
* **Reference Artifacts:** Refer to [MEMORY.md](MEMORY.md), [MODERN_WEBSITE_REELS_TABLE.docx](MODERN_WEBSITE_REELS_TABLE.docx), and [MODERN_WEBSITE_BLUEPRINT_FROM_REELS.docx](MODERN_WEBSITE_BLUEPRINT_FROM_REELS.docx) for tool links and source reels.
