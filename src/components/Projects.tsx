import type { MouseEvent } from 'react'
import { PROJECTS, type Project } from '@/config'
import { cn } from '@/lib/utils'
import { Panel } from './Panel'
import { Section } from './Section'
import { TechTag } from './TechTag'

const imageBox = 'mx-3 mt-3 border'

function ProjectCard({ project }: { project: Project }) {
    const caseFile = `#project-${project.num}`

    // The whole card opens the case file; its own links keep their targets.
    const onClick = (e: MouseEvent<HTMLDivElement>) => {
        if (!(e.target as Element).closest('a')) window.location.hash = caseFile
    }

    return (
        <Panel
            label={`PROJECT_${project.num}`}
            code={project.img}
            onClick={onClick}
            className={cn(
                'group h-full cursor-pointer transition-[translate,border-color,box-shadow] duration-200',
                // Hover: lift, and the frame, header strip and corner turn cyan.
                'hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_rgb(0_0_0/0.5),0_0_26px_color-mix(in_srgb,var(--primary)_14%,transparent)]',
                'hover:after:bg-primary hover:**:data-[slot=panel-head]:bg-primary motion-reduce:hover:translate-y-0',
            )}
        >
            {/* Artwork keeps its own 1200×352 proportions; the placeholder uses the design's 16:8. */}
            {project.images?.card ? (
                <img
                    src={project.images.card}
                    alt={project.img}
                    className={cn(imageBox, 'aspect-[1200/352] object-cover')}
                />
            ) : (
                <div
                    className={cn(
                        imageBox,
                        'flex aspect-[16/8] items-center justify-center bg-hatch font-mono text-[10px] tracking-[3px] text-muted-foreground',
                    )}
                >
                    [ {project.img} ]
                </div>
            )}
            <div className="flex flex-1 flex-col px-5.5 pt-5 pb-5.5">
                <h3 className="mb-2.5 text-[28px] leading-none font-bold tracking-[1px] transition-colors group-hover:text-primary">
                    {project.name}
                </h3>
                <p className="mb-4 text-[15px] leading-[1.55] text-pretty text-muted-foreground">
                    {project.desc}
                </p>
                <div className="mb-4.5 flex flex-wrap gap-1.75">
                    {project.tags.map((tag) => (
                        <TechTag key={tag}>{tag}</TechTag>
                    ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 border-t border-dashed pt-3.5">
                    {(
                        [
                            ['// CASE FILE', caseFile],
                            ['// GITHUB', project.gh],
                            ['// LIVE DEMO', project.live],
                        ] satisfies [string, string | undefined][]
                    )
                        // GitHub and live links are optional; show only the ones that are set.
                        .filter((link): link is [string, string] => !!link[1])
                        .map(([label, href], i) => (
                            <a
                                key={label}
                                href={href}
                                className={cn(
                                    'font-mono text-[11px] tracking-[2px] transition-colors hover:text-hot',
                                    i === 0 ? 'text-hot' : 'text-muted-foreground',
                                )}
                            >
                                {label}
                            </a>
                        ))}
                </div>
            </div>
        </Panel>
    )
}

export function Projects() {
    return (
        <Section id="projects" idx="03" title="WORK LOG">
            <div className="grid gap-6.5 md:grid-cols-2">
                {PROJECTS.map((project) => (
                    <ProjectCard key={project.num} project={project} />
                ))}
            </div>
        </Section>
    )
}
