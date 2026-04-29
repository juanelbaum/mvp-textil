# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

**TextilConnect** is a B2B marketplace MVP connecting clothing manufacturers with textile workshops. Currently a **frontend-only app with mock data** — no backend or real authentication yet, designed for future Supabase integration.

### Role-based UI
The app supports two user roles (`manufacturer` / `workshop`) managed by `RoleProvider` (Context API). UI adapts based on role — same pages render different content/actions depending on `useRole()`. Role toggling is client-side only (mock).

### Data layer
All data lives in `src/lib/mocks/` (users, orders, workshops, messages). These are direct imports — no API calls yet. The `src/services/` directory is empty and ready for the real data access layer when Supabase is wired up.

### Component model
- **Server Components by default** — only add `'use client'` when needed (interactivity, hooks, browser APIs)
- UI primitives in `src/components/ui/` (ShadCN-based)
- Domain components in `src/components/{orders,workshops,dashboard,layout}/`
- Props types live in the component file itself; shared domain types go in `src/types/`

### Import conventions
- Always use `@/` path alias (maps to `src/`), never relative imports
- No barrel files (`index.ts` re-exports) — import directly from the source file

### Constants
All constants go in `src/constants/` in domain-specific files. Never hardcode values inline.

## Planned Backend Architecture (when adding Supabase)

Follow the strict layered pattern from the cursor rules:

```
Route Handler / Server Action (Controller)
  → Service (business logic, validation, orchestration)
    → Repository (DB queries only — never skipped)
```

**Critical security rule:** Supabase DB queries must **only** run server-side (Server Components, Server Actions, Route Handlers). Always import `'server-only'` in files with DB access. Client-side Supabase usage is limited to auth (`signIn`/`signOut`) only.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 App Router |
| Language | TypeScript 5.9 (strict) |
| UI | React 19 + ShadCN components |
| Styling | Tailwind CSS v4 + PostCSS |
| Icons | Lucide React |
| State | Context API (RoleProvider) |
| Future DB | Supabase |
| Future forms | React Hook Form + Zod |
| Future data fetching | TanStack Query with HydrationBoundary |

## File Size Limits

Keep files under 300 lines. Refactor if approaching 200 lines — extract logic to custom hooks, split large components.
