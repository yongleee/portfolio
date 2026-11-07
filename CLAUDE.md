# Portfolio

Personal portfolio site: React 19 + TypeScript + Vite, Tailwind v4 with shadcn/ui (Lyra
preset), Motion for animation. Single page with hash routing (`src/lib/useHash.ts`); each
project's case file lives at `#project-<num>`.

## Commands

- `nvm use` first — `.nvmrc` pins Node 24; the machine default is 22.
- `npm run dev`, or `docker compose up` (dev server on host port **5174**; 5173 is taken).
- `npm run build` (`tsc -b && vite build`) is the check that matters; `npm run lint` is oxlint.
- `npm run format` formats with Biome (4 spaces, single quotes, no semicolons, 100 cols).

## Where things live

- `src/config.ts` holds all content and settings: identity, theme, terminal lines,
  skills, `PROJECTS` and socials. Components render from it, so content changes go there.
- `src/components/ui/` is shadcn. Never edit these files; customise through `className`
  or a wrapper component.
- `public/projects/<slug>/` holds each project's artwork: anonymized wireframe SVGs, one
  per `ImageSlot`.
- `PROJECTS` runs most recent first, numbered `01`… in that order. `num` is also the
  `#project-<num>` route and the key in `COMMIT_SOURCES` and `commit-activity.json`, so
  renumbering means updating those too. `gh` and `live` are optional, and the card shows
  those links only when they're set; real work projects leave `gh` out, because their
  repos are private.
- `src/data/commit-activity.json` holds the monthly commit counts behind each case file's
  COMMIT ACTIVITY chart. `npm run fetch-commits` (`scripts/fetch-commits.ts`) regenerates
  it from GitLab. Don't edit it by hand, and keep GitLab URLs, project IDs, emails and
  tokens out of the repo; they only live in `.env` or host env vars. See the README.

## Adding a project

Use the `add-portfolio-project` skill (`.claude/skills/add-portfolio-project/`). It
mines local repos and writes the config entry and the artwork.

## Working here

- Make small edits one at a time, not big rewrites, so each one is easy to review.
- Explain layout or visual changes to `ProjectPage.tsx` / `Projects.tsx` before making
  them, and check them against the `frontend-design` skill first.
- Prefer Tailwind utilities and existing libraries (tw-animate-css, Motion) over
  hand-written CSS.
- Leave the user's unrelated edits alone, including unformatted code in `config.ts`.
  Format only the files you changed.
