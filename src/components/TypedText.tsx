import { useEffect, useState } from 'react'

const TYPE_MS = 72
const DELETE_MS = 36
const HOLD_MS = 2200

/** Types each line, holds, deletes it, then moves to the next — forever. */
export function TypedText({ lines, className }: { lines: string[]; className?: string }) {
    const [index, setIndex] = useState(0)
    const [length, setLength] = useState(0)
    const [deleting, setDeleting] = useState(false)
    const current = lines[index]

    useEffect(() => {
        let step: () => void
        let delay = TYPE_MS
        if (!deleting && length < current.length) {
            step = () => setLength((l) => l + 1)
        } else if (!deleting) {
            step = () => setDeleting(true)
            delay = HOLD_MS
        } else if (length > 0) {
            step = () => setLength((l) => l - 1)
            delay = DELETE_MS
        } else {
            step = () => {
                setDeleting(false)
                setIndex((i) => (i + 1) % lines.length)
            }
            delay = 0
        }
        const t = setTimeout(step, delay)
        return () => clearTimeout(t)
    }, [length, deleting, current, lines.length])

    return (
        <p className={className}>
            {current.slice(0, length)}
            <span className="animate-blink text-primary">_</span>
        </p>
    )
}
