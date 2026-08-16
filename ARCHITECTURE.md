# NC Group Website — Architecture

This document describes the technical architecture and key decisions for the NC Group website foundation.

## Overview

The application follows a **headless CMS + server-rendered React** architecture:

- **Next.js App Router** for routing, SSR, caching, and SEO
- **Sanity CMS** for all editable content
- **TypeScript strict mode** end-to-end
- **Tailwind CSS v4** for styling (design tokens prepared, final design deferred)

## Architectural Principles

### Content vs. Design Separation

| Layer | Owner | Location |
|-------|-------|----------|
| Editable content | Office staff (CMS) | Sanity Studio |
| Visual design | Developer | Tailwind + design tokens |
| Routing / structure | Developer | `src/app/` |
| Data relationships | CMS references | Sanity schemas |
| Business logic | Developer | `src/lib/` |

No editable content is hard-coded in React components. Design properties (colors, spacing, animations) are not CMS fields.

### Server-First Data Fetching

```
┌─────────────┐     GROQ      ┌──────────────────┐
│ Sanity CMS  │ ────────────► │ sanity/lib/      │
└─────────────┘               │ queries/         │
                              └────────┬─────────┘
                                       │ sanityFetch()
                                       ▼
                              ┌──────────────────┐
                              │ src/lib/cms.ts   │
                              └────────┬─────────┘
                                       │ typed data
                                       ▼
                              ┌──────────────────┐
                              │ Server Component │
                              └──────────────────┘
```

- Default: React Server Components
- Client Components only where interactivity requires it (`error.tsx`, Studio)
- No client-side CMS fetching in components
- No GROQ queries inside React components

## Directory Responsibilities

### `sanity/`

CMS layer — completely separate from UI.

| Path | Responsibility |
|------|----------------|
| `env.ts` | Environment config, public vs. server-only separation |
| `lib/client.ts` | Sanity client instances, `sanityFetch()` wrapper |
| `lib/image.ts` | Image URL builder for Sanity CDN |
| `lib/live.ts` | Visual editing / draft preview foundation |
| `lib/queries/` | All GROQ queries and shared fragments |
| `schemas/` | Sanity schema definitions |
| `types/` | TypeScript interfaces mirroring CMS shapes |
| `structure.ts` | Studio desk navigation |

### `src/app/`

Next.js routes. Each route:

- Fetches data via `src/lib/cms.ts` functions
- Exports `generateMetadata()` for SEO
- Uses minimal `PageShell` or `FoundationSection` wrappers (no final design)

### `src/components/`

| Directory | Purpose |
|-----------|---------|
| `layout/` | Header, Footer, MainLayout, PageShell |
| `navigation/` | NavLink |
| `sections/` | Homepage section structural wrappers |
| `ui/` | Button, Container, Card, SanityImage, SkipLink |

### `src/lib/`

Application logic:

- `cms.ts` — typed data-fetching functions
- `metadata.ts` — SEO metadata builder
- `errors.ts` — CMS error handling utilities
- `utils.ts` — shared helpers

### `src/config/`

- `site.ts` — fallback site constants (used when CMS unavailable)
- `design-tokens.ts` — CSS variable references for future design system

## Content Model

### Singletons

Fixed document IDs enforced by Studio structure:

- `siteSettings` — global configuration
- `homepage` — homepage-specific content and featured references

### Collections

Dynamic document collections (no fixed count):

- `researchArea`
- `publication`
- `person`
- `patent`
- `activity`

### References (not embedding)

The homepage references collection documents rather than embedding them:

```
homepage.featuredPublications[] → publication
homepage.featuredResearchAreas[] → researchArea
homepage.featuredTeam[]         → person
homepage.featuredPublications[] → publication
homepage.featuredActivities[]   → activity
```

This ensures a person's name change in one place updates everywhere.

### Ordering

Collections use explicit `displayOrder` number fields. Studio lists default-sort by:

- Research areas, people, patents: `displayOrder asc`
- Publications: `year desc`
- Activities: `date desc`

### Publishing

- `isPublished` on research areas and activities
- `isActive` on people
- Public client uses `perspective: "published"` — drafts are not exposed
- Draft preview prepared via `SANITY_API_READ_TOKEN` + `sanity/lib/live.ts`

## Caching & Revalidation

### Default behavior

`sanityFetch()` uses:

- `cache: "force-cache"` with 1-hour revalidation (`DEFAULT_REVALIDATE = 3600`)
- Next.js cache tags per content type

### On-demand revalidation

`POST /api/revalidate?secret=...` accepts Sanity webhook payloads and:

1. Validates `SANITY_REVALIDATE_SECRET`
2. Revalidates tags based on document `_type`
3. Revalidates slug-specific tags when available
4. Revalidates `/` path

### Tag mapping

| Document type | Cache tags |
|---------------|------------|
| siteSettings | `siteSettings` |
| homepage | `homepage` |
| researchArea | `researchAreas`, `researchArea:{slug}` |
| publication | `publications`, `publication:{slug}` |
| person | `people`, `person:{slug}` |
| activity | `activities`, `activity:{slug}` |

## Type Safety

Types are manually defined in `sanity/types/index.ts` mirroring GROQ query results.

Flow:

```
Sanity schema → GROQ query fragments → TypeScript types → cms.ts fetchers → components
```

Future enhancement: Sanity TypeGen can generate types from schemas/queries automatically.

## Image Pipeline

1. CMS stores images in Sanity asset pipeline
2. `imageWithAlt` object type enforces alt text
3. GROQ queries fetch asset metadata including LQIP
4. `urlFor()` builds optimized CDN URLs
5. `SanityImage` component renders via Next.js `Image`

Configuration:

- `next.config.ts` → `remotePatterns` for `cdn.sanity.io`
- Hotspot/crop supported via Sanity image fields

## SEO

Metadata hierarchy:

1. Page-specific CMS SEO fields (`seo` object on documents)
2. Page title/description props
3. Site Settings default SEO
4. `siteConfig` fallbacks

Generated artifacts:

- `sitemap.ts` — static routes + CMS dynamic slugs
- `robots.ts` — blocks Studio and API routes
- `manifest.ts` — PWA manifest foundation

## Accessibility Foundation

- Semantic HTML elements (`header`, `nav`, `main`, `footer`, `section`, `address`)
- Skip-to-content link
- Focus-visible styles in global CSS
- `prefers-reduced-motion` media query disables animations
- Alt text required for CMS images
- Screen-reader-only section headings on homepage foundation sections

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing CMS config | Setup message on homepage |
| Failed CMS fetch | `safeCmsFetch()` returns fallback, logs in dev |
| Invalid slug | `notFound()` |
| Missing document | `notFound()` |
| Runtime error | `error.tsx` with retry |
| Missing optional field | Graceful null/empty handling |

## Security

- Public env vars prefixed with `NEXT_PUBLIC_`
- Read token and revalidate secret are server-only
- Studio route excluded from sitemap/robots indexing
- Webhook endpoint requires secret validation
- Rich text rendered through Portable Text (structured, not raw HTML)

## Routing Map

| Route | Status | Data source |
|-------|--------|-------------|
| `/` | Foundation | homepage + siteSettings |
| `/research` | Foundation | researchArea collection |
| `/research/[slug]` | Foundation | researchArea by slug |
| `/publications` | Foundation | publication collection |
| `/publications/[slug]` | Foundation | publication by slug |
| `/people` | Foundation | person collection |
| `/people/[slug]` | Foundation | person by slug |
| `/activities` | Foundation | activity collection |
| `/activities/[slug]` | Foundation | activity by slug |
| `/contact` | Foundation | siteSettings contact fields |
| `/studio/[[...tool]]` | Complete | Embedded Sanity Studio |
| `/api/revalidate` | Complete | Webhook handler |

## Dependencies

### Production

- `next`, `react`, `react-dom`
- `next-sanity`, `sanity`, `@sanity/client`, `@sanity/image-url`
- `@portabletext/react`, `@portabletext/types`
- `@sanity/vision` (Studio GROQ tool)
- `styled-components` (Sanity Studio peer dependency)
- `clsx`, `tailwind-merge`

### Development

- `typescript`, `eslint`, `eslint-config-next`, `eslint-config-prettier`
- `prettier`, `tailwindcss`, `@tailwindcss/postcss`

## Deferred to Next Phase

- Figma visual design implementation
- Homepage section UI components
- Detail page layouts
- Portable Text renderer component
- Animations and transitions
- Sanity TypeGen automation
- Full draft preview UI
- Custom favicon assets

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Embedded Studio at `/studio` | Single deployment, simpler for university IT |
| Manual TypeScript types | Simpler foundation; TypeGen can be added later |
| Singleton document IDs | Prevents duplicate global/homepage documents |
| Reference-based homepage | Avoids content duplication, supports dynamic collections |
| 1-hour default revalidation | Balance freshness vs. performance; webhooks for instant updates |
| Minimal page UI | Foundation phase — design comes from Figma next |
