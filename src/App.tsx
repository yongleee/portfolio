import { MotionConfig } from 'motion/react'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { Hero } from '@/components/Hero'
import { Nav } from '@/components/Nav'
import { Projects } from '@/components/Projects'
import { Skills } from '@/components/Skills'
import { site } from '@/config'
import { cn } from '@/lib/utils'

const footerText = 'font-mono text-[10px] tracking-[2px] text-muted-foreground'
const year = new Date().getFullYear()

export default function App() {
    return (
        <MotionConfig reducedMotion="user">
            <div className={cn(site.scanlines && 'scanlines')}>
                <Nav name={site.name} />
                <Hero name={site.name} accent={site.accent} />
                <main>
                    <About />
                    <Skills />
                    <Projects />
                    <Contact />
                </main>
                <footer className="flex flex-col items-center gap-2 border-t px-5.5 py-4.5 text-center md:flex-row md:justify-between md:px-14">
                    <span className={footerText}>
                        // {site.name.toUpperCase()} — {year}
                    </span>
                    <span className={footerText}>BUILT WITH LOVE AND TOO MUCH CAFFEINE</span>
                </footer>
            </div>
        </MotionConfig>
    )
}
