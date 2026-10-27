import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tones = {
    fill: 'bg-primary text-primary-foreground hover:bg-white hover:shadow-[0_0_24px_var(--primary)]',
    outline:
        'bg-transparent text-muted-foreground shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--foreground)_20%,transparent)] hover:bg-transparent hover:text-hot hover:shadow-[inset_0_0_0_1px_var(--hot)]',
}

/** shadcn Button cut into the design's slanted, mono, letter-spaced shape. */
export function CyberButton({
    tone = 'fill',
    className,
    ...props
}: ComponentProps<typeof Button> & { tone?: keyof typeof tones }) {
    return (
        <Button
            className={cn(
                'h-auto cursor-pointer border-none px-8.5 py-3.25 font-mono text-xs tracking-[3px] duration-200',
                '[clip-path:polygon(10px_0%,100%_0%,calc(100%_-_10px)_100%,0%_100%)]',
                tones[tone],
                className,
            )}
            {...props}
        />
    )
}
