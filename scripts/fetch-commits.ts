/**
 * Fetches the portfolio owner's own commits from GitLab and writes monthly counts per project
 * to src/data/commit-activity.json, which ProjectPage imports for the COMMIT ACTIVITY chart.
 *
 * Config comes only from env vars (README → "Commit activity"). Nothing that identifies the
 * GitLab host, a repo or the author is logged: only project nums, totals and HTTP statuses.
 * Without a token, or when GitLab can't be reached, the committed snapshot is kept and the
 * script exits 0 so deploys never fail; pass --strict to exit 1 on any failure instead.
 */
import { readFileSync, writeFileSync } from 'node:fs'

interface ProjectActivity {
    /** First month with a commit, YYYY-MM. */
    start: string
    /** One count per month from `start`, gaps zero-filled. */
    counts: number[]
}

interface Snapshot {
    generatedAt: string | null
    projects: Record<string, ProjectActivity>
}

interface GitLabCommit {
    id: string
    author_email: string
    authored_date: string
}

const OUT = new URL('../src/data/commit-activity.json', import.meta.url)
const strict = process.argv.includes('--strict')

function log(message: string) {
    console.log(`commit-activity: ${message}`)
}

/** Stop without touching the snapshot. */
function bail(message: string): never {
    log(`${message}, keeping snapshot`)
    process.exit(strict ? 1 : 0)
}

function readSnapshot(): Snapshot {
    try {
        return JSON.parse(readFileSync(OUT, 'utf8')) as Snapshot
    } catch {
        return { generatedAt: null, projects: {} }
    }
}

/** One project per line, so weekly diffs stay readable. */
function serialize(snapshot: Snapshot) {
    const rows = Object.entries(snapshot.projects).map(
        ([num, p]) => `        ${JSON.stringify(num)}: ${JSON.stringify(p)}`,
    )
    const projects = rows.length ? `{\n${rows.join(',\n')}\n    }` : '{}'
    return `{\n    "generatedAt": ${JSON.stringify(snapshot.generatedAt)},\n    "projects": ${projects}\n}\n`
}

/** A fetch failure's code (ECONNREFUSED, ERR_INVALID_URL…); its message can contain the URL. */
function errorCode(error: unknown) {
    type Coded = { code?: unknown; errors?: Coded[] }
    const cause = (error as { cause?: Coded })?.cause
    // A host with several addresses fails with an AggregateError: one coded error per address.
    const code = cause?.code ?? cause?.errors?.[0]?.code
    return typeof code === 'string' ? code : 'unknown'
}

/** Thrown with only a status so callers can log it without leaking the URL. */
class GitLabError extends Error {}

/** Adds one GitLab project's matching commits to `buckets`, keyed by UTC YYYY-MM. */
async function collect(
    base: string,
    token: string,
    projectId: number,
    emails: Set<string>,
    seen: Set<string>,
    buckets: Map<string, number>,
) {
    let page = '1'
    while (page) {
        const url = `${base}/api/v4/projects/${projectId}/repository/commits?all=true&per_page=100&page=${page}`
        let res: Response
        try {
            res = await fetch(url, { headers: { 'PRIVATE-TOKEN': token } })
        } catch (error) {
            throw new GitLabError(`network error (${errorCode(error)})`)
        }
        if (!res.ok) throw new GitLabError(`HTTP ${res.status}`)

        for (const commit of (await res.json()) as GitLabCommit[]) {
            if (seen.has(commit.id) || !emails.has(commit.author_email.toLowerCase())) continue
            seen.add(commit.id)
            const month = new Date(commit.authored_date).toISOString().slice(0, 7)
            buckets.set(month, (buckets.get(month) ?? 0) + 1)
        }
        page = res.headers.get('x-next-page') ?? ''
    }
}

/** Dense month run from the first to the last month with a commit. */
function toActivity(buckets: Map<string, number>): ProjectActivity | undefined {
    const months = [...buckets.keys()].sort()
    if (!months.length) return undefined
    const last = months[months.length - 1]
    let [year, month] = months[0].split('-').map(Number)
    const counts: number[] = []
    for (;;) {
        const key = `${year}-${String(month).padStart(2, '0')}`
        counts.push(buckets.get(key) ?? 0)
        if (key === last) break
        month = (month % 12) + 1
        if (month === 1) year++
    }
    return { start: months[0], counts }
}

const token = process.env.GITLAB_TOKEN
if (!token) bail('no token')

const base = (process.env.GITLAB_URL ?? '').replace(/\/+$/, '')
const emails = new Set(
    (process.env.GITLAB_AUTHOR_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
)
let sources: Record<string, number[]> = {}
try {
    sources = JSON.parse(process.env.COMMIT_SOURCES ?? '')
} catch {
    bail('COMMIT_SOURCES is missing or not valid JSON')
}
if (!base) bail('GITLAB_URL is missing')
if (!emails.size) bail('GITLAB_AUTHOR_EMAILS is missing')

const previous = readSnapshot()
const projects: Record<string, ProjectActivity> = {}
let failed = false

for (const num of Object.keys(sources).sort()) {
    const ids = sources[num]
    if (!Array.isArray(ids) || !ids.every(Number.isInteger)) {
        log(`${num}: project IDs must be integers, skipped`)
        failed = true
        continue
    }
    const seen = new Set<string>()
    const buckets = new Map<string, number>()
    try {
        for (const id of ids) await collect(base, token, id, emails, seen, buckets)
    } catch (error) {
        const reason = error instanceof GitLabError ? error.message : 'unexpected error'
        log(`${num}: ${reason}, keeping previous entry`)
        if (previous.projects[num]) projects[num] = previous.projects[num]
        failed = true
        continue
    }
    const activity = toActivity(buckets)
    if (activity) projects[num] = activity
    log(`${num}: ${seen.size} commits`)
}

if (JSON.stringify(projects) === JSON.stringify(previous.projects)) {
    log('no changes')
} else {
    const today = new Date().toISOString().slice(0, 10)
    writeFileSync(OUT, serialize({ generatedAt: today, projects }))
    log(`wrote ${Object.keys(projects).length} projects`)
}
process.exit(failed && strict ? 1 : 0)
