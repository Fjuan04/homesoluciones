# AGENTS.md - Frontend Guide (Astro 6)

## Quick Start

**Tech stack:** Astro 6.1, Tailwind CSS 4.2, React 19 (optional islands)  
**Dev port:** 4321  
**SSG build:** `astro build` → `dist/` (static HTML only)

---

## Essential Commands

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |
| Run Astro CLI | `npx astro ...` |

---

## Global Behavior (Required)

**All pages must implement these global behaviors:**

1. **Custom Cursor** (`Cursor.astro`)
   - Two-part cursor: `#cursor-dot` (5px circle) + `#cursor-ring` (40px border)
   - Hardware-accelerated with `requestAnimationFrame` / `will-change`
   - Hidden when mouse leaves window

2. **Scroll Reveal Animations**
   - `.reveal` class (initial: `opacity:0`, `transform: translateY(30px)`)
   - Activated via `IntersectionObserver` on `.reveal.active`
   - Staggered delays: `.reveal-delay-1`, `.reveal-delay-2`

3. **Sticky Navigation**
   - Nav triggers `.scrolled` state at **60px scroll depth**
   - Changes: `backdrop-blur`, opacity, padding shrink

4. **Floating CTA**
   - Appears at **400px scroll depth** (fade in/out)
   - Positioned fixed bottom-right

> ⚠️ These behaviors must be global—do NOT implement per-component.

---

## Architecture & Component Organization

```
frontend/src/
├── pages/
│   └── index.astro          # Single-page layout aggregator
├── layouts/
│   └── Layout.astro         # Root layout (SEO, head, fonts)
├── components/
│   ├── layout/              # Reusable layout (Nav, Footer)
│   ├── features/            # Page sections (Hero, Services, etc.)
│   └── ui/                  # Atomic components (Button, Cursor)
```

### Component Categories
- **Layout:** `Nav.astro`, `Footer.astro` — page structure
- **Features (sections):** `Hero.astro`, `Stats.astro`, `Services.astro`, `Process.astro`, `Showroom.astro`, `Blog.astro`, `Contact.astro`
- **UI:** `Button.astro`, `Cursor.astro` — repeatable elements

> ✅ **Component isolation rule:** Each section must be its own `.astro` file (no inline components)

---

## Design System

### Color Palette (CSS Variables in `global.css`)
| Variable | Dark Mode | Light Mode |
|----------|-----------|------------|
| `--color-primary` | `#DD2F39` | `#DD2F39` |
| `--color-dark-bg` | `#1A1814` (black) | — |
| `--color-dark-section` | `#2E2B25` | — |
| `--color-light-bg` | — | `#F5EFE6` (white) |
| `--color-light-section` | — | `#EDE3D5` |

> ⚠️ **Do NOT hardcode colors in components.** Use CSS variables (e.g., `var(--color-primary)`)

### Typography
| Variable | Font Family | Use |
|----------|-------------|-----|
| `--font-serif` | `Cormorant Garamond` | Headings |
| `--font-sans` | `Jost` | Body, UI |

> ⚠️ Font weights and sizes are managed globally. Components should only use semantic classes.

### Semantic Class Names
| Class | Meaning | Example |
|-------|---------|---------|
| `text-primary` | Accent color (`#DD2F39`) | CTAs, icons |
| `bg-dark-bg` | Background color | Page wrapper |
| `bg-dark-section` | Section background | Cardcontainers |
| `reveal` | Scroll anim entry | Sections |
| `vertical-text` | `writing-mode: vertical-rl` | Scroll indicator |

---

## API Integration

### Data Fetching
- Use native `fetch` (no libraries)
- Fetch in ** frontmatter** (SSG time) or **client script** (hydration)
- Fallback to hardcoded data if API unavailable

### Endpoints (NestJS backend)
| Component | Endpoint |
|-----------|----------|
| Hero | `/api/projects/featured` |
| Stats | `/api/stats` |
| Services | `/api/services` |
| Process | `/api/process-steps` |
| Showroom | `/api/projects` |
| Blog | `/api/blog/latest` |

### Image URLs
- Backend returns relative paths (e.g., `/uploads/project1.jpg`)
- Frontend prepends backend base URL: `http://localhost:3000/uploads/...`
- Always check for absolute URLs (external assets)

---

## Component Specifications

### Hero
- Split 50/50 grid (text left, image right)
- Eyebrow: "Carpintería, Persianas, Domótica y Decoración"
- Animated scroll indicator (vertical text)
- Stats quick view (150+ Proyectos, 15 Años, 100% Calidad)

### Stats Bar
- 4-column grid (numeric values with labels)
- Vertical borders separating items
- Static fallback (if no API data)

### Services
- 3-column grid
- Hover: bottom-border expansion
- SVG icons (crisp scaling)

### Process
- Horizontal timeline (4 steps)
- Connected by continuous line
- Number node + title + description

### Showroom (Ambientes)
- **Horizontal scroll** layout (`overflow-x: auto`)
- Cards: fixed width/height
- Hover: image scale + gradient opacity adjust

### Blog
- Grid with "Featured" article (2-row span)
- Category tag, reading time metadata
- CTA to full blog index

### Contact
- Split grid (info left, form right)
- **Phone validation:** Colombian formats only (e.g., `+57 300 123 4567`)
- Submit via native `fetch` (no libraries)

---

## Common Pitfalls

❌ **Do not:** Hardcode colors in component logic (CSS variables only)  
❌ **Do not:** Inline components in Astro files (create separate files)  
❌ **Do not:** Forget `/api` prefix for backend calls  
❌ **Do not:** Upload non-image files (rejected by backend)  
❌ **Do not:** Use React for simple UI ( Astro islands only when needed)  
✅ **Do:** Test with both light/dark mode colors  
✅ **Do:** Validate phone field accepts `300XXXXXXX`, `+57 300 XXX XXXX`  
✅ **Do:** Run `pnpm test` after backend API changes  

---

## Debugging

| Issue | Solution |
|-------|----------|
| Custom cursor hidden | Check browser supports `pointer: fine` media query |
| Scroll reveal not triggering | Verify `IntersectionObserver` init + `.active` class |
| Nav not sticky | Confirm scroll listener at >60px and `backdrop-blur` styles |
| Fetch errors | Check `API_URL` env fallback (`http://localhost:3000/api`) |
