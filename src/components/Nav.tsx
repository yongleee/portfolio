import { useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { NAV_SECTIONS } from '@/config'
import { cn } from '@/lib/utils'

/**
 * Returns the last nav section whose top is within 200px of the viewport top,
 * or the final section once the page bottom is reached (it may be too short
 * to ever cross that line).
 */
function sectionAt(scrollY: number) {
    const atBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    if (atBottom) return NAV_SECTIONS[NAV_SECTIONS.length - 1]
    for (const id of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(id)
        if (el && scrollY >= el.offsetTop - 200) return id
    }
    return null
}

export function Nav({ name }: { name: string }) {
    const { scrollY } = useScroll()
    const [scrolled, setScrolled] = useState(false)
    const [active, setActive] = useState<string | null>(null)

    useMotionValueEvent(scrollY, 'change', (y) => {
        setScrolled(y > 40)
        setActive(sectionAt(y))
    })

    return (
        <nav
            className={cn(
                'fixed inset-x-0 top-0 z-200 flex items-center justify-between border-b px-5.5 py-4 backdrop-blur-[14px] transition-colors md:px-14 md:py-4.5',
                'animate-in fade-in slide-in-from-top duration-600',
                scrolled ? 'bg-background/97' : 'bg-background/70',
            )}
        >
            <span className="font-mono text-[13px] tracking-[2px] text-primary text-shadow-glow max-sm:hidden">
                // {name.toUpperCase()}
            </span>
            <ul className="flex gap-4.5 max-sm:w-full max-sm:justify-between md:gap-9">
                {NAV_SECTIONS.map((id) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            aria-current={active === id ? 'true' : undefined}
                            className={cn(
                                'relative font-mono text-[11px] tracking-[3px] text-muted-foreground transition-colors duration-200',
                                'after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200',
                                'hover:text-primary hover:text-shadow-glow-sm hover:after:scale-x-100',
                                'aria-[current=true]:text-primary aria-[current=true]:text-shadow-glow-sm aria-[current=true]:after:scale-x-100',
                            )}
                        >
                            {id.toUpperCase()}
                        </a>
                    </li>
                ))}
            </ul>
            <span className="font-mono text-[11px] tracking-[2px] text-online text-shadow-glow-sm before:content-['●_'] max-md:hidden">
                SYSTEM ONLINE
            </span>
        </nav>
    )
}
