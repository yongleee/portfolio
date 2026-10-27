import { TYPED_LINES } from '@/config'
import { CyberButton } from './CyberButton'
import { HeroCanvas } from './HeroCanvas'
import { TypedText } from './TypedText'

export function Hero({ name, accent }: { name: string; accent: string }) {
    const displayName = name.toUpperCase()

    return (
        <header className="relative flex h-screen min-h-150 items-center justify-center overflow-hidden">
            <HeroCanvas accent={accent} />
            <div className="relative z-2 px-5.5 text-center animate-in fade-in slide-in-from-bottom-7 duration-900 delay-300 fill-mode-both">
                <div className="mb-5 font-mono text-[11px] tracking-[5px] text-primary/70">
                    // PORTFOLIO v2.077
                </div>
                <h1
                    data-text={displayName}
                    className="glitch inline-block text-[clamp(58px,10vw,130px)] leading-[0.9] font-bold tracking-[-1px]"
                >
                    {displayName}
                </h1>
                <TypedText
                    lines={TYPED_LINES}
                    className="mt-5.5 min-h-5.5 font-mono text-[clamp(12px,1.5vw,16px)] tracking-[4px] text-muted-foreground"
                />
                <div className="mt-12 flex justify-center gap-4.5">
                    <CyberButton asChild>
                        <a href="#projects">VIEW WORK</a>
                    </CyberButton>
                    <CyberButton asChild tone="outline">
                        <a href="#contact">CONTACT</a>
                    </CyberButton>
                </div>
            </div>
            <div className="absolute bottom-7.5 left-1/2 -translate-x-1/2 animate-blink-slow font-mono text-[10px] tracking-[3px] text-muted-foreground">
                SCROLL TO EXPLORE ↓
            </div>
        </header>
    )
}
