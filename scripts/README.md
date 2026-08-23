# NC Group Seeds

Two safe, idempotent seeds:

- **Homepage** (`seed-homepage-content.mjs`) — homepage CMS content, source: Figma node `39:2`
- **People** (`seed-people.mjs`) — the `person` roster, source: the group's live team page

Both share the same safety model and preview/apply workflow described below.

## Homepage seed

## Safety model

| Guarantee | How |
|-----------|-----|
| No dataset wipe | Does **not** use `sanity dataset import --replace` |
| No deletions | Never calls `delete` |
| Scoped mutations | Only deterministic seed document IDs (see below) |
| Idempotent | Re-running updates the same documents via `createOrReplace` / `patch` |
| Unrelated docs preserved | Documents outside the seed ID list are never touched |
| Write token server-only | Uses `SANITY_API_WRITE_TOKEN` in `.env.local` only (never `NEXT_PUBLIC_*`) |

## Commands

```bash
# 1. Preview (default — read-only, no mutations)
npm run seed:homepage

# 2. Apply (requires SANITY_API_WRITE_TOKEN with Editor permissions)
npm run seed:homepage:apply

# 3. Re-upload Figma image assets
npm run seed:homepage:apply -- --force-images
```

## Authentication

1. Create an **Editor** token at [sanity.io/manage](https://www.sanity.io/manage) → Project → API → Tokens
2. Add to `.env.local`:

```env
SANITY_API_WRITE_TOKEN=your-editor-token-here
```

The read token (`SANITY_API_READ_TOKEN`) is sufficient for dry-run preview only.

## Seed document IDs (18 total)

### Singletons (2)

- `siteSettings` — patched (seed fields only; contact/social fields preserved)
- `homepage` — createOrReplace

### Research areas (6)

- `researchArea-fabrication`
- `researchArea-device-physics`
- `researchArea-ai-hardware-design`
- `researchArea-modeling-simulation`
- `researchArea-3d-ic`
- `researchArea-circuits`

To sync these in an existing Sanity dataset (remap legacy refs, delete extras):

```bash
node --env-file=.env.local scripts/sync-canonical-research-areas.mjs --apply
```

### Publications (6)

- `publication-physics-based-reliability-modeling-gan-rf`
- `publication-buffer-induced-trapping-algan-gan-hemts`
- `publication-compact-modeling-vertical-gan-power-diodes`
- `publication-thermal-transport-limits-lateral-gan-power`
- `publication-field-plate-optimization-high-voltage-gan-hemts`
- `publication-tcad-study-dynamic-on-resistance-gan-diodes`

### Patents (2)

- `patent-gan-hemts-field-plate-architecture`
- `patent-vertical-gan-power-diode-termination`

### Activities (4)

- `activity-vertical-gan-power-diodes-edl`
- `activity-rf-reliability-device-physics-workshop`
- `activity-welcomes-graduate-researchers`
- `activity-open-compact-model-library`

### Not seeded by the homepage seed

- **Person records** — seeded separately, see the People seed below
- **Publication authors / DOI** — not shown in Figma

## Image assets

Local Figma exports (uploaded on `--apply` unless already present):

- `scripts/assets/team-photo.png` → homepage `teamImage`
- `scripts/assets/partner-logo.png` → siteSettings `partnerLogo`

## Demo / placeholder content

These Figma values are seed/demo until replaced with verified data:

- Patent titles and numbers

## People seed

Transcribes the group's live team page — <https://sdreambuet2024.wixsite.com/s-dreambuet/team> — into
19 `person` documents (`scripts/seed-people-data.mjs`).

```bash
# Preview (read-only)
npm run seed:people

# Apply
npm run seed:people:apply

# Re-download and re-upload every portrait
npm run seed:people:apply -- --force-images
```

Seed IDs follow `person-<slug>`, e.g. `person-nadim-chowdhury`. Portraits are downloaded
from the live site at original resolution and uploaded to the Sanity asset pipeline;
a person who already has a photograph keeps it unless `--force-images` is passed.

Roster groups written to the `group` field:

| Group | Count |
|-------|-------|
| `pi` | 1 |
| `phd` | 1 |
| `msc` | 10 |
| `undergrad` | 4 |
| `alumni` | 3 |

### Left empty on purpose

- `researchInterests` — the live page lists none; fill in Studio to surface the PI's
  "Research interests" line and the keyword line on doctoral rows
- `biography` — only the PI has one on the live page
- `externalProfileLinks` — only the PI (Google Scholar, CV) and Toiyob Hossain
  (website, LinkedIn) have real links; the other social icons on the live page are
  unlinked placeholders
