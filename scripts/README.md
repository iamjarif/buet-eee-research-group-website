# S-DREAM Homepage Seed

Safe, idempotent seed for the S-DREAM homepage CMS content (source: Figma node `39:2`).

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

## Seed document IDs (19 total)

### Singletons (2)

- `siteSettings` — patched (seed fields only; contact/social fields preserved)
- `homepage` — createOrReplace

### Research areas (4)

- `researchArea-gan-rf-devices`
- `researchArea-gan-power-devices`
- `researchArea-device-physics-modeling`
- `researchArea-tcad-advanced-simulation`

### Publications (6)

- `publication-physics-based-reliability-modeling-gan-rf`
- `publication-buffer-induced-trapping-algan-gan-hemts`
- `publication-compact-modeling-vertical-gan-power-diodes`
- `publication-thermal-transport-limits-lateral-gan-power`
- `publication-field-plate-optimization-high-voltage-gan-hemts`
- `publication-tcad-study-dynamic-on-resistance-gan-diodes`

### Contributions (3)

- `contribution-publications`
- `contribution-patents-innovations`
- `contribution-recognition`

### Activities (4)

- `activity-vertical-gan-power-diodes-edl`
- `activity-rf-reliability-device-physics-workshop`
- `activity-welcomes-graduate-researchers`
- `activity-open-compact-model-library`

### Not seeded

- **Person records** — Figma homepage shows a group photo only; no individual names to avoid inventing researchers
- **Publication authors / DOI** — not shown in Figma

## Image assets

Local Figma exports (uploaded on `--apply` unless already present):

- `scripts/assets/team-photo.png` → homepage `teamImage`
- `scripts/assets/partner-logo.png` → siteSettings `partnerLogo`

## Demo / placeholder content

These Figma values are seed/demo until replaced with verified data:

- Contribution stats: `12+`, `16`
- Recognition award text
