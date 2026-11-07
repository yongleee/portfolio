import type { CSSProperties, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { PROJECTS, type Project } from '@/config'
import commitActivity from '@/data/commit-activity.json'
import { cn } from '@/lib/utils'
import { Panel } from './Panel'
import { TechTag } from './TechTag'

/** Monthly commit counts written by scripts/fetch-commits.ts. */
interface Activity {
    /** First month, YYYY-MM. */
    start: string
    counts: number[]
}

const ACTIVITY: Record<string, Activity | undefined> = commitActivity.projects

/** Deterministic PRNG so each project's decorative noise is stable across renders. */
function seededRandom(seed: number) {
    let s = seed
    return () => {
        s = (s * 9301 + 49297) % 233280
        return s / 233280
    }
}

function hexColumn(seed: number, rows: number) {
    const rand = seededRandom(seed)
    return Array.from({ length: rows }, () =>
        Math.floor(rand() * 65535)
            .toString(16)
            .toUpperCase()
            .padStart(4, '0'),
    ).join('\n')
}

/** The month `offset` months after a YYYY-MM start, as e.g. "Mar 2024". */
function monthLabel(start: string, offset: number) {
    const [year, month] = start.split('-').map(Number)
    return new Date(Date.UTC(year, month - 1 + offset)).toLocaleString('en', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    })
}

/** Up to `max` evenly spaced month indices for the x-axis, always including the first and last. */
function axisTicks(months: number, max = 5) {
    if (months <= 1) return [0]
    const count = Math.min(months, max)
    return [
        ...new Set(
            Array.from({ length: count }, (_, j) => Math.round((j * (months - 1)) / (count - 1))),
        ),
    ]
}

/** One bar per month, scaled to the busiest month; empty months keep a short stub. */
function activityBars({ start, counts }: Activity) {
    const max = Math.max(...counts)
    return counts.map((count, n) => ({
        height: count ? 12 + (88 * count) / max : 4,
        title: `${monthLabel(start, n)}: ${count} ${count === 1 ? 'commit' : 'commits'}`,
    }))
}

interface CasePanelProps {
    label: string
    code?: string
    foot?: string[]
    /** Tighter body padding for panels that just frame an image slot. */
    compact?: boolean
    className?: string
    children: ReactNode
}

/** The case-file variant of Panel, with its body padding. */
function CasePanel({ compact, children, ...props }: CasePanelProps) {
    return (
        <Panel variant="case" {...props}>
            <div className={compact ? 'p-2.5' : 'p-4'}>{children}</div>
        </Panel>
    )
}

/** A project image, or a hatched placeholder where one will go. */
function Slot({ label, src, className }: { label: string; src?: string; className: string }) {
    if (src) {
        return (
            <img
                src={src}
                alt={label}
                loading="lazy"
                className={cn('w-full border object-contain', className)}
            />
        )
    }
    return (
        <div
            className={cn(
                'flex items-center justify-center border bg-hatch-strong p-2 text-center font-mono text-[10px] tracking-[2px] text-muted-foreground',
                className,
            )}
        >
            [ {label} ]
        </div>
    )
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="mb-0.75 font-mono text-[9px] tracking-[2px] whitespace-nowrap text-muted-foreground">
                {label}
            </div>
            <div className="text-[19px] leading-[1.1] font-semibold text-primary">{value}</div>
        </div>
    )
}

function Prose({ heading, children }: { heading: string; children: string }) {
    return (
        <>
            <h2 className="mt-5 mb-1.5 border-t border-dashed pt-3.5 font-mono text-[10px] tracking-[2px] text-primary">
                // {heading}
            </h2>
            <p className="text-sm leading-[1.65] text-pretty">{children}</p>
        </>
    )
}

/** The case-file page for one project, reached at #project-<num>. */
export function ProjectPage({ project }: { project: Project }) {
    const d = project.details
    const i = PROJECTS.indexOf(project)
    const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length]
    const next = PROJECTS[(i + 1) % PROJECTS.length]
    const seed = Number.parseInt(project.num, 10) * 97
    const activity = ACTIVITY[project.num]
    const range = activity && {
        bars: activityBars(activity),
        first: monthLabel(activity.start, 0),
        last: monthLabel(activity.start, activity.counts.length - 1),
        total: activity.counts.reduce((sum, count) => sum + count, 0),
        months: activity.counts.length,
        ticks: axisTicks(activity.counts.length).map((n) => ({
            n,
            label: monthLabel(activity.start, n),
        })),
    }
    const fields = [
        ['PROJECT', project.name],
        ['ROLE', d.role],
        ['CLIENT', d.client],
        ['YEAR', d.year],
        ['DURATION', d.duration],
        ['TEAM SIZE', d.team],
    ]

    return (
        <main className="mx-auto max-w-340 px-5.5 pt-24 pb-16 animate-in fade-in slide-in-from-bottom-7 duration-500 lg:px-10 lg:pt-27.5 lg:pb-20">
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b pb-3.5 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-muted-foreground">
                <Button
                    asChild
                    variant="outline"
                    className="h-auto bg-transparent px-3.5 py-2.25 font-mono text-[11px] tracking-[2px] text-primary hover:bg-primary/12 hover:text-primary hover:shadow-[0_0_12px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
                >
                    <a href="#projects">← RETURN TO WORK LOG</a>
                </Button>
                <span>DATABASE / CASE_FILES / PROJECT_{project.num}</span>
                <span>
                    RECORD {i + 1} OF {PROJECTS.length}
                </span>
            </div>

            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                <div>
                    <div className="mb-2.5 font-mono text-[11px] tracking-[3px] text-hot">
                        // CASE FILE — PROJECT_{project.num}
                    </div>
                    <h1 className="text-[clamp(36px,6vw,84px)] leading-[1.02] font-bold tracking-[-1px] wrap-anywhere text-shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_35%,transparent)]">
                        {project.name}
                    </h1>
                </div>
                <span className="bg-hot px-3 py-1.5 font-mono text-[11px] font-bold tracking-[2px] whitespace-nowrap text-background">
                    STATUS: {d.status}
                </span>
            </div>

            {/* lg: hex strip down the left (contain-size so its text never sizes
                the rows), everything else auto-placed across the two content columns. */}
            <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[44px_minmax(0,1fr)_minmax(0,1fr)]">
                <div
                    aria-hidden="true"
                    className="row-span-5 hidden overflow-hidden font-mono text-[9px] leading-[1.6] whitespace-pre text-primary/55 contain-size mask-[linear-gradient(transparent,#000_8%,#000_88%,transparent)] lg:block"
                >
                    {hexColumn(seed, 90)}
                </div>

                <CasePanel label="FEED_00" code="MAIN VISUAL" compact className="lg:col-span-2">
                    <Slot label="hero image" src={project.images?.hero} className="aspect-[16/7]" />
                </CasePanel>

                <CasePanel
                    label="PROJECT DOSSIER"
                    code={`ID-${project.num}-${d.year}`}
                    foot={['REC. CLASS: PUBLIC', `LAST SYNC ${d.year}`]}
                    className="lg:col-span-2"
                >
                    {/* Facts left, prose right; the prose splits in two only on xl,
                        where each column still keeps a readable line length. A column's
                        leading heading drops its divider once it sits beside another. */}
                    <div className="grid gap-x-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                        <div>
                            <div className="grid gap-x-5 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-1">
                                {fields.map(([label, value]) => (
                                    <Field key={label} label={label} value={value} />
                                ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1.75">
                                {project.tags.map((tag) => (
                                    <TechTag key={tag}>{tag}</TechTag>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-x-8 lg:border-l lg:border-dashed lg:pl-8 xl:grid-cols-2">
                            <div className="lg:*:first:mt-0 lg:*:first:border-t-0 lg:*:first:pt-0">
                                <Prose heading="OVERVIEW">{d.overview}</Prose>
                            </div>
                            <div className="xl:border-l xl:border-dashed xl:pl-8 xl:*:first:mt-0 xl:*:first:border-t-0 xl:*:first:pt-0">
                                <Prose heading="CHALLENGE">{d.challenge}</Prose>
                                <Prose heading="OUTCOME">{d.outcome}</Prose>
                            </div>
                        </div>
                    </div>
                </CasePanel>

                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-2">
                    {(
                        [
                            ['ARCHITECTURE', 'architecture'],
                            ['DETAIL SHOT', 'detail'],
                        ] as const
                    ).map(([g, image], n) => (
                        <CasePanel key={g} label={`FEED_0${n + 1}`} code={g} compact>
                            <Slot
                                label={`${g.toLowerCase()} image`}
                                src={project.images?.[image]}
                                className="aspect-[16/10]"
                            />
                        </CasePanel>
                    ))}
                </div>

                <div className="grid gap-6 sm:grid-cols-3 lg:col-span-2">
                    {(['process1', 'process2', 'process3'] as const).map((image, n) => (
                        <CasePanel key={image} label={`PROCESS 0${n + 1}`} code="▣" compact>
                            <Slot
                                label="sketch / wip"
                                src={project.images?.[image]}
                                className="aspect-4/3"
                            />
                        </CasePanel>
                    ))}
                </div>

                <div className="grid items-start gap-6 lg:col-span-2 lg:grid-cols-2">
                    <ol className="flex flex-col gap-2">
                        {d.log.map(([version, entry], n) => (
                            <li
                                key={version}
                                style={{ '--i': n } as CSSProperties}
                                className="grid grid-cols-[56px_minmax(0,1fr)] border border-primary/45 bg-[color-mix(in_srgb,var(--primary)_6%,var(--card))] lg:ml-[calc(var(--i)*22px)]"
                            >
                                <b className="flex items-center justify-center bg-hot font-mono text-[11px] font-normal text-background">
                                    {version}
                                </b>
                                <span className="px-3 py-2.25 text-[15px] font-semibold tracking-[0.5px]">
                                    {entry}
                                </span>
                            </li>
                        ))}
                    </ol>
                    <CasePanel label="COMMIT ACTIVITY">
                        {range ? (
                            <>
                                <div
                                    role="img"
                                    aria-label={`Commit activity: ${range.total} commits from ${range.first} to ${range.last}`}
                                    className="flex h-16 items-end gap-0.75"
                                >
                                    {range.bars.map(({ height, title }, n) => (
                                        <i
                                            key={n}
                                            title={title}
                                            className="flex-1 bg-primary opacity-75"
                                            style={{ height: `${height}%` }}
                                        />
                                    ))}
                                </div>
                                {/* Month labels sit under their bar's centre; the first and
                                    last pin to the edges so they never overflow the panel. */}
                                <div
                                    aria-hidden="true"
                                    className="relative mt-1 h-4 border-t border-primary/30 font-mono text-[9px] tracking-[1px] whitespace-nowrap text-muted-foreground uppercase *:absolute *:top-1"
                                >
                                    {range.ticks.map(({ n, label }) => {
                                        const edge =
                                            n === 0
                                                ? 'left-0'
                                                : n === range.months - 1
                                                  ? 'right-0'
                                                  : '-translate-x-1/2'
                                        return (
                                            <span
                                                key={n}
                                                className={edge}
                                                style={
                                                    edge === '-translate-x-1/2'
                                                        ? {
                                                              left: `${((n + 0.5) / range.months) * 100}%`,
                                                          }
                                                        : undefined
                                                }
                                            >
                                                {label}
                                            </span>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            // Same height as chart + axis, so the panel doesn't jump once data lands.
                            <div className="flex h-21 items-center justify-center border bg-hatch-strong font-mono text-[10px] tracking-[2px] text-muted-foreground">
                                [ NO DATA ]
                            </div>
                        )}
                    </CasePanel>
                </div>
            </div>

            <nav className="mt-12 grid gap-4.5 sm:grid-cols-2">
                {(
                    [
                        ['← PREV RECORD', prev],
                        ['NEXT RECORD →', next],
                    ] as const
                ).map(([label, p]) => (
                    <a
                        key={label}
                        href={`#project-${p.num}`}
                        className="block border px-5 py-4.5 transition-colors last:text-right hover:border-primary hover:bg-primary/6"
                    >
                        <small className="mb-1.5 block font-mono text-[10px] tracking-[2px] text-muted-foreground">
                            {label}
                        </small>
                        <strong className="text-[22px]">{p.name}</strong>
                    </a>
                ))}
            </nav>
        </main>
    )
}
