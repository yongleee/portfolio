import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Top-right and bottom-left corners cut at 45°. */
const CUT =
    '[clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%_-_12px))]'

const tones = {
    fill: 'bg-primary text-background hover:bg-white focus-visible:bg-white',
    // The button is painted red and a 1px-inset ::before in the same cut shape
    // covers it, leaving a red outline that follows the corners.
    outline: cn(
        'isolate bg-hot text-hot hover:bg-hot hover:text-background focus-visible:text-background',
        'before:absolute before:inset-px before:-z-1 before:bg-[#0a060a] before:transition-colors before:duration-200 hover:before:bg-hot focus-visible:before:bg-hot',
        'before:[clip-path:polygon(0_0,calc(100%_-_11.5px)_0,100%_11.5px,100%_100%,11.5px_100%,0_calc(100%_-_11.5px))]',
    ),
}

/** shadcn Button cut into the design's corner-clipped, letter-spaced shape. */
export function CyberButton({
    tone = 'fill',
    className,
    ...props
}: ComponentProps<typeof Button> & { tone?: keyof typeof tones }) {
    return (
        <Button
            className={cn(
                'relative h-auto cursor-pointer border-none px-7.5 py-3.25 text-[15px] font-bold tracking-[3px] whitespace-nowrap duration-200',
                // clip-path would cut off a focus ring, so focus reuses the hover look.
                'focus-visible:ring-0',
                CUT,
                tones[tone],
                className,
            )}
            {...props}
        />
    )
}
