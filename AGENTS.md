# AGENTS.md - Homesoluciones Repo Guide

## Quick Start

**Monorepo structure:**
- `backend/` — NestJS API (Node.js 22+, PostgreSQL, Prisma)
- `frontend/` — Astro 6 static site (Tailwind CSS 4)
- `admin/` — React 19 admin panel (Vite)
- `.opencode/` — OpenCode AI agent configurations

---

## Essential Commands

| Component | dev | build | test |
|-----------|-----|-------|------|
| backend   | `pnpm start:dev` | `pnpm build` | `pnpm test:cov` |
| frontend  | `npm run dev` (port 4321) | `npm run build` | — |
| admin     | `npm run dev` | `npm run build` | — |

- **Backend package manager:** `pnpm` (not npm)
- **Environment file:** `backend/.env` — use `DATABASE_URL` from there
- **API prefix:** `/api/*` — all backend routes are prefixed
- **Static files:** uploaded assets → `backend/public/uploads/`

---

## Architecture & Conventions

### Backend Structure
- **Controller pattern:** `ModuleController` + `ModuleService` + DTOs in `modules/*/dto/`
- **Database access:** `PrismaService` (NOT direct `PrismaClient`)
- **Auth:** JWT-only, via `@JwtAuthGuard`
- **File uploads:** `/upload` endpoint only, images only (5MB limit)
- **Featured logic:** Setting `isFeatured=true` on Projects automatically deselects others

### API Endpoints (public)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/stats` | GET | Statistics (years, projects, etc.) |
| `/api/services` | GET | Service catalog |
| `/api/projects` | GET | All projects |
| `/api/projects/featured` | GET | Currently featured project |
| `/api/process-steps` | GET | Work process steps |
| `/api/blog/latest` | GET | Last 3 blog posts |

**Protected endpoints (JWT required):** `/api/stats`, `/api/projects` — POST/PATCH/DELETE

### Frontend Patterns

- **Component organization:** `src/components/features/` and `src/components/layout/`
- **CSS variables:** None defined in components (managed globally by lead dev per SRS.md)
- **Global behaviors implemented:**
  - Custom cursor with two-part animation (ring + dot)
  - IntersectionObserver scroll reveals (`.reveal-delay-1`, `.reveal-delay-2`)
  - Sticky nav (opacity/padding change at 60px scroll)
  - Floating CTA (appears at 400px scroll)
- **Semantic naming:** Use **"Ambientes"** for rooms/projects gallery
- **Color palette:** Dark mode `#1A1814` (black) & `#2E2B25` (sections); Light mode `#F5EFE6` (white) & `#EDE3D5` (sections)
- **Primary accent:** `#DD2F39`

---

## Setup & Prerequisites

1. **Node version:** `>=22.12.0` (checked via `engines` in `package.json`)
2. **Backend DB:** PostgreSQL via Prisma (local: port 51213, DB `template1`)
3. **Seeded admin:** `POST /api/auth/seed` creates `admin@homesoluciones.com` / `admin123`
4. **Init dev servers:**
   - Backend: `cd backend && pnpm install && pnpm start:dev`
   - Frontend: `cd frontend && npm install && npm run dev`
   - Admin (needs backend): `cd admin && npm install && npm run dev`

---

## Style & Quality Constraints

- **Backend linting:** `eslint.config.mjs` — disables `no-explicit-any`, warns on `no-floating-promises`
- **Formatting:** `prettier --write` with `singleQuote: true` and `trailingComma: all`
- **Component isolation:** Each section must be its own `.astro` file (no inline components)
- **Image URLs:** Backend must return optimized formats (WebP/AVIF)
- **Form validation (frontend):** Phone field accepts Colombian formats; use native `fetch` for form submission

---

## Deployment Notes

- **Backend static assets:** `ServeStaticModule` serves `backend/public/` from root
- **Environment variables:** Not auto-loaded by Prisma — add `import "dotenv/config";` if needed in Prisma config
- **No CI/CD or Docker config** in repository — manual deployment assumed
- **Frontend output:** `frontend/dist/` (SSG build)
- **Admin output:** `admin/dist/` (React + Vite)

---

## Common Pitfalls for Agents

❌ **Do not:** Hardcode colors or typography in component logic (CSS variables handled centrally)  
❌ **Do not:** Add new dependencies without confirming with existing stack  
❌ **Do not:** Modify `prisma/schema.prisma` without understanding migration implications  
❌ **Do not:** Forget `/api` prefix for backend routes in frontend calls  
❌ **Do not:** Upload non-image files via `/upload` (only `.jpg/.jpeg/.png/.webp/.gif`)  
✅ **Do:** Run `pnpm test:cov` after backend changes  
✅ **Do:** Check `backend/public/uploads/` when debugging image URLs  
✅ **Do:** Read `backend/.env` before assuming DB connection details  

---

## Files That Describe This Repo

- `/backend/README.md` — generic NestJS boilerplate (ignore, outdated)
- `/frontend/SRS.md` — **authoritative** component requirements & UX
- `/backend/api-integration.md` — **authoritative** JSON data structures
- `/frontend/README.md` — generic Astro boilerplate (ignore)
- `/admin/README.md` — admin panel description (accurate)
- `/backend/prisma/schema.prisma` — **authoritative** DB schema

---

## Open Questions / Missing Info

- No CI/CD defined in repo — confirm deployment workflow with team
- No test fixtures or integration test setup documented
- No release/branch strategy found (`main`/`develop`?
- No documented convention for PR titles or commit messages
