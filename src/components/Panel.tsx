import type { ComponentProps, ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const variants = {
    /** Home-page sections. */
    section: {
        frame: 'border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--hot)_9%,color-mix(in_srgb,var(--card)_72%,transparent)),color-mix(in_srgb,var(--card)_78%,transparent))] shadow-[0_0_30px_color-mix(in_srgb,var(--hot)_8%,transparent),inset_0_0_40px_color-mix(in_srgb,var(--hot)_5%,transparent)] backdrop-blur-sm after:size-2.25',
        head: 'gap-3 px-3 py-1.25 text-[11px]',
        foot: 'flex-wrap gap-3 py-2.25 text-[10px]',
    },
    /** Case-file pages: cyan-tinted body with a soft glow. */
    case: {
        frame: 'border-hot/40 bg-[color-mix(in_srgb,var(--primary)_5%,color-mix(in_srgb,var(--card)_75%,transparent))] backdrop-blur-sm shadow-[0_0_22px_color-mix(in_srgb,var(--primary)_10%,transparent),inset_0_0_30px_color-mix(in_srgb,var(--primary)_5%,transparent)] after:size-2',
        head: 'gap-2.5 px-2.5 py-1 text-[10px]',
        foot: 'gap-2.5 py-2 text-[9px] whitespace-nowrap',
    },
}

interface PanelProps extends Omit<ComponentProps<typeof Card>, 'children'> {
    label: ReactNode
    code?: ReactNode
    foot?: string[]
    variant?: keyof typeof variants
    children: ReactNode
}

/**
 * HUD frame: a solid header strip, a corner notch and an optional footer. The
 * body's padding is the caller's. The header carries data-slot="panel-head" so a
 * wrapper can restyle it, e.g. on hover.
 */
export function Panel({
    label,
    code,
    foot,
    variant = 'section',
    className,
    children,
    ...props
}: PanelProps) {
    const v = variants[variant]
    return (
        <Card
            className={cn(
                'relative gap-0 overflow-visible border py-0 ring-0',
                'after:absolute after:-top-px after:-right-px after:bg-hot after:transition-colors',
                v.frame,
                className,
            )}
            {...props}
        >
            <div
                data-slot="panel-head"
                className={cn(
                    'flex min-w-0 justify-between bg-hot font-mono font-bold tracking-[2px] text-background transition-colors *:truncate',
                    v.head,
                )}
            >
                <span>{label}</span>
                <span>{code}</span>
            </div>
            {children}
            {foot && (
                <div
                    className={cn(
                        'flex justify-between border-t px-4 font-mono tracking-[1px] text-muted-foreground',
                        v.foot,
                    )}
                >
                    {foot.map((f) => (
                        <span key={f}>{f}</span>
                    ))}
                </div>
            )}
        </Card>
    )
}
