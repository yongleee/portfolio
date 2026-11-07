---
name: add-portfolio-project
description: Turn one or more local code repos into a project case file on this portfolio site — an entry in src/config.ts PROJECTS plus anonymized wireframe SVG artwork in public/projects/<slug>/. Use this whenever the user wants to add, list, showcase or write up a project they built in this portfolio ("put X in my portfolio", "make a project page for these repos", "list my work project here", "add another case file"), or points at repo paths and asks what from them could go on the site — even if they never say "config.ts", "case file" or "SVG".
---

# Add a portfolio project

This portfolio's case files are data-driven: a project is one object in `PROJECTS` in
`src/config.ts`, plus optional images under `public/projects/<slug>/`. The work log card
(`src/components/Projects.tsx`) and the case-file page (`src/components/ProjectPage.tsx`,
reached at `#project-<num>`) render from that object. Adding a project normally needs no
component changes at all.

The source material is the user's own local repos — usually work projects they cannot
screenshot or link to. So the job has three parts: mine the repos for **true, specific
facts**, write a case file a recruiter or engineer would believe, and draw **wireframe
artwork that shows the shape of the product without leaking anything about the client**.

## Workflow

### 1. Read the current site first

Read `src/config.ts` (the `ProjectDetails`, `ImageSlot` and `Project` types and the
existing entries) and the slot markup in `ProjectPage.tsx` / `Projects.tsx`. The user
edits these files often, so treat what is on disk as the truth over anything written
here — field names, slot names and aspect ratios may have changed. The first real
project in `PROJECTS` is the best example of tone and density.

### 2. Mine the repos

Run the bundled script on every repo path the user gave:

```bash
bash .claude/skills/add-portfolio-project/scripts/repo_facts.sh <repo> [<repo> ...]
```

It prints, per repo: total vs. the user's commits, their first/last commit dates, top
contributors overall and during the user's span, the user's commits per month, the stack
manifests, docs and CI/runtime files, and the user's commit subjects oldest-first. The user commits as `yongle` and `Lee Yong Le`; pass `-a <regex>` for other
identities.

Then read for substance — `references/mining-repos.md` lists what to open and how to
count things. Key ideas:

- `CLAUDE.md` / `AGENTS.md` / `docs/` are usually the best summary of a codebase.
- The user's own commit subjects are the map of *their* contribution — features they
  built, fixes they made, infra they set up. Build the story around those.
- Metrics must be countable from the code (routes, screens, systems supported,
  environments). Never invent performance figures, user counts or percentages; if the
  repo has no measurement, describe the outcome in words.
- Never open real env files (`.env`, `.env.local`, `.env.prod`…) or secret stores; they
  may hold credentials. Value-free templates (`.env.example`, `.env.sample`) are fine and
  often confirm which database or services the app uses.

### 3. Report findings and ask what git can't tell you

Before writing anything, give the user a short summary: what the product is, its parts
and stack, their share of commits per repo, the strongest material for a case study, and
a draft entry. Then ask (one AskUserQuestion round) about things the repo cannot answer:

- **Role** — git shows volume, not leadership. In past runs the user was team lead and
  had set the architecture, repo structure and standards; that never shows in commits.
- **Team size** — distinct names in `git shortlog` overcount (aliases, short-term
  contributors). Offer the "contributors active during your span" list, with aliases
  merged and one-off committers dropped, as a starting guess, and ask for the real number.
- **Client naming** — whether the client can be named. Work projects usually can't:
  default to a generic label like `GOVERNMENT AGENCY` or `FINTECH CLIENT`.
- **Project name** — internal codenames are too specific and identifying. Propose a
  generic, descriptive name in the style of the site (e.g. "BUSINESS CODE REGISTRY"
  rather than the internal "BIZCODE").
- **Links** — `gh` and `live` are optional; leave them out for private repos or projects
  with no public site, and ask if there is a public URL.
- **Placement** — `PROJECTS` runs most recent first (by `year`, ongoing work first within
  a year). Propose the spot its dates give it and confirm. Inserting renumbers the
  entries after it, so tell the user to update those keys in `COMMIT_SOURCES` in `.env`
  and rerun `npm run fetch-commits`.

### 4. Write the config entry

Fill every field of `Project` / `ProjectDetails`. Conventions on this site:

| Field | Style |
|---|---|
| `num` | Two digits. Insert at the position agreed in step 3, then renumber everything after it so the sequence stays `01…NN` (routing and the page's seeded decoration both key off it). |
| `name`, `img`, `role`, `client`, `duration`, `status` | ALL CAPS, short. `img` is the card's fallback label (e.g. `'CLASSIFICATION PLATFORM'`). |
| `desc` | One sentence for the work-log card: what the product *is*, not a feature list. |
| `tags` | 3–5 headline technologies, normal casing (`'Next.js'`, `'SQL Server'`). |
| `year` | The year most of the work happened. |
| `duration` | The user's sustained active period, rounded to months. Read the "your commits per month" histogram: a lone commit months after the rest (side branch, cherry-pick) isn't part of the project and shouldn't stretch the span. |
| `overview` | What it is, who uses it, and the user's role in it (2–3 sentences). |
| `challenge` | The single hardest concrete problem, in one sentence. |
| `outcome` | What was delivered, as `;`-separated clauses with real specifics. |
| `metrics` | Exactly 3 `[LABEL, VALUE]` pairs, countable from the code. |
| `log` | 5–7 `[version, milestone]` pairs in true chronological order. The version labels are illustrative; the milestones and their order must be real. |
| `images` | One path per slot, `/projects/<slug>/<file>.svg`. |

Use a kebab-case `<slug>` from the public project name, never the internal codename —
the path is visible in the page source.

Anonymity is about more than names. A distinctive combination of details can identify
the client on its own: the exact set of sectors a regulator covers, a country's states,
a niche classification scheme. Generalize such lists in the text ("six telecom and
postal sectors" rather than naming all six), and if a detail is both identifying and
central to the story, flag it to the user rather than deciding alone.

### 5. Draw the artwork

Always draw a wireframe SVG for every slot in `ImageSlot` (currently `card`, `hero`,
`architecture`, `detail`, `process1`–`process3`). Read `references/svg-artwork.md` before
drawing — it has the palette, the size for each slot, what each slot should show, the
drawing vocabulary, and the anonymization rules. Draw each file at its slot's exact
aspect ratio so nothing is cropped or letterboxed.

Choose the subjects so the images tell the same story as the text: `detail` shows the
signature feature from `outcome`, and the process sketches illustrate `challenge` and
the key flows. Avoid drawing the same screen twice across slots.

Look at every image before moving on — hand-placed coordinates go wrong in ways you
can't see in the source (lines through boxes, clipped labels):

```bash
bash .claude/skills/add-portfolio-project/scripts/render_svgs.sh public/projects/<slug> <scratch dir>
```

Then Read each PNG it prints, fix what looks off, and re-render.

### 6. Verify

```bash
source ~/.nvm/nvm.sh && nvm use            # .nvmrc pins Node 24; the default is 22
python3 -I .claude/skills/add-portfolio-project/scripts/check_artwork.py \
    public/projects/<slug> --forbid <client> <codename> <domain> ...
npx biome format <files you touched>
npm run lint
npm run build
```

`check_artwork.py` parses every SVG, warns when a file's viewBox doesn't match its slot's
ratio, fails if any forbidden term appears in a file name or SVG text, and confirms every
`images` path for the slug in `config.ts` exists. Pass the client name, internal
codename, org acronym and domains as `--forbid`.

`npx biome format` without `--write` only checks. It can fail on `config.ts` because of
the user's own unformatted edits; if every reported diff is in code you didn't touch,
leave it and mention it — reformatting the user's work is not your call.

### 7. Hand back

Tell the user what was added, where the entry sits in `PROJECTS`, what each image shows,
anything unverified (status, team size, inferred stack details), and any identifying
detail you kept. The renders show the images alone, not in the page layout, so ask them
to check the card and `#project-<num>` with `npm run dev`.

## Working with this user

- **Small, sequential edits.** One reviewable Edit at a time — not one big rewrite of
  `config.ts`. Insert the new entry first, then renumber the others one by one.
- **Explain before changing components.** If a project seems to need a change to
  `ProjectPage.tsx` or `Projects.tsx` (a new slot, a different layout), stop and explain
  why it is needed before editing. For layout or visual decisions, load the
  `frontend-design` skill and evaluate the idea against it first.
- **Code style:** 4-space indentation (Biome), match the surrounding code's comment
  density, and never edit shadcn components under `src/components/ui/`.
- **Keep files the user asked to keep.** When an image is swapped out of a slot, leave
  the old SVG on disk unless told to delete it.
