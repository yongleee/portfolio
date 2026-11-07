import { site, TYPED_LINES } from '@/config'
import { CyberButton } from './CyberButton'
import { TitleScene } from './TitleScene'
import { TypedText } from './TypedText'

export function Hero({ name }: { name: string }) {
    const displayName = name.toUpperCase()

    return (
        <header
            id="hero"
            className="relative flex h-screen min-h-160 items-center justify-center overflow-hidden"
        >
            <TitleScene />
            {/* The ::before scrim darkens the scene behind the text so it stays readable. */}
            <div className="relative z-2 -mt-[4vh] flex flex-col items-center px-5.5 text-center animate-in fade-in slide-in-from-bottom-6 duration-900 delay-300 fill-mode-both before:pointer-events-none before:absolute before:-inset-x-35 before:-inset-y-17.5 before:-z-1 before:bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,color-mix(in_srgb,var(--background)_85%,transparent),color-mix(in_srgb,var(--background)_50%,transparent)_60%,transparent_100%)]">
                <div className="mb-3.5 flex gap-6.5 font-mono text-[11px] tracking-[2px] whitespace-nowrap text-hot">
                    <span>{site.model[0]}</span>
                    <span className="text-muted-foreground">{site.model[1]}</span>
                </div>
                <h1
                    data-text={displayName}
                    className="glitch inline-block skew-x-[-8deg] text-[clamp(60px,11vw,150px)] leading-[0.86] font-bold tracking-[-1px] text-shadow-[-3px_0_color-mix(in_srgb,var(--hot)_80%,transparent),3px_0_color-mix(in_srgb,var(--primary)_70%,transparent),0_0_40px_rgb(0_0_0/0.9)]"
                >
                    {displayName}
                </h1>
                <div className="mt-7.5 flex items-center gap-3.5 border border-hot bg-[rgb(10_6_10/0.65)] px-5 py-2.5 shadow-[inset_0_0_18px_color-mix(in_srgb,var(--hot)_14%,transparent)]">
                    <TypedText
                        lines={TYPED_LINES}
                        className="min-h-[1.2em] min-w-[18ch] text-left text-[clamp(16px,1.9vw,22px)] font-semibold tracking-[2px] text-hot text-shadow-glow-hot"
                    />
                    <em className="border-l pl-3.5 font-mono text-[10px] tracking-[1px] text-muted-foreground not-italic max-sm:hidden">
                        {site.tagId}
                    </em>
                </div>
                <div className="mt-8.5 flex justify-center gap-4">
                    <CyberButton asChild>
                        <a href="#projects">VIEW WORK</a>
                    </CyberButton>
                    <CyberButton asChild tone="outline">
                        <a href="#contact">CONTACT</a>
                    </CyberButton>
                </div>
            </div>
            <div className="absolute bottom-7 left-1/2 z-3 flex w-[min(760px,86vw)] -translate-x-1/2 items-center gap-4 font-mono text-[10px] tracking-[3px] whitespace-nowrap text-hot before:h-px before:flex-1 before:bg-linear-to-r before:from-transparent before:to-hot after:h-px after:flex-1 after:bg-linear-to-r after:from-hot after:to-transparent">
                <span className="animate-blink-slow motion-reduce:animate-none">
                    SCROLL TO EXPLORE ↓
                </span>
            </div>
        </header>
    )
}
