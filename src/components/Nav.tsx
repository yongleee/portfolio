import { useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { NAV_SECTIONS, site } from '@/config'
import { cn } from '@/lib/utils'

/**
 * Returns the last nav section whose top is within 200px of the viewport top,
 * or the final section once the page bottom is reached (it may be too short
 * to ever cross that line). Null on pages without the sections (case files).
 */
function sectionAt(scrollY: number) {
    const last = NAV_SECTIONS[NAV_SECTIONS.length - 1]
    const atBottom = scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    if (atBottom && document.getElementById(last)) return last
    for (const id of [...NAV_SECTIONS].reverse()) {
        const el = document.getElementById(id)
        if (el && scrollY >= el.offsetTop - 200) return id
    }
    return null
}

export function Nav({ name }: { name: string }) {
    const { scrollY } = useScroll()
    const [active, setActive] = useState<string | null>(null)

    useMotionValueEvent(scrollY, 'change', (y) => setActive(sectionAt(y)))

    return (
        <nav
            className={cn(
                'fixed inset-x-0 top-0 z-200 flex h-16 items-stretch justify-between gap-6 border-b bg-background/78 px-5 backdrop-blur-md lg:px-10',
                'animate-in fade-in slide-in-from-top duration-600',
                // Red accent bar sitting on the bottom border.
                'after:absolute after:-bottom-px after:left-5 after:h-0.5 after:w-45 after:bg-hot after:shadow-glow-hot lg:after:left-10',
            )}
        >
            <a
                href="#hero"
                className="flex flex-col justify-center gap-0.5 text-xl font-bold tracking-[2px] whitespace-nowrap text-hot text-shadow-glow-hot focus-visible:outline-2 focus-visible:-outline-offset-2 max-sm:hidden"
            >
                {name.toUpperCase()}
                <small className="font-mono text-[9px] font-normal tracking-[2px] text-muted-foreground text-shadow-none">
                    {site.model.join(' ')}
                </small>
            </a>
            <ul className="flex max-sm:w-full max-sm:justify-between">
                {NAV_SECTIONS.map((id, i) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            aria-current={active === id ? 'true' : undefined}
                            className={cn(
                                'relative flex h-full items-center gap-2 px-2 text-[13px] font-semibold tracking-[1px] text-muted-foreground transition-colors sm:px-3 sm:text-[15px] sm:tracking-[2px] lg:px-5.5',
                                'hover:bg-hot/10 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2',
                                'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-primary after:opacity-0 after:shadow-glow',
                                'aria-[current=true]:bg-primary/8 aria-[current=true]:text-primary aria-[current=true]:after:opacity-100',
                            )}
                        >
                            <i className="font-mono text-[10px] text-hot/80 not-italic max-lg:hidden">
                                {String(i + 1).padStart(2, '0')}
                            </i>
                            {id.toUpperCase()}
                        </a>
                    </li>
                ))}
            </ul>
            <span className="flex items-center gap-2.5 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-primary max-lg:hidden">
                <b className="grid size-4.5 place-items-center border-[1.5px] border-primary shadow-glow after:h-0.75 after:w-2 after:bg-primary" />
                {/* Trim the line box to the caps so the glyphs, not the descender space, centre. */}
                <span className="[text-box:trim-both_cap_alphabetic]">SYSTEM ONLINE</span>
            </span>
        </nav>
    )
}
