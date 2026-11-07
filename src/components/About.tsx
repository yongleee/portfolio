import { STATS, TERMINAL } from '@/config'
import { cn } from '@/lib/utils'
import { Panel } from './Panel'
import { Section } from './Section'

const year = new Date().getFullYear()

function Terminal() {
    return (
        <Panel label="BIO.SHARD" code="~/profile.sh" foot={[`LAST SYNC ${year}`]}>
            <div className="flex-1 px-7 py-6.5 font-mono text-[13px] leading-loose">
                {TERMINAL.map(({ cmd, out, ok }, i) => (
                    <div key={cmd} className={cn(i > 0 && 'mt-2.5')}>
                        <div>
                            <span className="text-hot">$ </span>
                            <span className="text-primary">{cmd}</span>
                        </div>
                        {out.map((line) => (
                            <div
                                key={line}
                                className={cn(
                                    'pl-4.5 whitespace-pre-wrap',
                                    ok && "text-primary text-shadow-glow-sm before:content-['■_']",
                                )}
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Panel>
    )
}

export function About() {
    return (
        <Section id="about" idx="01" title="ABOUT">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <Terminal />
                <div className="grid grid-rows-2 gap-6">
                    {STATS.map(([value, label], i) => (
                        <Panel key={label} label={`STAT_0${i + 1}`} code="◆">
                            {/* Dotted halftone behind the number. */}
                            <div className="flex flex-1 flex-col justify-end bg-[radial-gradient(circle,color-mix(in_srgb,var(--hot)_22%,transparent)_1px,transparent_1.6px)] bg-size-[8px_8px] px-6.5 py-5.5">
                                <div className="text-[clamp(70px,8vw,116px)] leading-[0.85] font-bold text-primary text-shadow-glow">
                                    {value}
                                </div>
                                <div className="mt-2.5 text-base font-semibold tracking-[3px]">
                                    {label}
                                </div>
                            </div>
                        </Panel>
                    ))}
                </div>
            </div>
        </Section>
    )
}
