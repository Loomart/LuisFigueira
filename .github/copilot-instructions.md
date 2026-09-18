# Copilot Instructions - Luis Figueira Portfolio

## Build, Test, and Lint

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build (writes `dist/` and copies `dist/index.html` → `dist/404.html`) |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Architecture

### Frontend (React 19 + Vite)

- **Entry:** `src/main.jsx` renders `<ConsentProvider><AuthProvider><App /></AuthProvider></ConsentProvider>`
- **Routing:** `src/App.jsx` defines routes (`/`, `/portfolio`, `/cv`, `/certificaciones`, `/contacto`, `/panel-privado-8743`). The `/panel-privado-8743` route is wrapped in a `ProtectedRoute` that currently skips auth checks (the Admin page handles its own login/permission flow internally).
- **Pages:** `src/pages/` — each page is a self-contained component with its own CSS.
- **Components:** `src/components/` — reusable UI pieces (Header, ThemeToggle, LanguageSelector, ConsentBanner, Notification, and content cards).
- **Context:** `src/context/` — two providers:
  - `AuthContext` (Supabase Auth + RBAC profile resolution)
  - `ConsentContext` (cookie-based consent preferences)
- **Hooks:** `src/hooks/` — `useTheme`, `useContactForm`, `useRBAC`
- **i18n:** `src/i18n/` — `i18n.js` + locales (`en/`, `es/`, `pt/`)
- **Config:** `src/config/` — `constants.js` (shared keys), `rbac.js` (role/permission definitions)
- **Lib:** `src/lib/` — `supabase.js` (Supabase client), `logger.js`
- **Data:** `src/data/` — static content for Certifications and Portfolio pages

### Backend (Dev)

- **`server.js`** — Express server on port 3001, simulates the contact API. Writes to `mensajes.json` in `formularios/` (`.gitignored`).

### Backend (Production)

- **Vercel Serverless Functions** in `api/` — `api/contact.js` and `api/messages.js`
- **Supabase** — PostgreSQL database for persistent contact messages

### Deployment

- **GitHub Pages** — CI workflow in `.github/workflows/deploy.yml` builds and deploys to GitHub Pages on `main` branch pushes.
- **Vercel** — `vercel.json` configures production deployment.

## Key Conventions

### i18n Pattern

All user-facing text goes through `react-i18next`. Pages use `const { t } = useTranslation()` and call `t('key')` or `t('key', { defaultValue: 'fallback' })`. Translation keys are organized by page/component (e.g., `contact.name`, `cv.items`).

### Theme System

- `useTheme` hook reads `localStorage` for saved theme, falls back to system preference if consent is granted.
- Theme is applied via `document.documentElement.setAttribute('data-theme', 'light'|'dark')`.
- CSS uses `card-theme.css` for card-specific theming and `global.css` for base styles.

### RBAC / Auth Flow

- Supabase Auth provides the user session.
- `AuthContext` resolves the user's profile from the `profiles` table, creating it if missing.
- `useRBAC` reads `profile.role` and `profile.permissions` from the context.
- Roles: `admin`, `support`, `editor`, `user`. Permissions are defined in `src/config/rbac.js`.
- The Admin panel (`/panel-privado-8743`) handles its own login form and permission checks internally.

### Contact Form

- `useContactForm` hook manages form state, rate limiting (min 60s between submissions, max 5/day), and Supabase insert.
- Falls back to localStorage-based rate limiting when Supabase is not configured.
- Spam detection: rejects submissions with `hp` field populated.

### Component Patterns

- Pages and components follow a consistent pattern: `index.jsx` + `*.css`.
- Cards (Experience, Education, Skill, Language) receive data as props and render generically.
- The Portfolio page manages an `openIndex` state to expand/collapse cards one at a time.

### Supabase Client

- `src/lib/supabase.js` exports a configured Supabase client.
- `src/lib/logger.js` provides a simple logger with `info`, `warn`, `error` methods.

### Environment Variables

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set at build time via GitHub Actions env vars.
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are used in production Vercel deployments.
