import { MotionConfig } from 'motion/react'
import { useEffect } from 'react'
import { About } from '@/components/About'
import { AmbientBg } from '@/components/AmbientBg'
import { Contact } from '@/components/Contact'
import { Hero } from '@/components/Hero'
import { Nav } from '@/components/Nav'
import { ProjectPage } from '@/components/ProjectPage'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { PROJECTS, site } from '@/config'
import { useHash } from '@/lib/useHash'
import { cn } from '@/lib/utils'

const footerText = 'font-mono text-[10px] tracking-[2px] text-muted-foreground'
const year = new Date().getFullYear()

export default function App() {
    const hash = useHash()
    const project = PROJECTS.find((p) => hash === `project-${p.num}`)

    // Swapping views changes the page under the browser's anchor scroll: open a
    // case file at the top, and on the way back scroll to the section the hash
    // names once it exists again.
    useEffect(() => {
        if (project) window.scrollTo({ top: 0, behavior: 'instant' })
        else document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    }, [project])

    return (
        <MotionConfig reducedMotion="user">
            <div className={cn(site.scanlines && 'scanlines')}>
                <AmbientBg />
                <Nav name={site.name} />
                <div className="relative z-1">
                    {project ? (
                        <ProjectPage key={project.num} project={project} />
                    ) : (
                        <>
                            <Hero name={site.name} />
                            <main>
                                <About />
                                <Skills />
                                <Projects />
                                <Contact />
                            </main>
                        </>
                    )}
                    <footer className="relative flex flex-col items-center gap-3 border-t bg-background/75 px-5.5 py-4.5 text-center before:absolute before:-top-px before:right-5.5 before:h-0.5 before:w-45 before:bg-hot md:flex-row md:justify-between md:px-10 md:before:right-10">
                        <span className={footerText}>
                            // {site.name.toUpperCase()} — {year}
                        </span>
                        <span className={footerText}>
                            {site.model.join(' ')} // ALL SYSTEMS NOMINAL
                        </span>
                    </footer>
                </div>
            </div>
        </MotionConfig>
    )
}
