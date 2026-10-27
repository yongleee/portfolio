import { useEffect, useRef } from 'react'

const NODE_COUNT = 55
const LINK_DISTANCE = 115
const GRID_SIZE = 58

interface Node {
    x: number
    y: number
    vx: number
    vy: number
    r: number
}

function hexToRgb(hex: string) {
    const v = Number.parseInt(hex.replace('#', ''), 16)
    return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`
}

/** Drifting node network over a faint grid, drawn in the accent colour. */
export function HeroCanvas({ accent }: { accent: string }) {
    const ref = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const cvs = ref.current
        const ctx = cvs?.getContext('2d')
        if (!cvs || !ctx) return

        const rgb = hexToRgb(accent)
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        let nodes: Node[] = []
        let raf = 0

        const seed = () => {
            cvs.width = cvs.offsetWidth
            cvs.height = cvs.offsetHeight
            nodes = Array.from({ length: NODE_COUNT }, () => ({
                x: Math.random() * cvs.width,
                y: Math.random() * cvs.height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.6 + 0.7,
            }))
        }

        const draw = () => {
            const { width, height } = cvs
            ctx.clearRect(0, 0, width, height)
            ctx.lineWidth = 1

            ctx.strokeStyle = `rgba(${rgb},0.04)`
            ctx.beginPath()
            for (let x = 0; x < width; x += GRID_SIZE) {
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
            }
            for (let y = 0; y < height; y += GRID_SIZE) {
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
            }
            ctx.stroke()

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
                    if (d >= LINK_DISTANCE) continue
                    ctx.strokeStyle = `rgba(${rgb},${(1 - d / LINK_DISTANCE) * 0.18})`
                    ctx.beginPath()
                    ctx.moveTo(nodes[i].x, nodes[i].y)
                    ctx.lineTo(nodes[j].x, nodes[j].y)
                    ctx.stroke()
                }
            }

            ctx.fillStyle = `rgba(${rgb},0.65)`
            for (const n of nodes) {
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
                ctx.fill()
                n.x += n.vx
                n.y += n.vy
                if (n.x < 0 || n.x > width) n.vx *= -1
                if (n.y < 0 || n.y > height) n.vy *= -1
            }

            if (!reducedMotion) raf = requestAnimationFrame(draw)
        }

        const onResize = () => {
            cancelAnimationFrame(raf)
            seed()
            draw()
        }

        seed()
        draw()
        window.addEventListener('resize', onResize)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onResize)
        }
    }, [accent])

    return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 size-full" />
}
