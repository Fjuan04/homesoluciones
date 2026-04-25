# AGENTS.md - Backend Guide (NestJS)

## Quick Start

**Tech stack:** NestJS 11, TypeScript 5, PostgreSQL, Prisma 6  
**Port:** 3000 (default, configurable via `PORT` env)  
**API prefix:** `/api/*` (all routes automatically prefixed)

---

## Essential Commands

| Task | Command |
|------|---------|
| Start dev server | `pnpm start:dev` |
| Build | `pnpm build` |
| Run tests (coverage) | `pnpm test:cov` |
| Format code | `pnpm format` |
| ESLint with auto-fix | `pnpm lint` |
| Prisma migrations | `pnpm prisma migrate dev` |
| Prisma generate | `pnpm prisma generate` |

---

## Architecture & Conventions

### Project Structure
```
backend/src/
├── main.ts                 # App entrypoint (sets CORS, prefix `/api`)
├── app.module.ts           # Root module
├── config/                 # Configuration (database, environment)
├── database/               # Prisma service + connection setup
├── modules/                # Feature modules (CRUD + auth)
│   ├── auth/
│   ├── landing/
│   ├── services/
│   ├── upload/
│   └── users/
└── admin/                  # AdminJS configuration
```

### Key Patterns
- **Service layer:** Database operations go in `*Service.ts` (NOT controllers)
- **Controllers:** Only route handling + DTO validation
- **DB access:** Always via `PrismaService` (injected), NOT direct `PrismaClient`
- **Auth:** JWT-only (`@JwtAuthGuard`)

### Module Ownership
- `LandingModule`: Stats, Projects, ProcessSteps, BlogPost management
- `AuthModule`: Login, seed, JWT strategy
- `UploadModule`: Single-image upload to `public/uploads/`
- `UsersModule`: User CRUD (rarely used directly)

---

## API Reference

### Public Endpoints (no auth)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/stats` | List all stats |
| GET | `/api/services` | List all services |
| GET | `/api/projects` | List all projects (ordered by `createdAt DESC`) |
| GET | `/api/projects/featured` | Currently featured project |
| GET | `/api/process-steps` | Ordered by `num` (ascending) |
| GET | `/api/blog/latest` | Last 3 blog posts |

### Protected Endpoints (JWT required)

**Auth endpoints:**
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Authenticate → returns `access_token` + user |
| POST | `/api/auth/seed` | Create admin user (`admin@homesoluciones.com` / `admin123`) |

**Landing endpoints (all require `@JwtAuthGuard`):**
| Resource | CRUD | Route |
|----------|------|-------|
| Stats | POST / PATCH / DELETE | `/api/stats` / `/api/stats/:id` |
| Projects | POST / PATCH / DELETE | `/api/projects` / `/api/projects/:id` |
| Services | POST / PATCH / DELETE | `/api/services` / `/api/services/:id` |

### Upload Endpoint
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/upload` | Single image file (5MB max, images only: `.jpg/.jpeg/.png/.webp/.gif`) |

**Response:**
```json
{
  "url": "/uploads/{hashed_filename}.{ext}"
}
```

---

## Database Schema (Prisma)

### Tables (all with `createdAt`/`updatedAt`)
| Model | Key Fields | Notes |
|-------|------------|-------|
| `User` | `email`, `password` | Auth users (BCrypt hashed) |
| `Stat` | `value`, `label`, `sub` | Stats numbers (e.g., "150+", "Años Exp.") |
| `Service` | `title`, `desc`, `link` | Service cards |
| `Project` | `title`, `image`, `isFeatured` | Projects + featured flag |
| `ProcessStep` | `num`, `title`, `desc` | Work process steps |
| `BlogPost` | `title`, `date`, `cat`, `excerpt` | Blog articles |

### Critical Business Logic
- **Featured project:** Only **one** `Project.isFeatured = true` at a time
  - When creating/updating, if `isFeatured=true`, all others automatically unset
- **Featured fallback:** `/api/projects/featured` returns first `isFeatured=true`, otherwise latest
- **Blog limit:** `/api/blog/latest` returns **only 3 posts**

---

## Setup & Prerequisites

1. **Node version:** `>=22.12.0` (per `package.json` engines)
2. **DB:** PostgreSQL on port `51213` (Prisma local dev)
3. **Seed admin:** `curl -X POST http://localhost:3000/api/auth/seed`
4. **Env file:** `backend/.env` — contains `DATABASE_URL`
   > ⚠️ Prisma does NOT auto-load `.env` — add `import "dotenv/config";` to Prisma config if needed

---

## Style & Quality

### Linting & Formatting
- **ESLint config:** `eslint.config.mjs`
  - `no-explicit-any: off`
  - `no-floating-promises: warn`
- **Prettier:** `.prettierrc`
  - `singleQuote: true`
  - `trailingComma: all`
- **Format before commit:** `pnpm format`

### DTO Validation Rules
- **Login DTO:** Email format, min 6 chars password
- **CreateProject DTO:** `title`, `category`, `image` required; `location`/`city` optional
- **All DTOs:** Use `class-validator` decorators (`@IsString()`, `@IsNotEmpty()`, `@IsOptional()`)

---

## Common Pitfalls

❌ **Do not:** Call `new PrismaClient()` directly (use `PrismaService`)  
❌ **Do not:** Hardcode passwords (always `bcrypt.hash`)  
❌ **Do not:** Upload non-image files via `/upload` (rejected with 400)  
❌ **Do not:** Forget `@JwtAuthGuard` on write endpoints  
❌ **Do not:** Create multiple featured projects (auto-unset others)  
✅ **Do:** Run `pnpm prisma generate` after schema changes  
✅ **Do:** Check `backend/public/uploads/` when debugging image URLs  
✅ **Do:** Use `ParseIntPipe` for numeric params (`:id`)  

---

## Debugging

| Issue | Solution |
|-------|----------|
| CORS errors | Check `app.enableCors()` in `main.ts` |
| Prisma connection | Verify `DATABASE_URL` in `backend/.env` |
| Migration conflicts | `pnpm prisma migrate reset` (dev only) |
| Upload 500 error | Ensure `backend/public/uploads/` exists |
| JWT invalid token | Re-run `/api/auth/seed` to recreate admin |
