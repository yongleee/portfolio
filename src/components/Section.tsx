import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
    id: string
    label: string
    title?: string
    className?: string
    children: ReactNode
}

/** Page section that fades up once when scrolled into view. */
export function Section({ id, label, title, className, children }: SectionProps) {
    return (
        <motion.section
            id={id}
            className={cn('mx-auto max-w-290 px-5.5 py-18 md:px-14 md:py-24', className)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="mb-1.5 font-mono text-[10px] tracking-[4px] text-primary">{label}</div>
            {title && (
                <h2 className="mb-14 text-[clamp(34px,5vw,60px)] leading-none font-bold">
                    {title}
                </h2>
            )}
            {children}
        </motion.section>
    )
}
