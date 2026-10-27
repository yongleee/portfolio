import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PROJECTS, type Project } from '@/config'
import { Section } from './Section'

const MAX_TILT_DEG = 9
const SPRING = { stiffness: 300, damping: 30 }

function ProjectCard({ project }: { project: Project }) {
    const reducedMotion = useReducedMotion()
    const rotateX = useSpring(useMotionValue(0), SPRING)
    const rotateY = useSpring(useMotionValue(0), SPRING)

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (reducedMotion || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * MAX_TILT_DEG)
        rotateY.set(((e.clientX - r.left) / r.width - 0.5) * MAX_TILT_DEG)
    }
    const onPointerLeave = () => {
        rotateX.set(0)
        rotateY.set(0)
    }

    return (
        <motion.div
            className="group"
            style={{ rotateX, rotateY, transformPerspective: 700 }}
            whileHover={reducedMotion ? undefined : { y: -5 }}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <Card className="relative h-full gap-0 py-0 ring-border transition-shadow duration-300 group-hover:shadow-[0_18px_48px_rgb(0_0_0/0.5),0_0_28px_color-mix(in_srgb,var(--primary)_8%,transparent)] group-hover:ring-primary/35 before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-0.5 before:origin-left before:scale-x-0 before:bg-linear-to-r before:from-primary before:to-hot before:transition-transform before:duration-300 group-hover:before:scale-x-100">
                <div className="flex h-44 items-center justify-center border-b bg-hatch font-mono text-[10px] tracking-[3px] text-muted-foreground">
                    [ {project.img} ]
                </div>
                <div className="flex flex-1 flex-col px-6 py-5.5">
                    <div className="mb-1.5 font-mono text-[10px] tracking-[2px] text-primary">
                        PROJECT_{project.num}
                    </div>
                    <h3 className="mb-2.5 text-[21px] font-bold">{project.name}</h3>
                    <p className="mb-4 text-[13.5px] leading-[1.65] text-muted-foreground">
                        {project.desc}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-1.75">
                        {project.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className="h-auto border-primary/22 bg-primary/4 px-2.5 py-0.75 font-mono text-[10px] font-normal tracking-[1px] text-primary"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="mt-auto flex gap-4.5">
                        {[
                            ['// GITHUB', project.gh],
                            ['// LIVE DEMO', project.live],
                        ].map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                className="font-mono text-[11px] tracking-[2px] text-muted-foreground transition-colors hover:text-primary"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export function Projects() {
    return (
        <Section id="projects" label="// 03. PROJECTS" title="WORK LOG">
            <div className="grid gap-6.5 md:grid-cols-2">
                {PROJECTS.map((project) => (
                    <ProjectCard key={project.num} project={project} />
                ))}
            </div>
        </Section>
    )
}
