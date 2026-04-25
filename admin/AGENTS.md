# AGENTS.md - Admin Panel Guide (React 19 + Vite)

## Quick Start

**Tech stack:** React 19.2, TypeScript 6, Vite 8, Framer Motion 12  
**Dev port:** 5173 (default Vite)  
**Auth:** LocalStorage token management (JWT from backend)

---

## Essential Commands

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` (TSC + Vite) |
| Lint | `npm run lint` |
| Preview | `npm run preview` |

---

## Architecture & Structure

```
admin/src/
├── main.tsx                 # React entrypoint
├── App.tsx                  # Router setup + auth gate
├── index.css                # Global styles + CSS variables
├── components/
│   └── Layout.tsx           # Sidebar + header + content wrapper
├── pages/
│   ├── Dashboard.tsx        # Overview (stats cards, activity, quick actions)
│   ├── Login.tsx            # Auth form (email/password)
│   ├── StatsManager.tsx     # CRUD stats
│   ├── ServicesManager.tsx  # CRUD services
│   ├── BlogManager.tsx      # CRUD blog posts
│   ├── ProjectsManager.tsx  # CRUD projects + featured toggle
│   └── LandingManager.tsx   # Combined landing controls
```

### Routing
| Route | Auth Required | Component |
|-------|---------------|-----------|
| `/login` | No | `Login` |
| `/` | Yes | `Dashboard` |
| `/stats` | Yes | `StatsManager` |
| `/services` | Yes | `ServicesManager` |
| `/projects` | Yes | `ProjectsManager` |
| `/blog` | Yes | `BlogManager` |

---

## Design System

### Color Palette
| Variable | Value | Use |
|----------|-------|-----|
| `--color-primary` | `#DD2F39` | Accent, buttons, highlights |
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F8F9FA` | Cards, containers |
| `--color-text` | `#1A1814` | Primary text |
| `--color-text-muted` | `#6c757d` | Secondary text |
| `--glass-bg` | `rgba(255,255,255,0.9)` | Glassmorphism elements |
| `--glass-border` | `rgba(0,0,0,0.08)` | Borders, dividers |

### Typography
| Variable | Font | Use |
|----------|------|-----|
| `--font-sans` | `Jost` | All UI (body, headings, nav) |

### Component Classes (defined in `index.css`)
| Class | Description |
|-------|-------------|
| `.glass` | Background + backdrop blur + border |
| `.card` | Elevated surface with hover effect |
| `.btn-primary` | Primary button (red fill, white text) |
| `.btn-ghost` | Button with text color, hover bg |
| `.input-field` | Text input (rounded, subtle border) |

### Sidebar
- Default open (`--sidebar-width: 280px`)
- Collapsible toggle (X/Menu icon)
- Items: Dashboard, Stats, Projects, Services, Blog, Settings

---

## Auth Flow

### Login
1. User submits email/password → `POST /api/auth/login` (backend)
2. Backend returns: `{ access_token, user: { id, email, name } }`
3. Admin saves to localStorage:
   - `localStorage.setItem('token', access_token)`
   - `localStorage.setItem('user', JSON.stringify(user))`
4. `App.tsx` validates token present → renders main layout

### Logout
- Clears `token` and `user` from localStorage
- Force reload (`window.location.href = '/login'`) to reset state

### Protected Routes
- All routes except `/login` require `isAuthenticated` to be `true`
- Use `Navigate` fallback if not authenticated

---

## Data Management

### Common Patterns
- **CRUD:** Use `axios` for API calls (backend endpoints documented in `backend/AGENTS.md`)
- **Status updates:** Reflect immediately in UI (optimistic updates)
- **Featured toggle:** Only one project can be featured — unsets others on save

### State Approach
- **Auth:** LocalStorage (`token`, `user`)
- **Data:** Component-local state (`useState`)
- **No global store** (Redux/Zustand) — keep it simple

---

## Developer Tips

1. **Consistency:** Follow existing patterns in `Layout.tsx`, `Dashboard.tsx`
2. **Icons:** Use `lucide-react` (already imported per page)
3. **Animations:** Use Framer Motion for entering content (`motion.div`)
4. **Forms:** Keep simple — `axios.post('/api/...')` then redirect on success
5. **Error handling:** Show basic toast/alert if API fails (simple approach)

---

## Common Pitfalls

❌ **Do not:** Store secrets in localStorage (tokens are XSS-risk)  
❌ **Do not:** Mix CSS frameworks — use only defined classes in `index.css`  
❌ **Do not:** Forget to update `isAuthenticated` after login/logout  
❌ **Do not:** Fetch data in `useEffect` without cleanup (cancel requests)  
✅ **Do:** Use `clsx()` for conditional classnames (already installed)  
✅ **Do:** Check `localStorage.getItem('token')` on mount  
✅ **Do:** Set `Authorization: Bearer <token>` on all protected API calls  

---

## Debugging

| Issue | Solution |
|-------|----------|
| 401 on API calls | Check token exists in localStorage + header |
| Login hangs | Verify backend `/api/auth/login` returns correct token format |
| Layout broken | Confirm `Layout.css` import in `Layout.tsx` |
| Fetch errors | Confirm backend running on correct port (`3000`) |
