import { type CSSProperties, useEffect, useRef } from 'react'
import './TitleScene.css'

/** Positions on the 2600×1500 plane, in px. */
const LAYOUT = {
    /** left, top, width, thin? */
    bars: [
        [180, 120, 900],
        [1150, 120, 260],
        [120, 200, 1400],
        [1560, 200, 120],
        [520, 300, 2100, 'thin'],
        [200, 390, 1250],
        [1520, 390, 980],
        [0, 1180, 1500],
        [1560, 1180, 700, 'thin'],
        [300, 1260, 900, 'thin'],
    ] as [number, number, number, 'thin'?][],
    /** left, top, width, height, scroll seconds */
    dots: [
        [300, 430, 54, 640, 5],
        [420, 470, 28, 520, 8],
        [880, 420, 70, 720, 6],
        [1060, 520, 36, 560, 9],
        [1320, 400, 60, 760, 7],
        [1500, 470, 30, 600, 5],
        [1760, 420, 52, 680, 8],
        [1980, 520, 40, 520, 6],
        [2160, 440, 64, 640, 7],
    ],
    /** left, top, width, height, sweep seconds */
    streaks: [
        [0, 540, 2300, 200, 6],
        [200, 760, 2100, 120, 4.5],
        [500, 920, 1900, 80, 7],
        [0, 1040, 1300, 60, 5.5],
    ],
}

const SCRATCHES = 70
const GRAINS = 260
const SPECKS = 50

/** Film dust: pre-drawn scratches and grain that sway slowly, plus rising specks. */
function TitleDust() {
    const ref = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const cvs = ref.current
        const ctx = cvs?.getContext('2d')
        if (!cvs || !ctx) return

        const R = Math.random
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const scratch = document.createElement('canvas')
        let raf = 0

        const build = () => {
            cvs.width = scratch.width = cvs.offsetWidth
            cvs.height = scratch.height = cvs.offsetHeight
            const s = scratch.getContext('2d')
            if (!s) return
            const { width: W, height: H } = scratch
            s.lineCap = 'round'
            for (let i = 0; i < SCRATCHES; i++) {
                const x0 = R() * W
                const y0 = R() * H
                const len = 20 + R() * 220
                const a = -0.9 + R() * 0.5 + (R() < 0.3 ? 1.8 : 0)
                s.strokeStyle = `rgba(220,235,240,${0.08 + R() * 0.28})`
                s.lineWidth = 0.6 + R() * 1.4
                s.beginPath()
                s.moveTo(x0, y0)
                s.quadraticCurveTo(
                    x0 + Math.cos(a) * len * 0.5 + (R() - 0.5) * 40,
                    y0 + Math.sin(a) * len * 0.5 + (R() - 0.5) * 40,
                    x0 + Math.cos(a) * len,
                    y0 + Math.sin(a) * len,
                )
                s.stroke()
            }
            for (let i = 0; i < GRAINS; i++) {
                s.fillStyle = `rgba(230,240,245,${R() * 0.35})`
                s.fillRect(R() * W, R() * H, 1 + R() * 2.5, 1 + R() * 2.5)
            }
        }

        const specks = Array.from({ length: SPECKS }, () => ({
            x: R(),
            y: R(),
            z: 0.3 + R() * 1.4,
            v: 0.02 + R() * 0.06,
        }))

        const draw = (t: number) => {
            const { width: W, height: H } = cvs
            ctx.clearRect(0, 0, W, H)
            const ox = Math.sin(t * 0.00007) * 30
            const oy = Math.cos(t * 0.00005) * 18
            ctx.globalAlpha = 0.85 + Math.sin(t * 0.003) * 0.08
            ctx.drawImage(scratch, ox, oy)
            ctx.globalAlpha = 1
            for (const p of specks) {
                if (!reducedMotion) {
                    p.y -= p.v * p.z * 0.004
                    p.x += p.v * 0.001
                    if (p.y < -0.05) {
                        p.y = 1.05
                        p.x = R()
                    }
                }
                ctx.fillStyle = `rgba(235,250,255,${0.25 + p.z * 0.25})`
                ctx.beginPath()
                ctx.arc(
                    (((p.x * W + ox * p.z * 2) % W) + W) % W,
                    p.y * H + oy * p.z,
                    p.z * 1.6,
                    0,
                    Math.PI * 2,
                )
                ctx.fill()
            }
            if (!reducedMotion) raf = requestAnimationFrame(draw)
        }

        // Rebuilding resets the canvas, so redraw straight away (the loop is off
        // under reduced motion).
        const onResize = () => {
            cancelAnimationFrame(raf)
            build()
            raf = requestAnimationFrame(draw)
        }

        build()
        raf = requestAnimationFrame(draw)
        window.addEventListener('resize', onResize)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return <canvas ref={ref} className="ts-dust" />
}

/** Hero background scene; colours follow --hot and --primary. Shifts with the pointer. */
export function TitleScene() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const onMove = (e: PointerEvent) => {
            el.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3))
            el.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3))
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
    }, [])

    return (
        <div ref={ref} className="ts" aria-hidden="true">
            <div className="ts-cam">
                <div className="ts-rig">
                    <div className="ts-plane">
                        <div
                            className="ts-glow"
                            style={{
                                left: 300,
                                top: 560,
                                width: 1900,
                                height: 360,
                                background: 'var(--cy)',
                            }}
                        />
                        <div
                            className="ts-glow"
                            style={{
                                left: 200,
                                top: 60,
                                width: 1600,
                                height: 260,
                                background: 'var(--red)',
                            }}
                        />
                        {LAYOUT.dots.map(([left, top, w, h, s]) => (
                            <div
                                key={`d${left}-${top}`}
                                className="ts-dots"
                                style={
                                    {
                                        left,
                                        top,
                                        '--w': `${w}px`,
                                        '--hh': `${h}px`,
                                        '--s': `${s}s`,
                                    } as CSSProperties
                                }
                            />
                        ))}
                        {LAYOUT.streaks.map(([left, top, width, h, s]) => (
                            <div
                                key={`s${left}-${top}`}
                                className="ts-streak"
                                style={
                                    {
                                        left,
                                        top,
                                        width,
                                        '--h': `${h}px`,
                                        '--s': `${s}s`,
                                    } as CSSProperties
                                }
                            />
                        ))}
                        {LAYOUT.bars.map(([left, top, width, thin], i) => (
                            <div
                                key={`b${left}-${top}`}
                                className={thin ? 'ts-bar thin' : 'ts-bar'}
                                style={
                                    { left, top, width, '--d': `${5 + i * 1.3}s` } as CSSProperties
                                }
                            />
                        ))}
                        <div className="ts-hex" style={{ left: 980, top: 30 }}>
                            07
                        </div>
                        <div className="ts-lbl" style={{ left: 260, top: 40 }}>
                            PORTFOLIO
                        </div>
                        <div className="ts-lbl" style={{ left: 1150, top: 140, fontSize: 34 }}>
                            WAKE UP SAMURAI
                        </div>
                        <div className="ts-lbl cy" style={{ left: 60, top: 1100 }}>
                            RUNNER.EXE
                        </div>
                        <div className="ts-lbl cy" style={{ left: 700, top: 1310 }}>
                            P-3461
                        </div>
                        <div className="ts-crossgrid" style={{ left: 1700, top: 0 }} />
                    </div>
                </div>
            </div>
            <div className="ts-dof" />
            <TitleDust />
            <div className="ts-scan" />
            <div className="ts-leak" />
        </div>
    )
}
