# Copilot Instructions  - Luis Figueira Portfolio

## Build, Test, and Lint

| Command  | Description  |
|---------|-------------|
| `npm run dev`  | Start Vite dev server (port 5173) |
| `npm run build`  | Production build (writes `dist/` and copies `dist/index.html` → `dist/404.html`) |
| `npm run lint`  | Run ESLint |
| `npm run preview`  | Preview production build locally |
| **Note**: No `test` script configured - manual browser testing required |

## Architecture Overview

### Frontend (React 19 + Vite)
- **Entry**: `src/main.jsx` renders `<ConsentProvider><AuthProvider><App  /></AuthProvider></ConsentProvider>`
- **Routing**: `src/App.jsx` defines routes (`/`, `/portfolio`, `/cv`, `/certificaciones`, `/contacto`, `/panel-privado-8743`, `/games`)
- **Pages**: Each page is a self-contained component in `src/pages/` with matching CSS
- **Components**: Reusable UI in `src/components/` (Header, ThemeToggle, LanguageSelector, etc.)
- **Context**: Two providers:
  - `AuthContext`: Supabase Auth + RBAC profile resolution
  - `ConsentContext`: Cookie-based consent preferences
- **Hooks**: `useTheme`, `useContactForm`, `useRBAC`
- **i18n**: `src/i18n/` with `i18n.js` + locales (`en/`, `es/`, `pt/`)
- **Config**: `src/config/` with `constants.js` and `rbac.js`
- **Lib**: `src/lib/` with `supabase.js` and `logger.js`
- **Data**: `src/data/` with static content for Certifications and Portfolio

### Backend (Dev)
- **`server.js`**: Express server on port 3001, simulates contact API, writes to `formularios/mensajes.json` (.gitignored)

### Backend (Production)
- **Vercel Serverless Functions**: `api/` contains `contact.js` and `messages.js`
- **Supabase**: PostgreSQL database for persistent contact messages

### Deployment
- **GitHub Pages**: CI workflow in `.github/workflows/deploy.yml` builds and deploys on `main` branch pushes
- **Vercel**: `vercel.json` configures production deployment

## Key Conventions

### i18n Pattern
- All user-facing text uses `react-i18next`
- `const { t } = useTranslation()`
- Translation keys organized by area (e.g., `contact.name`, `cv.items`)
- Fallback: `en` locale
- Detection order: cookie → localStorage → default `en`

### Theme System
- `useTheme` hook reads from `localStorage` and respects consent
- Theme applied via `document.documentElement.setAttribute('data-theme', 'light' | 'dark')`
- CSS uses `data-theme` selectors and `global.css` for base styles
- Theme toggle in `src/components/ThemeToggle/`

### RBAC & Auth Flow
- Roles: `admin`, `support`, `editor`, `user`
- Permissions defined in `src/config/rbac.js`
- Profile resolution in `src/context/AuthContext` (Supabase + profile creation)
- `useRBAC` hook provides `role`, `permissions`, `can()`, `hasAll()`, `hasAny()`
- Admin route (`/panel-privado-8743`) uses `ProtectedRoute` but handles auth internally

### Supabase Usage
- Client configured in `src/lib/supabase.js`
- Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Gracefully degrades when Supabase not configured
- `supabaseConfigured` flag controls write functionality

### Contact Form
- `useContactForm` hook manages form state, rate limiting (60s min, 5/day max), and spam protection (honey pot field)
- Falls back to localStorage rate limiting when Supabase not configured

## AI Agent Guidance

### Safe Patterns for Changes
1. **Route/Page Structure**: Maintain `index.jsx` + CSS pattern in `src/pages/`
2. **State Management**: Use custom hooks for form/auth logic
3. **Internationalization**: Always use `t('key')` with `react-i18next`
4. **Theme**: Respect `data-theme` attribute, avoid hardcoded colors
5. **Supabase**: Check `supabaseConfigured` before enabling write flows
6. **Consent**: Preserve language/theme persistence tied to consent state

### Critical Pitfalls to Avoid
- No automated tests - verify manually after changes
- Admin route protection: actual login/permission flow happens in Admin page, not route-level redirect
- Contact form spam protection: preserve honey pot field and rate limiting
- Missing profile data: defaults to `user` role if profile not found

## Recommended AI Agent Practices
- Preserve existing component boundaries and file structure
- Use consistent translation keys by feature area
- Respect theme system through `data-theme` attribute
- Check Supabase configuration state before enabling forms
- Maintain consent-aware storage for language and theme preferences