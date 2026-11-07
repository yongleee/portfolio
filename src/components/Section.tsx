import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
    id: string
    /** Two-digit section number, shown in the red index chip. */
    idx: string
    title: string
    className?: string
    children: ReactNode
}

/** Page section with the HUD header (index chip, title, rule) that fades up once in view. */
export function Section({ id, idx, title, className, children }: SectionProps) {
    return (
        <motion.section
            id={id}
            className={cn('mx-auto max-w-300 px-5.5 py-20 md:px-10 md:py-27.5', className)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <header className="mb-12 grid grid-cols-[auto_auto_minmax(20px,1fr)] items-end gap-4.5">
                <span className="self-center bg-hot px-2.25 py-1 text-[15px] font-bold text-background shadow-glow-hot">
                    {idx}
                </span>
                <h2 className="animate-flick text-[clamp(36px,5vw,62px)] leading-[0.9] font-bold tracking-[1px] text-hot text-shadow-glow-hot motion-reduce:animate-none">
                    {title}
                </h2>
                <span
                    aria-hidden="true"
                    className="relative mb-2.5 h-0.5 bg-linear-to-r from-hot to-hot/15 after:absolute after:-top-0.75 after:right-0 after:h-2 after:w-10 after:bg-[repeating-linear-gradient(90deg,var(--hot)_0_4px,transparent_4px_8px)]"
                />
            </header>
            {children}
        </motion.section>
    )
}
