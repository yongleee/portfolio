# Mining a repo for case-file facts

The goal is a handful of true, specific facts: what the product does, how it is built,
what the user personally did, and a few countable numbers. Read in this order and stop
once the story is clear — a case file needs depth on a few things, not a full audit.

## 1. Orientation

- `CLAUDE.md`, `AGENTS.md`, `docs/` — written for newcomers; usually the best summary of
  stack, domain, layout and the non-obvious patterns (streaming endpoints, auth model,
  quirks). Boilerplate `README.md` files (GitLab/create-next-app templates) say nothing;
  skip them.
- Stack manifests: `package.json`, `composer.json`, `pyproject.toml`, `go.mod`,
  `Cargo.toml`, `requirements.txt`. Read `dependencies` for the libraries that signal
  features (e.g. `powerbi-client` → embedded reports, `@azure/msal-node` → Entra ID SSO,
  `@ai-sdk/react` → streamed AI chat, `maatwebsite/excel` → spreadsheet import/export).

Exclude vendored and generated trees when searching: `node_modules`, `vendor`, `.next`,
`dist`, `build` output, `.venv`.

## 2. The user's contribution

`scripts/repo_facts.sh` prints the user's commit subjects oldest-first. Read them as a
timeline: clusters of subjects become the `log` milestones, and the features named there
are what `outcome` should lead with. Things to know:

- **Forked repos share history.** If two repos were split from one, their early commits
  appear in both; don't count them twice when summing.
- **Aliases.** The same person often commits under two names (`yongle` / `Lee Yong Le`,
  `saarug` / `saarugesan`). Merge them before quoting shares, and ask the user for the
  real team size rather than counting names.
- **Volume ≠ role.** Leadership, architecture and standards-setting rarely show in commit
  counts. Ask.
- **Outliers stretch spans.** `--all` includes side branches and remotes, so a stray
  commit can add months. The per-month histogram from `repo_facts.sh` makes gaps obvious.

## 3. Countable metrics

Pick three numbers a reader can sanity-check. Ways to count them:

| What | How |
|---|---|
| API routes (Laravel) | `grep -c "Route::" src/routes/api.php` |
| API routes (Express/Fastify/Nest) | grep for `router.get|post|...`, `@Get(` etc. |
| Pages (Next.js app router) | `find app/src/app -name page.tsx \| wc -l` |
| Pages (pages router / Vite SPA) | files under `pages/`, or the route table |
| Domain coverage | enums / model families (e.g. 3 classification systems) |
| Environments | branches/stages in the CI file (dev / staging / prod) |
| Languages | translation files (`en.json`, `ms.json`) |
| Integrations | distinct external services in config/services |

Avoid numbers that need production data (latency, uptime, users) unless the repo itself
records them (a benchmark file, a load-test report).

## 4. Infra and the hard parts

- CI/CD: `azure-pipelines.yml`, `.gitlab-ci.yml`, `.github/workflows/` — environments,
  registries, deployment target.
- Runtime: `Dockerfile*`, `docker-compose*`, `supervisor/`, `cron/`, nginx confs — queues,
  workers, schedulers, log shipping.
- Challenges hide in commit subjects with words like *fix*, *optimize*, *chunk*,
  *timeout*, *retry*, *missing zero*, and in "Conventions"/"Pitfalls" sections of
  CLAUDE.md. A good `challenge` names a concrete constraint (parameter limits, lost
  leading zeros, long-running publish) rather than "scalability".

When a detail will appear in text or artwork (e.g. "Azure App Service" vs "Container
Apps", "3 retries", "30 emails/min"), confirm it in the code first — grep for the config
value — so the case file never states something the repo contradicts.

## 5. Off-limits

Do not open real env files (`.env`, `.env.local`, `.env.prod`…), secret files, key
stores or credential configs — value-free templates like `.env.example` are fine — and do not copy
hostnames, internal URLs, people's names, or real records (codes, customer rows) into
the case file or artwork.
