import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { type CSSProperties, useRef } from 'react'
import './AmbientBg.css'

/** Positions on the 2600×2200 plane, in px. */
const LAYOUT = {
    /** left, top, width, thin? */
    bars: [
        [100, 260, 1100],
        [1400, 260, 500, 'thin'],
        [300, 420, 1800, 'thin'],
        [0, 900, 900],
        [1150, 900, 1300],
        [500, 1500, 1500, 'thin'],
        [200, 1680, 800],
        [1300, 1680, 1100, 'thin'],
        [700, 2050, 1400],
    ] as [number, number, number, 'thin'?][],
    /** left, top, width, height, scroll seconds */
    dots: [
        [260, 480, 46, 560, 7],
        [700, 1000, 30, 480, 10],
        [1180, 460, 58, 620, 8],
        [1600, 1020, 36, 520, 9],
        [2100, 520, 50, 600, 7],
        [420, 1760, 40, 440, 11],
        [1850, 1740, 54, 480, 8],
    ],
    /** left, top, width, height */
    streaks: [
        [0, 700, 2200, 150],
        [300, 1300, 2000, 90],
        [100, 1900, 1800, 120],
    ],
    /** left, top */
    crosses: [
        [1800, 80],
        [0, 1250],
    ],
}

/** Fixed site backdrop behind every section; drifts slightly as the page scrolls. */
export function AmbientBg() {
    const ref = useRef<HTMLDivElement>(null)
    const reducedMotion = useReducedMotion()
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, 'change', (y) => {
        if (!reducedMotion) ref.current?.style.setProperty('--sy', String(Math.round(y)))
    })

    return (
        <div ref={ref} className="amb" aria-hidden="true">
            <div className="amb-glow amb-g1" />
            <div className="amb-glow amb-g2" />
            <div className="amb-cam">
                <div className="amb-plane">
                    {LAYOUT.streaks.map(([left, top, width, h]) => (
                        <div
                            key={`s${left}-${top}`}
                            className="amb-streak"
                            style={{ left, top, width, '--h': `${h}px` } as CSSProperties}
                        />
                    ))}
                    {LAYOUT.dots.map(([left, top, w, h, s]) => (
                        <div
                            key={`d${left}-${top}`}
                            className="amb-dots"
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
                    {LAYOUT.bars.map(([left, top, width, thin], i) => (
                        <div
                            key={`b${left}-${top}`}
                            className={thin ? 'amb-bar thin' : 'amb-bar'}
                            style={{ left, top, width, '--d': `${6 + i * 1.7}s` } as CSSProperties}
                        />
                    ))}
                    {LAYOUT.crosses.map(([left, top]) => (
                        <div key={`c${left}-${top}`} className="amb-cross" style={{ left, top }} />
                    ))}
                </div>
            </div>
            <div className="amb-dust" />
            <div className="amb-scan" />
            <div className="amb-vig" />
        </div>
    )
}
