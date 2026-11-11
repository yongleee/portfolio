# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
    "$schema": "./node_modules/oxlint/configuration_schema.json",
    "plugins": ["react", "typescript", "oxc"],
    "options": {
        "typeAware": true
    },
    "rules": {
        "react/rules-of-hooks": "error",
        "react/only-export-components": ["warn", { "allowConstantExport": true }]
    }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Adding a project page

Project case files are generated with the Claude Code skill in
[`.claude/skills/add-portfolio-project/`](.claude/skills/add-portfolio-project/SKILL.md). It
turns local code repos into an entry in `PROJECTS` in `src/config.ts` plus anonymized
wireframe SVGs in `public/projects/<slug>/`.

### Running it

Start Claude Code in this repo (the skill is only available here), then either call it by
name:

```
/add-portfolio-project ~/client-a/backend ~/client-a/frontend
```

or ask in plain words:

```
add my client-a project to my portfolio, code is in ~/client-a
make a project page for the repos in ~/client-b
```

Give the repo folders themselves (e.g. `~/client-c/backend` and `~/client-c/frontend`), not just
their parent folder; the git history script runs once per repo.

### What it does

1. Reads the current `config.ts` and project page, then each repo's git history and code.
2. Reports what it found with a draft entry, and asks what git can't tell it:
   - your role (commits show volume, not leadership)
   - the real team size
   - whether the client can be named
   - a generic project name to use instead of the internal codename
   - any public links
   - where the project goes in the list
3. Adds the entry one small edit at a time, draws an SVG for every image slot, renders the
   SVGs to check them, and runs the artwork check, lint and build.
4. Summarizes what was added and asks you to check the page with `npm run dev`.

### Have ready

- Your role and team size.
- Anything that identifies the client: name, acronym, internal codename, domain, and
  country or region names. They are passed to the artwork check, which fails if any of
  them appear in an image or file name.

## Commit activity

The COMMIT ACTIVITY chart on each case file shows your own commits per month. The counts
come from `src/data/commit-activity.json`, which `scripts/fetch-commits.ts` writes from the
GitLab API. Only the counts go into the site; the token, GitLab host, repos and emails
stay in env vars and are never logged. Projects with no entry show NO DATA.

### Setup

Put these in `.env` (gitignored), or in the host's build env vars:

```sh
GITLAB_URL=https://gitlab.example.com
GITLAB_TOKEN=glpat-...   # personal access token, read_api scope only
GITLAB_AUTHOR_EMAILS=you@work.example,you@personal.example
COMMIT_SOURCES={"01":[412,413],"03":[977]}
```

- `GITLAB_AUTHOR_EMAILS`: every email you have committed with. Only commits by these
  emails are counted (case-insensitive).
- `COMMIT_SOURCES`: maps a project's `num` in `src/config.ts` to the numeric IDs of its
  GitLab projects. IDs are used instead of paths so repo names never show up in the code,
  logs or config. You can copy a project's ID from its GitLab page (⋮ menu → Copy project
  ID) or from Settings → General.

### Running it

```sh
npm run fetch-commits            # refresh the snapshot; commit the JSON if it changed
npm run fetch-commits -- --strict  # same, but exit 1 if any project fails
npm run build:deploy             # fetch, then build: the build command for the host
```

`npm run build` never contacts GitLab. If the token is missing or GitLab can't be
reached, the fetch keeps the last snapshot for the affected projects and exits 0, so a
deploy still succeeds.

### Refreshing and deploying

The GitLab firewall drops connections from cloud CI (GitHub Actions times out with
`UND_ERR_CONNECT_TIMEOUT`), so run the refresh by hand from a machine GitLab lets in:

```sh
scripts/refresh-commits.sh            # fetch, then commit and push the JSON if it changed
scripts/refresh-commits.sh --dry-run  # everything but the real push
```

The script fetches in its own worktree at `~/.cache/portfolio-commit-refresh`, reads `.env`
from this checkout, and pushes to `main` only when the counts changed. The push starts the
Netlify deploy, which stays a plain `npm run build`. Your own checkout is never touched, so
`git pull` afterwards to pick up the commit.

To check whether a machine can reach GitLab:
`curl -sf -H "PRIVATE-TOKEN: $GITLAB_TOKEN" "$GITLAB_URL/api/v4/version" >/dev/null && echo reachable`
