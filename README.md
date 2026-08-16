# BUET EEE Research Group Website

Official website for **NC Group**, a research group in the **Department of Electrical and Electronic Engineering (EEE)** at the **Bangladesh University of Engineering and Technology (BUET)**.

NC Group focuses on wide-bandgap semiconductor device research, particularly Gallium Nitride (GaN) RF and power devices.

Built with Next.js and Sanity CMS, this repository contains the full site codebase — content model, pages, components, and deployment configuration.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v6 + embedded Sanity Studio |
| Linting | ESLint (Next.js config) |
| Formatting | Prettier |

## Project Structure

```
├── sanity/                    # Sanity CMS configuration
│   ├── env.ts                 # Environment variable helpers
│   ├── lib/
│   │   ├── client.ts          # Sanity client + fetch wrapper
│   │   ├── image.ts           # Image URL builder
│   │   ├── live.ts            # Visual editing / preview foundation
│   │   └── queries/           # GROQ queries (no queries in components)
│   ├── schemas/               # CMS content schemas
│   ├── types/                 # TypeScript types for CMS data
│   └── structure.ts           # Studio desk structure
├── sanity.config.ts           # Sanity Studio config
├── sanity.cli.ts              # Sanity CLI config
├── src/
│   ├── app/                   # Next.js App Router pages
│   ├── components/
│   │   ├── layout/            # Header, Footer, MainLayout
│   │   ├── navigation/        # NavLink
│   │   ├── sections/          # Homepage section wrappers
│   │   └── ui/                # Reusable UI primitives
│   ├── config/                # Site + design token config
│   └── lib/                   # CMS fetchers, metadata, errors, utils
├── .env.example               # Environment variable template
├── ARCHITECTURE.md            # Technical architecture decisions
└── README.md
```

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm
- A Sanity account ([sanity.io](https://www.sanity.io))

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the values described in [Environment Variables](#environment-variables).

### 3. Create a Sanity project

If you do not yet have a Sanity project:

```bash
npx sanity init --project-plan free
```

Use the generated Project ID in `.env.local`.

### 4. Run the development server

```bash
npm run dev
```

- Website: [http://localhost:3000](http://localhost:3000)
- Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## Environment Variables

| Variable | Required | Public | Description |
|----------|----------|--------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes (for CMS) | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Yes | Sanity dataset (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Yes | API version date (default: `2024-01-01`) |
| `SANITY_API_READ_TOKEN` | For preview | No | Server-only token for draft/preview fetches |
| `SANITY_REVALIDATE_SECRET` | For webhooks | No | Secret for `/api/revalidate` webhook auth |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Yes | Canonical site URL for SEO |

Never commit `.env.local` or secrets.

## Sanity Setup

### Content model

| Schema | Type | Purpose |
|--------|------|---------|
| `siteSettings` | Singleton | Global site config, nav, footer, SEO defaults |
| `homepage` | Singleton | Homepage sections + featured content references |
| `researchArea` | Collection | Research areas with ordering and publish status |
| `publication` | Collection | Publications with author references |
| `person` | Collection | Team members with research area references |
| `patent` | Collection | Patents and innovations |
| `activity` | Collection | News, events, and activities |

### CMS relationships

- **Publication → Person** (authors via references)
- **Publication → Research Area** (optional references)
- **Person → Research Area** (many-to-many via references)
- **Homepage →** references selected publications, research areas, people, and activities

Master content lives in collections. The homepage selects featured items via references — content is never duplicated.

### Initial Studio content

After connecting Sanity, create these singleton documents in Studio:

1. **Site Settings** (document ID: `siteSettings`)
2. **Homepage** (document ID: `homepage`)

The Studio structure enforces singleton editing for these documents.

## How CMS Content Reaches Next.js

```
Sanity CMS
    ↓ GROQ query (sanity/lib/queries/)
    ↓ sanityFetch() with caching tags
    ↓ Typed data (sanity/types/)
    ↓ Server Component (src/lib/cms.ts)
    ↓ React component
```

- Queries live in `sanity/lib/queries/` — never inside React components.
- Data fetching runs on the server via React Server Components.
- Cache tags enable on-demand revalidation when content is published.

## Development Workflow

```bash
npm run dev          # Start dev server
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Prettier check
npm run build        # Production build
npm run validate     # typecheck + lint + format + build
```

### Adding a new content type

1. Create schema in `sanity/schemas/documents/`
2. Register in `sanity/schemas/index.ts`
3. Add to `sanity/structure.ts`
4. Add TypeScript type in `sanity/types/index.ts`
5. Add GROQ query in `sanity/lib/queries/`
6. Add fetch function in `src/lib/cms.ts`
7. Create page route in `src/app/`

### Adding a new CMS field

1. Add field to the relevant Sanity schema with description + validation
2. Update GROQ fragment/query to fetch the field
3. Update TypeScript type
4. Use the field in the relevant component (next development phase)

### Adding a new page

1. Create route under `src/app/`
2. Add fetch function if CMS-driven
3. Add `generateMetadata()` using `buildMetadata()`
4. Update sitemap if needed

## Production Deployment

1. Set all environment variables on your hosting platform (Vercel recommended).
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Deploy via `npm run build && npm start` or platform-native deployment.

### Content revalidation webhook

Configure a Sanity webhook to POST to:

```
https://your-domain.com/api/revalidate?secret=YOUR_SANITY_REVALIDATE_SECRET
```

Send the document payload in the request body. The route revalidates cache tags based on `_type`.

## Preview / Draft Workflow

The architecture supports draft preview via:

- `SANITY_API_READ_TOKEN` for authenticated draft fetches
- `sanity/lib/live.ts` for Sanity Visual Editing (`defineLive`)
- `perspective: "previewDrafts"` on the server client

Full preview UI is not implemented in this foundation phase, but the architecture does not block it.

## Image Handling

- CMS images use Sanity CDN via `@sanity/image-url`
- `sanity/lib/image.ts` provides `urlFor()` and `getImageSrcSet()`
- `src/components/ui/SanityImage.tsx` wraps Next.js `Image` with LQIP blur placeholders
- All meaningful images require alt text in the CMS (`imageWithAlt` schema object)
- `next.config.ts` allows `cdn.sanity.io` remote images

## SEO Architecture

- `src/lib/metadata.ts` — reusable `buildMetadata()` from CMS SEO fields
- `src/app/sitemap.ts` — dynamic sitemap from CMS slugs
- `src/app/robots.ts` — robots.txt (blocks `/studio` and `/api/`)
- `src/app/manifest.ts` — web app manifest
- Per-page `generateMetadata()` on all routes

## Security Considerations

- `SANITY_API_READ_TOKEN` and `SANITY_REVALIDATE_SECRET` are server-only
- Public Sanity client uses CDN with published perspective only
- Rich text will be rendered via `@portabletext/react` (sanitize by using structured blocks)
- Webhook endpoint validates secret before revalidation

## Content Principles

| Concern | Controlled by |
|---------|---------------|
| Content | CMS (Sanity) |
| Design / visual style | Code |
| Structure / routing | Code |
| Data relationships | CMS (references) |
| Business logic | Code |

## About NC Group

| | |
|---|---|
| **Group** | NC Group |
| **Department** | Electrical and Electronic Engineering (EEE) |
| **Institution** | Bangladesh University of Engineering and Technology (BUET) |
| **Focus** | Wide-bandgap semiconductors, GaN RF and power devices |

## License

Private — NC Group, Department of EEE, BUET.
